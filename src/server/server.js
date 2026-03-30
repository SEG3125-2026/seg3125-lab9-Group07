// server.js (Node.js + Express)

const express = require('express');
const { Pool } = require('pg'); // PostgreSQL driver
const app = express();
const pool = new Pool({ /* your DB credentials */ });

app.get('/api/trainers', async (req, res) => {
    const result = await pool.query('SELECT * FROM trainers');
    res.json(result.rows); // This sends the data as a list
});

app.listen(5000, () => console.log("Server running on port 5000"));