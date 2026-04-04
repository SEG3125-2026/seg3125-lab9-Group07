import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

import { getUserAppointments, cancelAppointment } from '../api/client'; 
import './AppointmentsPage.css';

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);

  // Load appointments from the database
  const fetchAppointments = async () => {
    try{
      //setLoading(true);
      const res = await fetch('http://localhost:5000/api/appointments');
      const data = await res.json();
      console.log("DATA FROM DATABASE:", data[0]);
      setAppointments(data);
    } catch (err){
      console.error("Error loading appointments:", err);
    } finally {
      setLoading(false);
    }

    /* fetch('http://localhost:5000/api/appointments')
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(err => console.error("Error loading appointments:", err));*/
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter the database results based on the active tab
  console.log("KEYS AVAILABLE:", Object.keys(appointments[0] || {}));
  
  const list = appointments.filter(appt => {
  
    const rawStatus = appt.curstatus;
  
    const cleanStatus = String(rawStatus || "").toLowerCase().trim();

    console.log(`Filtering Appt ${appt.id}: Status is "${cleanStatus}" | ActiveTab is "${activeTab}"`);

    if (activeTab === 'upcoming') {
      // Show it if it's 'upcoming' OR if the status is missing (default to upcoming)
      return cleanStatus === 'upcoming' || cleanStatus === '';
    } else {
      return cleanStatus === 'past' || cleanStatus === 'canceled';
    }
});


  //const handleCancel = (id) => setCancelConfirm(id);

  const handleCancel = async (appointmentId) => {
  try {
    // This calls the function in your client.js which already handles axios
    await cancelAppointment(appointmentId);
    
    // Refresh the list to show the status change
    fetchAppointments(); 
    
    // If you prefer a full page refresh:
    // window.location.reload(); 
  } catch (err) {
    console.error("Cancel UI Error:", err);
    setError("Failed to cancel the appointment. Please try again.");
  }
};

  const confirmCancel = async () => {
    try {
      // Call the PUT route you created in server.js
      const response = await fetch(`http://localhost:5000/api/appointments/${cancelConfirm}`, {
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

  const handleReschedule = (appt) => {

    //debugging stuff
    console.log("Rescheduling Appt ID:", appt.id);

    navigate('/book', {
      state: {
        rescheduleMode: true,
        appointmentId: appt.id,
        initialStep:2, 
        existingService: {id: appt.service_id, servicename: appt.servicename},
        existingTrainer: {id: appt.trainer_id, trainername: appt.trainername}
      }
    });
    
  };

  // debugging stuff
  console.log("Current List:", list); // See if the array is actually empty
  console.log("First Appt Status:", appointments[0]?.curstatus);

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
                  <span className="appt-trainer">{appt.trainername || appt.trainers}</span>
                  <div className="appt-divider" />
                  <span className="appt-service">{appt.servicename || appt.services}</span>
                </div>

                <div className="appt-date">
                  <strong>{new Date(appt.dateof || appt.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                  <span>@ {appt.timeof || appt.time || 'Time'}</span>
                </div>

                {activeTab === 'upcoming' && (
                  <div className="appt-actions">
                    <button className="action-btn" onClick={() => handleCancel(appt.id)}>Cancel</button>
                    <button className="action-btn" onClick={() => handleReschedule(appt)}>Reschedule</button> 
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
