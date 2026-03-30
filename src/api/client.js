// src/api/client.js - API client for all backend calls
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// TRAINERS
export const getTrainers = () => client.get('/api/trainers');

// SERVICES
export const getServices = () => client.get('/api/services');

// APPOINTMENTS
export const getUserAppointments = (userId) => client.get(`/api/appointments/${userId}`);
export const createAppointment = (appointmentData) => client.post('/api/appointments', appointmentData);
export const cancelAppointment = (appointmentId) => client.put(`/api/appointments/${appointmentId}`);

// USERS
export const getUserProfile = (userId) => client.get(`/api/users/${userId}`);
export const createUser = (userData) => client.post('/api/users', userData);
export const updateUserProfile = (userId, userData) => client.put(`/api/users/${userId}`, userData);

// FITNESS GOALS
export const getFitnessGoals = (userId) => client.get(`/api/fitness-goals/${userId}`);
export const updateFitnessGoals = (goalsId, goalsData) => client.put(`/api/fitness-goals/${goalsId}`, goalsData);

// CONTACT/COMPLAINTS
export const submitContactForm = (contactData) => client.post('/api/contact', contactData);
export const getContacts = () => client.get('/api/contact');

// TRAINER AVAILABILITY
export const getTrainerAvailability = (trainerId) => client.get(`/api/trainer-availability/${trainerId}`);

// HEALTH CHECK
export const healthCheck = () => client.get('/api/health');

export default client;