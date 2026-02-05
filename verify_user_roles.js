
const { Client } = require('pg');

async function checkRoles() {
    const client = new Client({
        connectionString: 'postgresql://artifact_user:artifact_password@localhost:5432/subred_erp_db'
    });

    try {
        await client.connect();
        console.log('Connected to DB');

        const res = await client.query(`
      SELECT u.id, u.email, r.name as role_name
      FROM users u
      LEFT JOIN "_UserToRole" ur ON ur."A" = u.id
      LEFT JOIN roles r ON r.id = ur."B"
      WHERE u.email = 'superadmin@artifact.cl';
    `);

        console.log('User Roles:', res.rows);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

checkRoles();
