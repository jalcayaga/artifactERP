import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
    private supabase: SupabaseClient;
    private userCache = new Map<string, { user: any; expires: number }>();
    private readonly CACHE_TTL = 30 * 1000; // 30 seconds

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        const supabaseUrl = configService.get<string>('SUPABASE_URL');

        const jwksProvider = passportJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
        });

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // Wrap the provider to add minimal error logging if needed, or revert to direct usage
            // For now, I'll keep the wrapper but remove verbose logs, so errors are still visible
            secretOrKeyProvider: (request, rawJwtToken, done) => {
                jwksProvider(request, rawJwtToken, (err, key) => {
                    if (err) {
                        console.error('SupabaseStrategy: Key resolution ERROR:', err);
                    }
                    done(err, key);
                });
            },
            // Support both HS256 (legacy) and ES256 (current)
            algorithms: ['HS256', 'ES256'],
            issuer: `${supabaseUrl}/auth/v1`,
            audience: 'authenticated',
        });

        this.supabase = createClient(
            supabaseUrl,
            configService.get<string>('SUPABASE_SERVICE_ROLE_KEY'),
        );
    }

    async validate(payload: any) {
        const userId = payload.sub;
        const now = Date.now();

        // 1. Check Cache
        const cached = this.userCache.get(userId);
        if (cached && cached.expires > now) {
            // console.log(`SupabaseStrategy: Cache HIT for user ${userId}`);
            return cached.user;
        }

        try {
            // Direct use of payload for identity
            const email = payload.email;
            const userMetadata = payload.user_metadata || {};

            // Verify and resolve Tenant ID
            let resolvedTenantId = userMetadata.tenantId;
            const tenantSlug = userMetadata.tenantSlug || userMetadata.tenantId;

            if (tenantSlug) {
                const tenant = await this.prisma.tenant.findUnique({
                    where: { slug: tenantSlug },
                    select: { id: true },
                });
                if (tenant) {
                    resolvedTenantId = tenant.id;
                } else {
                    console.warn(`SupabaseStrategy: Tenant with slug '${tenantSlug}' not found.`);
                }
            }

            if (!resolvedTenantId) {
                console.warn('SupabaseStrategy: No Tenant ID resolved from metadata');
            }

            // Fetch local user with roles
            if (resolvedTenantId && email) {
                const localUser = await this.prisma.user.findUnique({
                    where: {
                        tenantId_email: {
                            tenantId: resolvedTenantId,
                            email: email,
                        },
                    },
                    include: {
                        roles: true,
                    },
                });

                if (localUser) {
                    // Check if local user has roles. If not, fallback to metadata role.
                    if ((!localUser.roles || localUser.roles.length === 0) && userMetadata?.role) {
                        const metadataRole = String(userMetadata.role).toUpperCase();
                        // console.warn(`SupabaseStrategy: Local user has no roles. Fallback to metadata role: ${metadataRole}`);
                        (localUser as any).roles = [{ name: metadataRole }];
                    }

                    // console.log(`SupabaseStrategy: Found local user ${localUser.id} with roles:`, localUser.roles.map(r => r.name));

                    // Update Cache
                    this.userCache.set(userId, { user: localUser, expires: now + this.CACHE_TTL });
                    return localUser;
                }
            }

            // console.warn(`SupabaseStrategy: Local user not found for email ${email} in tenant ${resolvedTenantId}`);

            // Fallback: Use metadata role if local user not found
            const metadataRole = userMetadata?.role || 'VIEWER';
            const fallbackRoles = [{ name: String(metadataRole).toUpperCase() }];

            const fallbackUser = {
                id: userId,
                email: email,
                metadata: userMetadata || {},
                role: metadataRole,
                roles: fallbackRoles,
                tenantId: resolvedTenantId,
            };

            // Update Cache
            this.userCache.set(userId, { user: fallbackUser, expires: now + this.CACHE_TTL });
            return fallbackUser;

        } catch (error) {
            console.error('SupabaseStrategy validation error:', error);
            throw new UnauthorizedException('Token validation failed');
        }
    }
}
