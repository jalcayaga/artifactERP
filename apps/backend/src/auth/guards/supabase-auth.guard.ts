import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SupabaseAuthGuard extends AuthGuard('supabase') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            console.log('SupabaseAuthGuard: Auth FAILED', { err, user, info });
            throw err || new Error('Unauthorized');
        }
        // console.log('SupabaseAuthGuard: Auth SUCCESS', { userId: user.id });
        return user;
    }
}
