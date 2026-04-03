const express = require('express');
const { Pool } = require('pg'); // we're using postgresql
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'appointments',
    password: '1234',
    port: 5432,
});

// Fetch all info
app.get('/api/appointments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM appointments');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json(err.message);
    }
});


// ===== TRAINERS =====
app.get('/trainers', async (req, res) => {
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
app.get('/services', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM services');
        console.log('Services fetched:', result.rows.length);
        res.json(result.rows);
    } catch (err) {
        console.error('Services error:', err);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

// APPOINTMENTS
// Get all appointments for a user
app.get('/appointments', async (req, res) => { ///:userId
    try {
        const result = await pool.query('SELECT * FROM appointments');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Create new appointment
app.post('/appointments', async (req, res) => {
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
app.put('/appointments/:appointmentId', async (req, res) => {
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
app.get('/users/:userId', async (req, res) => {
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
app.post('/users', async (req, res) => {
    try {
        const { userName, email, phone, fitGoals_ids } = req.body;
        const result = await pool.query(
            `INSERT INTO users (userName, email, phone,fitGoals_ids)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [userName, email, phone, fitGoals_ids]
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