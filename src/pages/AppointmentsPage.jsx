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

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        // Use stored user ID or default to 1 for demo
        const userId = localStorage.getItem('userId') || 1;
        const response = await getUserAppointments(userId);

        // Split into upcoming and past
        const now = new Date();
        const upcomingAppts = [];
        const pastAppts = [];

        response.data.forEach(appt => {
          const apptDate = new Date(appt.dateOf);
          if (appt.curStatus === 'past' || apptDate < now) {
            pastAppts.push(appt);
          } else {
            upcomingAppts.push(appt);
          }
        });

        setUpcoming(upcomingAppts);
        setPast(pastAppts);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancel = (id) => setCancelConfirm(id);

  const confirmCancel = async () => {
    try {
      await cancelAppointment(cancelConfirm);
      setUpcoming(prev => prev.filter(a => a.id !== cancelConfirm));
      setCancelConfirm(null);
    } catch (err) {
      console.error('Error canceling appointment:', err);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  const handleReschedule = (id) => {
    alert(`Reschedule flow for appointment #${id} — connect to booking flow in Lab 9.`);
  };

  const list = activeTab === 'upcoming' ? upcoming : past;

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
