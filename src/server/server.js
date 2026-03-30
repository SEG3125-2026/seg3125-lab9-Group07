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
// server/index.js
app.get('/api/appointments', async (req, res) => {
  try {
    const query = `
      SELECT 
        a.id, 
        t.trainerName as trainer, 
        s.serviceName as service, 
        a.dateOf as date, 
        a.timeOf as time,
        a.curStatus as status
      FROM apointments a
      JOIN trainers t ON a.trainer_id = t.id
      JOIN services s ON a.service_id = s.id
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to cancel (Update status)
app.put('/api/appointments/:id/cancel', async (req, res) => {
  const { id } = req.params;
  await pool.query("UPDATE apointments SET curStatus = 'canceled' WHERE id = $1", [id]);
  res.json({ message: "Cancelled" });
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

// Add this to your server.js

// Helper to convert "9 AM" or "2 PM" to an integer (e.g., 9 or 14)
// This matches your SQL schema where timeOf is an INT
const parseTimeToInt = (timeStr) => {
  const [hourStr, modifier] = timeStr.split(' ');
  let hour = parseInt(hourStr);
  if (modifier === 'PM' && hour !== 12) hour += 12;
  if (modifier === 'AM' && hour === 12) hour = 0;
  return hour;
};

app.post('/api/appointments', async (req, res) => {
  const { trainer_id, service_id, dateOf, timeOf } = req.body;

  try {
    const timeInt = parseTimeToInt(timeOf);
    
    const query = `
      INSERT INTO apointments (trainer_id, service_id, dateOf, timeOf, curStatus)
      VALUES ($1, $2, $3, $4, 'upcoming')
      RETURNING *;
    `;
    
    const values = [trainer_id, service_id, dateOf, timeInt];
    const result = await pool.query(query, values);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error while booking" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));