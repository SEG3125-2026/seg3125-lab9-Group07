const express = require('express');
const { Pool } = require('pg');
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

const PORT = 5000;

// USERS
// Get user profile
app.get('/api/users', async (req, res) => {
    try {
        //const { userId } = req.params;
        //const { userName, email, phone, fitGoals_ids } = req.body;
        const result = await pool.query(`SELECT * FROM users LIMIT 1`);
        //[userName, email, phone, fitGoals_ids]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// Create new user
/*app.post('/users', async (req, res) => {
    try {
        //const { userId } = req.params;
        const { userName, email, phone, fitGoals_ids, id} = req.body;
        const result = await pool.query(
            `UPDATE users SET "userName" = $1, email = $2, phone = $3, fitGoals_ids = $4 WHERE id = $5 RETURNING *`,
            [userName, email, phone, fitGoals_ids, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
}); */

// Update user profile
app.put('/api/users', async (req, res) => {
    try {
        // const { userId } = req.params;
        const { username, email, phone, fitgoals_ids, id} = req.body;
        const result = await pool.query(
            `UPDATE users SET userName = $1, email = $2, phone = $3, fitGoals_id = $4 WHERE id = $5 RETURNING *`,
            [username, email, phone, fitgoals_ids, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user' });
    }
});


// Fetch all info

// TRAINERS 
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

// SERVUCES
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

// APPOINTMENTS
// Get all appointments for a user
app.get('/api/appointments', async (req, res) => { ///:userId
    try {
        const query = `
            SELECT 
                a.*,
                t.trainername, 
                s.servicename 
            FROM appointments a
            JOIN trainers t ON a.trainer_id = t.id
            JOIN services s ON a.service_id = s.id
            ORDER BY a.dateof ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Create new appointment
app.post('/api/appointments', async (req, res) => {
    try { // user_id,
        const {trainer_id, service_id, dateOf, timeOf} = req.body;
        const result = await pool.query(
            `INSERT INTO appointments (trainer_id, service_id, dateOf, timeof, curstatus)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [trainer_id, service_id, dateOf, timeOf, 'upcoming'] //, user_id
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Booking error!", err);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});





// 1. CANCEL ROUTE
app.put('/api/appointments/cancel/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `UPDATE appointments SET curstatus = 'canceled' WHERE id = $1 RETURNING *`,
            [id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to cancel' });
    }
});

// 2. RESCHEDULE ROUTE 
app.put('/api/appointments/reschedule/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { trainer_id, service_id, dateOf, timeOf } = req.body;
        const result = await pool.query(
            `UPDATE appointments 
             SET trainer_id = $1, service_id = $2, dateof = $3, timeof = $4, curstatus = 'upcoming'
             WHERE id = $5 RETURNING *`,
            [trainer_id, service_id, dateOf, timeOf, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to reschedule' });
    }
});




// Cancel appointment
/*app.put('/api/appointments/:id', async (req, res) => {
    try {
        const { id } = req.params; //appointmentId
        const { dateOf, timeOf, trainer_id, service_id } = req.body;
        const result = await pool.query(
            `UPDATE appointments SET dateof = $1, timeof = $2, trainer_id = $3, service_id = $4, curstatus = 'upcoming'
             WHERE id = $5 RETURNING *`,
           [dateOf, timeOf, trainer_id, service_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update appointment' });
    }
});*/


// ===== FITNESS GOALS =====
// Get user's fitness goals
app.get('/api/fitnessGoals', async (req, res) => { ///:userId
    try {
        const result = await pool.query(`SELECT * FROM fitnessGoals`);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch fitness goals' });
    }
});

// Update fitness goals
app.put('/api/fitnessGoals/:goalsId', async (req, res) => {
    try {
        const { goalsId } = req.params;
        const { fitgoal } = req.body;
        const result = await pool.query(
            `UPDATE fitnessGoals SET fitGoal= $1 WHERE id = $2 RETURNING *`,
            [fitgoal, goalsId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update fitness goals' });
    }
});



// CONTACT
// Submit contact/complaint
app.post('/api/complaintPage', async (req, res) => {
    try {
        const { customername, email, title, complaint} = req.body;
        const result = await pool.query(
            `INSERT INTO complaintPage (customerName, email, title, complaint)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [customername, email, title, complaint]
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

// TRAINER AVAILABILITY
app.get('/api/trainerAvailability/:trainerId', async (req, res) => {
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


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database: ${process.env.DB_NAME || 'fitbook'}`);
    console.log(`Server is humming along at http://localhost:${PORT}`); 
});