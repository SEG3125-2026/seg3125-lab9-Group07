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

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Server error', message: err.message });
});

// ===== TRAINERS =====
app.get('/api/trainers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM trainers');
        console.log('Trainers fetched:', result.rows.length);
        res.json(result.rows);
    } catch (err) {
        console.error('Trainers error:', err);
        res.status(500).json({ error: 'Failed to fetch trainers' });
    }
});

// ===== SERVICES =====
app.get('/api/services', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM services');
        console.log('Services fetched:', result.rows.length);
        res.json(result.rows);
    } catch (err) {
        console.error('Services error:', err);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

// ===== APPOINTMENTS =====
// Get all appointments for a user
app.get('/api/appointments/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query(
            `SELECT a.*, t.trainerName, s.serviceName 
             FROM apointments a
             JOIN trainers t ON a.trainer_id = t.id
             JOIN services s ON a.service_id = s.id
             WHERE a.user_id = $1
             ORDER BY a.dateOf DESC`,
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Create new appointment
app.post('/api/appointments', async (req, res) => {
    try {
        const { user_id, trainer_id, service_id, dateOf, timeOf } = req.body;
        const result = await pool.query(
            `INSERT INTO apointments (trainer_id, service_id, dateOf, timeOf, user_id, curStatus)
             VALUES ($1, $2, $3, $4, $5, 'upcoming')
             RETURNING *`,
            [trainer_id, service_id, dateOf, timeOf, user_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});

// Cancel appointment
app.put('/api/appointments/:appointmentId', async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const result = await pool.query(
            `UPDATE apointments SET curStatus = $1 WHERE id = $2 RETURNING *`,
            ['canceled', appointmentId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update appointment' });
    }
});

// ===== USERS & PROFILES =====
// Get user profile
app.get('/api/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query(
            `SELECT u.*, fg.* FROM users u
             LEFT JOIN fitnessGoals fg ON u.fitGoals_id = fg.id
             WHERE u.id = $1`,
            [userId]
        );
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// Create new user
app.post('/api/users', async (req, res) => {
    try {
        const { userName, email, phone } = req.body;
        const result = await pool.query(
            `INSERT INTO users (userName, email, phone)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [userName, email, phone]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update user profile
app.put('/api/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { userName, email, phone } = req.body;
        const result = await pool.query(
            `UPDATE users SET userName = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *`,
            [userName, email, phone, userId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// ===== FITNESS GOALS =====
// Get user's fitness goals
app.get('/api/fitness-goals/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query(
            `SELECT fg.* FROM fitnessGoals fg
             JOIN users u ON u.fitGoals_id = fg.id
             WHERE u.id = $1`,
            [userId]
        );
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch fitness goals' });
    }
});

// Update fitness goals
app.put('/api/fitness-goals/:goalsId', async (req, res) => {
    try {
        const { goalsId } = req.params;
        const { fitGoal1, fitGoal2, fitGoal3, fitGoal4, fitGoal5, fitGoal6 } = req.body;
        const result = await pool.query(
            `UPDATE fitnessGoals 
             SET fitGoal1 = $1, fitGoal2 = $2, fitGoal3 = $3, fitGoal4 = $4, fitGoal5 = $5, fitGoal6 = $6
             WHERE id = $7
             RETURNING *`,
            [fitGoal1, fitGoal2, fitGoal3, fitGoal4, fitGoal5, fitGoal6, goalsId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update fitness goals' });
    }
});

// ===== CONTACT & COMPLAINTS =====
// Submit contact/complaint
app.post('/api/contact', async (req, res) => {
    try {
        const { customerName, email, subject, message } = req.body;
        const result = await pool.query(
            `INSERT INTO complaintPage (customerName, email, subject, message)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [customerName, email, subject, message]
        );
        res.status(201).json({ success: true, message: 'Message received', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to submit contact message' });
    }
});

// Get all contacts (for admin)
app.get('/api/contact', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM complaintPage ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// ===== TRAINER AVAILABILITY =====
app.get('/api/trainer-availability/:trainerId', async (req, res) => {
    try {
        const { trainerId } = req.params;
        const result = await pool.query(
            'SELECT * FROM trainerAvailability WHERE trainer_id = $1',
            [trainerId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch trainer availability' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// ===== SEED DATA =====
app.get('/api/seed', async (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');
        const sql = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
        await pool.query(sql);
        res.json({ message: 'Seed data executed successfully' });
    } catch (err) {
        console.error('Seed error:', err);
        res.status(500).json({ error: 'Failed to seed database' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🗄️  Database: ${process.env.DB_NAME || 'fitbook'}`);
});