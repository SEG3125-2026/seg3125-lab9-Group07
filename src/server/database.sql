-- 1. Create trainers first (no dependencies)
CREATE TABLE trainers(
    id SERIAL PRIMARY KEY,
    trainerName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);


INSERT INTO trainers (trainerName, email) VALUES 
('Michael Strand', 'mstrand@fitness.com'),
('John Cheng', 'jcheng@fitness.com'),
('Emma Williams', 'ewilliams@fitness.com'),
('David Martinez', 'dmartinez@fitness.com');

INSERT INTO services (serviceName, duration) VALUES 
('Peronsal Training', 60),
('Yoga', 60),
('Pilates', 80),
('Nutrition', 40);



CREATE TABLE users(
    id SERIAL PRIMARY KEY, 
    userName VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(100) NOT NULL,
    fitGoals_id INT REFERENCES fitnessGoals(id)
);

-- 3. Create fitnessGoals (no dependencies)
CREATE TABLE fitnessGoals (
    id SERIAL PRIMARY KEY, 
    fitGoal1 VARCHAR(100),
    fitGoal2 VARCHAR(100),
    fitGoal3 VARCHAR(100),
    fitGoal4 VARCHAR(100),
    fitGoal5 VARCHAR(100),
    fitGoal6 VARCHAR(100)
);

-- 4. Create appointments (depends on trainers + services)
--    Also fixed typo: "apointments" → "appointments"
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY, 
    trainer_id INT REFERENCES trainers(id),
    service_id INT REFERENCES services(id),
    dateOf VARCHAR(100) NOT NULL,
    timeOf INT NOT NULL,
    curStatus VARCHAR(100) DEFAULT 'upcoming'
);

-- 5. Create trainerAvailability (depends on trainers)
CREATE TABLE trainerAvailability(
    id SERIAL PRIMARY KEY, 
    trainer_id INT REFERENCES trainers(id),
    unavailableDay INT -- 1 for Sunday, ..., 5 for Friday
);

-- 6. Create users (depends on fitnessGoals)
CREATE TABLE users(
    id SERIAL PRIMARY KEY, 
    userName VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(100) NOT NULL,
    fitGoals_id INT REFERENCES fitnessGoals(id)
);

-- 7. Create complaintPage (no dependencies)
CREATE TABLE complaintPage (
    id SERIAL PRIMARY KEY, 
    customerName VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    message VARCHAR(300)
);

-- 8. Seed data (insert after tables exist)
INSERT INTO trainers (trainerName, email) VALUES 
('Alex Rivera', 'alex@fitness.com'),
('Jordan Smith', 'jordan@fitness.com'),
('Sam Taylor', 'sam@fitness.com');

INSERT INTO services (serviceName, duration) VALUES 
('HIIT Session', 45),
('Strength Training', 60),
('Yoga Flow', 50);
