import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { SupabaseRolesGuard } from '../auth/guards/supabase-roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * Example controller demonstrating Supabase Auth usage
 * 
 * This shows how to protect endpoints with Supabase authentication
 * and role-based access control.
 */
@Controller('example')
export class ExampleController {

    /**
     * Public endpoint - no authentication required
     */
    @Get('public')
    getPublicData() {
        return {
            message: 'This is public data, no authentication required',
        };
    }

    /**
     * Protected endpoint - requires valid Supabase JWT token
     * Any authenticated user can access this
     */
    @Get('protected')
    @UseGuards(SupabaseAuthGuard)
    getProtectedData(@Request() req) {
        return {
            message: 'This is protected data',
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role,
            },
        };
    }

    /**
     * Admin-only endpoint - requires authentication AND admin role
     * Only users with role 'admin' or 'superadmin' can access
     */
    @Get('admin')
    @UseGuards(SupabaseAuthGuard, SupabaseRolesGuard)
    @Roles('admin', 'superadmin')
    getAdminData(@Request() req) {
        return {
            message: 'This is admin-only data',
            user: req.user,
        };
    }

    /**
     * Staff endpoint - requires authentication AND staff/admin role
     */
    @Post('staff-action')
    @UseGuards(SupabaseAuthGuard, SupabaseRolesGuard)
    @Roles('staff', 'admin', 'superadmin')
    performStaffAction(@Request() req) {
        return {
            message: 'Staff action performed successfully',
            performedBy: req.user.email,
        };
    }

    /**
     * ERP access endpoint - requires hasErpAccess flag
     * This demonstrates checking custom metadata flags
     */
    @Get('erp-data')
    @UseGuards(SupabaseAuthGuard)
    getErpData(@Request() req) {
        if (!req.user.hasErpAccess) {
            return {
                error: 'Access denied',
                message: 'You do not have ERP access',
            };
        }

        return {
            message: 'ERP data retrieved successfully',
            data: {
                // ERP specific data
            },
        };
    }
}
