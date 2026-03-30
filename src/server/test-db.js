// test-db.js - Quick database connection test
require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

async function test() {
    try {
        const res = await pool.query('SELECT COUNT(*) FROM services');
        console.log('Services count:', res.rows[0].count);
        const res2 = await pool.query('SELECT COUNT(*) FROM trainers');
        console.log('Trainers count:', res2.rows[0].count);
    } catch (err) {
        console.error('DB Error:', err.message);
    } finally {
        pool.end();
    }
}

test();