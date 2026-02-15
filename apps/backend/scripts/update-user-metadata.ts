/**
 * Script to update user metadata in Supabase
 * Run with: npx ts-node scripts/update-user-metadata.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create admin client
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function updateUserMetadata() {
    const userId = 'b3977fc7-50bd-4f4b-a3d2-020b779848bc';

    console.log('🔄 Updating user metadata...');

    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
            hasErpAccess: true,
            role: 'superadmin',
            tenantId: 'artifact',
            tenantSlug: 'artifact',
            firstName: 'Super',
            lastName: 'Admin',
            email_verified: true,
        },
    });

    if (error) {
        console.error('❌ Error updating user:', error);
        process.exit(1);
    }

    console.log('✅ User metadata updated successfully!');
    console.log('Updated user:', JSON.stringify(data.user.user_metadata, null, 2));
    console.log('\n📝 Next steps:');
    console.log('1. Close session in the storefront');
    console.log('2. Login again');
    console.log('3. You should now see the "Artifact ERP" card');
}

updateUserMetadata();
