CREATE TABLE apointments (
    id SERIAL PRIMARY KEY, 
    trainer_id INT REFERENCES trainers(id),
    service_id INT REFERENCES services(id),
    dateOf VARCHAR(100) NOT NULL,
    timeOf INT NOT NULL,
    curStatus VARCHAR(100) DEFAULT 'upcoming' -- otherwise: 'canceled', 'past' 
);

CREATE TABLE services(
    id SERIAL PRIMARY KEY,
    serviceName VARCHAR(100) NOT NULL,
    duration INT NOT NULL
);


CREATE TABLE trainerAvailability(
    id SERIAL PRIMARY KEY, 
    trainer_id INT REFERENCES trainers(id),
    unavaibleDay INT -- 1 for Sunday,..., 5 for Firday
);

CREATE TABLE trainers(
    id SERIAL PRIMARY KEY,
    trainerName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE user (
    id SERIAL PRIMARY KEY, 
    userName VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(100) NOT NULL,
    fitGoal1 VARCHAR(100),
    fitGoal2 VARCHAR(100),
    fitGoal3 VARCHAR(100),
    fitGoal4 VARCHAR(100),
    fitGoal5 VARCHAR(100),
    fitGoal6 VARCHAR(100)
);

CREATE TABLE complaintPage (
    id SERIAL PRIMARY KEY, 
    customerName VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    message VARCHAR(300),

);