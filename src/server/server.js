const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Assuming PostgreSQL

// to allow React to communcate with site
const app = express();
app.use(cors()); 
app.use(express.json());

// 1. Database Connection
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'appointment_db',
  password: 'your_password',
  port: 5432,
});


// 2. GET Route: Fetch all trainers
app.get('/api/trainers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trainers');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 3. DELETE Route: Remove a trainer by ID
app.delete('/api/trainers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM trainers WHERE id = $1', [id]);
    res.json({ message: "Trainer removed successfully" });
  } catch (err) {
    res.status(500).send("Could not delete trainer");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));