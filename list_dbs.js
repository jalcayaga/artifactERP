
const { Client } = require('pg');

async function listDbs() {
    const client = new Client({
        connectionString: 'postgresql://artifact_user:artifact_password@localhost:5432/postgres'
    });

    try {
        await client.connect();
        const res = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false;');
        console.log('Databases:', res.rows.map(r => r.datname));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

listDbs();
