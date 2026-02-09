
const { Client } = require('pg');

async function fixRoles() {
    const client = new Client({
        connectionString: 'postgresql://artifact_user:artifact_password@localhost:5432/artifact_erp_db'
    });

    try {
        await client.connect();
        console.log('Connected to DB');

        // 1. Ensure Roles Exist
        const roles = ['SUPERADMIN', 'ADMIN', 'EDITOR', 'VIEWER', 'CLIENT'];
        for (const roleName of roles) {
            const check = await client.query('SELECT id FROM roles WHERE name = $1', [roleName]);
            if (check.rows.length === 0) {
                console.log(`Creating role: ${roleName}`);
                await client.query('INSERT INTO roles (id, name, description) VALUES ($1, $2, $3)', [createId(), roleName, `System Role ${roleName}`]);
            }
        }

        // 2. Get User ID
        const userRes = await client.query("SELECT id FROM users WHERE email = 'superadmin@artifact.cl'");
        if (userRes.rows.length === 0) {
            console.error('User not found!');
            return;
        }
        const userId = userRes.rows[0].id;
        console.log(`Found User ID: ${userId}`);

        // 3. Assign Roles
        const rolesToAssign = ['SUPERADMIN', 'ADMIN'];
        for (const roleName of rolesToAssign) {
            const roleRes = await client.query('SELECT id FROM roles WHERE name = $1', [roleName]);
            const roleId = roleRes.rows[0].id;

            // Check text
            const checkAssign = await client.query('SELECT * FROM "_UserToRole" WHERE "A" = $1 AND "B" = $2', [userId, roleId]);
            if (checkAssign.rows.length === 0) {
                console.log(`Assigning role ${roleName} to user...`);
                await client.query('INSERT INTO "_UserToRole" ("A", "B") VALUES ($1, $2) ON CONFLICT DO NOTHING', [roleId, userId]);
            } else {
                console.log(`User already has role ${roleName}`);
            }
        }

        console.log('✅ Roles Fixed!');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

// Simple CUID-like generator for SQL
function createId() {
    return 'c' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

fixRoles();
