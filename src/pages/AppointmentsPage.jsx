import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './AppointmentsPage.css';

const SAMPLE_UPCOMING = [
  { id: 1, trainer: 'Michael Strand', service: 'Personal Training', date: '25 March 2026', time: '9 AM' },
  { id: 2, trainer: 'Emmy Williams',  service: 'Yoga',              date: '26 March 2026', time: '9 AM' },
  { id: 3, trainer: 'David Martinez', service: 'Personal Training', date: '27 March 2026', time: '9 AM' },
];

const SAMPLE_PAST = [
  { id: 4, trainer: 'John Cheng',     service: 'Pilates',           date: '10 March 2026', time: '10 AM' },
  { id: 5, trainer: 'Michael Strand', service: 'Personal Training', date: '5 March 2026',  time: '11 AM' },
];

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcoming, setUpcoming]   = useState(SAMPLE_UPCOMING);
  const [past]                    = useState(SAMPLE_PAST);
  const [cancelConfirm, setCancelConfirm] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/appointments')
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(err => console.error("Error loading appointments:", err));
  }, []);


  const handleCancel = (id) => setCancelConfirm(id);

  const confirmCancel = () => {
    setUpcoming(prev => prev.filter(a => a.id !== cancelConfirm));
    setCancelConfirm(null);
  };

  const handleReschedule = (id) => {
    alert(`Reschedule flow for appointment #${id} — connect to booking flow in Lab 9.`); // send back to booking page but with empty answers
  };

  const list = activeTab === 'upcoming' ? upcoming : past;

  return (
    <div className="page-wrapper">
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
                  <span className="appt-trainer">{appt.trainer}</span>
                  <div className="appt-divider" />
                  <span className="appt-service">{appt.service}</span>
                </div>
                <div className="appt-date">
                  <strong>{appt.date}</strong>
                  <span>@ {appt.time}</span>
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
        </main>
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to cancel this appointment?</p>
            <div className="modal-actions">
              <button className="modal-btn modal-btn--cancel" onClick={() => setCancelConfirm(null)}>Keep It</button>
              <button className="modal-btn modal-btn--confirm" onClick={confirmCancel}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
