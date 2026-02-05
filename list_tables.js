
const { Client } = require('pg');

async function listTables() {
    const client = new Client({
        connectionString: 'postgresql://artifact_user:artifact_password@localhost:5432/subred_erp_db'
    });

    try {
        await client.connect();
        const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
        console.log('Tables:', res.rows.map(r => r.table_name));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

listTables();
