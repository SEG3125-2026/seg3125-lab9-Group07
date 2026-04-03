CREATE TABLE trainers(
    id SERIAL PRIMARY KEY,
    trainerName VARCHAR(100) NOT NULL,
    photo VARCHAR(300) NOT NULL 
);


CREATE TABLE services(
    id SERIAL PRIMARY KEY,
    serviceName VARCHAR(100) NOT NULL,
    duration INT NOT NULL 
);


CREATE TABLE users(
    id SERIAL PRIMARY KEY, 
    userName VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(100) NOT NULL,
    fitGoals_ids INT[]
);


CREATE TABLE trainerAvailability(
    id SERIAL PRIMARY KEY,
    trainer_id INT REFERENCES trainers(id),
    mon BOOLEAN NOT NULL,
    tue BOOLEAN NOT NULL, 
    wed BOOLEAN NOT NULL, 
    thu BOOLEAN NOT NULL, 
    fri BOOLEAN NOT NULL, 
    sat BOOLEAN NOT NULL, 
    sun BOOLEAN NOT NULL 
);


CREATE TABLE fitnessGoals (
    id SERIAL PRIMARY KEY, 
    fitGoal VARCHAR(100) NOT NULL
);


CREATE TABLE appointments (
    id SERIAL PRIMARY KEY, 
    trainer_id INT REFERENCES trainers(id),
    service_id INT REFERENCES services(id),
    dateOf DATE NOT NULL,
    timeOf INT NOT NULL,
    curStatus VARCHAR(50) DEFAULT 'upcoming'
);


CREATE TABLE complaintPage (
    id SERIAL PRIMARY KEY, 
    customerName VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    complaint VARCHAR(300)
);


INSERT INTO trainers (trainerName, photo) VALUES 
('Michael Strand', 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=600&q=80'),
('John Cheng', 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=600&q=80'),
('Emma Williams', 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=600&q=80'),
('David Martinez', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80');


INSERT INTO trainerAvailability (trainer_id, mon, tue, wed, thu, fri, sat, sun) VALUES 
(1,true,false,true,true,true,false,true),
(2,false,true,false,true,true,true,true),
(3,false,false,true,true,true,true,false),
(4,true,true,true,false,true,false,false);


INSERT INTO services (serviceName, duration) VALUES 
('Peronsal Training', 60),
('Yoga', 60),
('Pilates', 80),
('Nutrition', 40);

INSERT INTO fitnessGoals (fitGoal) VALUES 
('Lose weight');
