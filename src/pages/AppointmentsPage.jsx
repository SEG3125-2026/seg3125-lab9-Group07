import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getUserAppointments, cancelAppointment } from '../api/client';
import './AppointmentsPage.css';

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);

  // Load appointments from the database
  const fetchAppointments = () => {
    fetch('http://localhost:5000/api/appointments')
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(err => console.error("Error loading appointments:", err));
  };

  useEffect(() => {
    fetchAppointments
  }, []);

  // Filter the database results based on the active tab
  const list = appointments.filter(appt =>
    activeTab === 'upcoming' ? appt.status === 'upcoming' : appt.status === 'past'
  );

  const handleCancel = (id) => setCancelConfirm(id);

  const confirmCancel = async () => {
    try {
      // Call the PUT route you created in server.js
      const response = await fetch(`http://localhost:5000/api/appointments/${cancelConfirm}/cancel`, {
        method: 'PUT'
      });

      if (response.ok) {
        setCancelConfirm(null);
        fetchAppointments(); // Refresh the list from the database
      }
    } catch (err) {
      console.error("Failed to cancel:", err);
    }
  };

  const handleReschedule = (id) => {
    navigate('/book');
  };


  return (
    <div className="page-wrapper">

      {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}
      {loading && <p style={{ textAlign: 'center' }}>Loading appointments...</p>}
      <div className="page-card">
        <h1 className="site-title">FitBook</h1>
        <Navbar />

        <main className="appt-main">
          <h2 className="appt-heading">My Appointments</h2>

          <div className="appt-tabs">
            <button
              className={`tab-btn ${activeTab === 'upcoming' ? 'tab-btn--upcoming-active' : 'tab-btn--upcoming-inactive'}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`tab-btn ${activeTab === 'past' ? 'tab-btn--past-active' : 'tab-btn--past-inactive'}`}
              onClick={() => setActiveTab('past')}
            >
              Past
            </button>
          </div>

          <div className="appt-list">
            {list.length === 0 && (
              <p className="appt-empty">No {activeTab} appointments.</p>
            )}

            {list.map(appt => (
              <div key={appt.id} className="appt-card">
                <div className="appt-info">
                  <span className="appt-trainer">{appt.trainerName || appt.trainer}</span>
                  <div className="appt-divider" />
                  <span className="appt-service">{appt.serviceName || appt.service}</span>
                </div>

                <div className="appt-date">
                  <strong>{new Date(appt.dateOf || appt.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                  <span>@ {appt.timeOf || appt.time || 'Time'}</span>
                </div>

                {activeTab === 'upcoming' && (
                  <div className="appt-actions">
                    <button className="action-btn" onClick={() => handleCancel(appt.id)}>Cancel</button>
                    <button className="action-btn" onClick={() => handleReschedule(appt.id)}>Reschedule</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main >
      </div >

      {/* Cancel Confirmation Modal */}
      {
        cancelConfirm && (
          <div className="modal-overlay">
            <div className="modal">
              <p>Are you sure you want to cancel this appointment?</p>
              <div className="modal-actions">
                <button className="modal-btn modal-btn--cancel" onClick={() => setCancelConfirm(null)}>Keep It</button>
                <button className="modal-btn modal-btn--confirm" onClick={confirmCancel}>Yes, Cancel</button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
