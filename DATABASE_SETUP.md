# FitBook Database Setup Guide

## Project Overview
This is a fitness booking application (FitBook) with a React frontend and Node.js/Express backend connected to a PostgreSQL database.

## ✅ What Has Been Set Up

### Backend
- ✅ **server.js**: Complete Express API with 15+ endpoints for:
  - Trainers & Services management
  - Appointment booking/cancellation
  - User profiles & fitness goals
  - Contact form submissions
  - Trainer availability

### Frontend
- ✅ **api/client.js**: Centralized API client using axios
- ✅ **BookPage**: Now fetches trainers and services from database, books appointments
- ✅ **AppointmentsPage**: Loads user appointments from database
- ✅ **ContactPage**: Submits feedback/complaints to database
- ✅ **ProfilePage**: Loads user profile and fitness goals from database

### Database Schema
- ✅ **database.sql**: Tables for:
  - trainers
  - services
  - appointments
  - users
  - fitness_goals
  - complaints/contact

### Configuration
- ✅ **.env**: Environment variables template
- ✅ **.env.example**: Template for other developers

## 🚀 Getting Started

### Step 1: Install Dependencies

#### Frontend (already has axios):
```bash
npm install
```

#### Backend (install in new terminal):
```bash
cd src/server
npm install express pg cors dotenv
```

### Step 2: Set Up PostgreSQL Database

**Option A: Using PostgreSQL locally**

1. **Install PostgreSQL** (if not already installed):
   - Windows: https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql@15`
   - Linux: `sudo apt-get install postgresql`

2. **Start PostgreSQL service**:
   ```bash
   # Windows
   net start postgresql-x64-15
   
   # Mac
   brew services start postgresql@15
   
   # Linux
   sudo systemctl start postgresql
   ```

3. **Create a new database**:
   ```bash
   psql -U postgres
   # Then in the psql prompt:
   CREATE DATABASE fitbook;
   \c fitbook
   \i 'path/to/src/server/database.sql'
   \q
   ```

**Option B: Using a cloud database (easier)**
- Use **Supabase** (PostgreSQL hosting): https://supabase.com
  - Create account → New project → Use the connection string
- Or **ElephantSQL** (also free): https://www.elephantsql.com

### Step 3: Configure Environment Variables

1. **Edit the `.env` file** at the project root:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   DB_NAME=fitbook
   PORT=5000
   NODE_ENV=development
   VITE_API_BASE_URL=http://localhost:5000
   ```

2. **Replace values** with your actual database credentials

### Step 4: Start the Backend Server

```bash
# From the project root or src/server folder
node src/server/server.js
```

You should see:
```
✅ Server running on port 5000
🗄️  Database: fitbook
```

### Step 5: Start the Frontend

In a new terminal:
```bash
npm run dev
```

Your app will run at `http://localhost:5001`

### Step 6: Test the Connection

1. **Click "Book"** → Should see trainers and services from database
2. **Fill form and click "Book"** → Creates appointment in database
3. **Go to "Appointments"** → Should show your booked appointment
4. **Go to "Contact"** → Submit a message → Saved to database
5. **Go to "Profile"** → Shows your user info and appointments

## 📊 Database Schema

### Users
```sql
id | userName | email | phone | fitGoals_id
```

### Trainers
```sql
id | trainerName | email
```

### Services
```sql
id | serviceName | duration (in minutes)
```

### Appointments
```sql
id | user_id | trainer_id | service_id | dateOf | timeOf | curStatus
```

### Fitness Goals
```sql
id | fitGoal1-6 (up to 6 goals per user)
```

### Complaints (Contact Form)
```sql
id | customerName | email | subject | message
```

## 🔌 API Endpoints

### Trainers & Services
- `GET /api/trainers` - List all trainers
- `GET /api/services` - List all services

### Appointments
- `GET /api/appointments/:userId` - Get user's appointments
- `POST /api/appointments` - Book new appointment
- `PUT /api/appointments/:appointmentId` - Cancel appointment

### Users
- `GET /api/users/:userId` - Get user profile
- `POST /api/users` - Create new user
- `PUT /api/users/:userId` - Update user profile

### Contact/Complaints
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all submissions (admin)

### Health Check
- `GET /api/health` - Check if server is running

## 🔐 Important Security Notes

⚠️ **Before deploying to production:**
1. ❌ **Never commit `.env`** to git - it's already in `.gitignore`
2. ✅ **Use environment variables** for all sensitive data
3. ✅ **Add authentication** (JWT tokens or sessions)
4. ✅ **Add input validation** on backend
5. ✅ **Use HTTPS** in production
6. ✅ **Implement rate limiting** to prevent abuse
7. ✅ **Add CORS restrictions** - don't allow `*`

## 🐛 Troubleshooting

### "Connection refused" error
- ✅ Make sure PostgreSQL is running
- ✅ Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD in `.env`
- ✅ Verify database name is correct

### "Cannot find module 'pg'"
- ✅ Run: `npm install pg` in the project root

### "Failed to fetch" in frontend
- ✅ Make sure backend server is running on port 5000
- ✅ Check VITE_API_BASE_URL in `.env` and `vite.config.js`

### Appointments not showing up
- ✅ Make sure you're logged in with correct userId (set in localStorage)
- ✅ Check database has user with that ID
- ✅ Verify appointments were created in appointments table

## 📝 Demo Data

The database comes with default data:

**Trainers:**
- Alex Rivera (alex@fitness.com)
- Jordan Smith (jordan@fitness.com)
- Sam Taylor (sam@fitness.com)

**Services:**
- HIIT Session (45 min)
- Strength Training (60 min)
- Yoga Flow (50 min)

## 🔄 Next Steps

1. ✅ Add **authentication** (login/register)
2. ✅ Add **payment processing** for bookings
3. ✅ Add **email notifications** when appointment is booked
4. ✅ Add **admin dashboard** to view all bookings
5. ✅ Add **calendar view** for better date selection
6. ✅ Add **reviews/ratings** for trainers
7. ✅ Implement **availability management** for trainers

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Look at server logs for detailed error messages
3. Check browser console (F12) for frontend errors
4. Verify database connection with: `psql -U postgres -d fitbook`

---

**Happy coding! 🎉**
