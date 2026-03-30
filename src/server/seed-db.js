// seed-db.js - Run seed data
require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

async function seed() {
    try {
        const sql = fs.readFileSync('./database.sql', 'utf8');
        await pool.query(sql);
        console.log('Seed data executed successfully');
    } catch (err) {
        console.error('Error seeding database:', err.message);
    } finally {
        pool.end();
    }
}

seed();