import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile, getUserAppointments } from '../api/client';
import './ProfilePage.css';

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MAX_GOALS = 6;

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('My Profile');
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('User');
  const [username, setUsername] = useState('');
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [nextAppt, setNextAppt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId') || 1;

        // 1. Fetch Profile and Appointments in parallel
        const [profileRes, apptsRes] = await Promise.all([
          getUserProfile(userId),
          getUserAppointments(userId)
        ]);

        if (!isMounted) return;

        // Handle Profile Data
        if (profileRes?.data) {
          const dbName = profileRes.data.username || profileRes.data.userName || 'User';
          setName(dbName);
          setUsername(dbName);
        }

        // Handle Appointments Data
        if (apptsRes?.data && Array.isArray(apptsRes.data)) {
          const upcoming = apptsRes.data.find(a => 
            a.curstatus?.toLowerCase() === 'upcoming' || 
            a.curStatus?.toLowerCase() === 'upcoming'
          );
          
          if (upcoming) {
            setNextAppt({
              dateof: new Date(upcoming.dateof || upcoming.dateOf).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              }),
              timeof: upcoming.timeof || upcoming.timeOf,
              trainername: upcoming.trainername || upcoming.trainerName,
              servicename: upcoming.servicename || upcoming.serviceName,
            });
          }
        }
        setError(null);
      } catch (err) {
        console.error('Load Error:', err);
        setError('Connection to server failed. Is the backend running on port 5000?');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
    setError("Name cannot be empty!");
    return;}
    
    try {
      const userId = localStorage.getItem('userId') || 1;
      const profileData = {
        id: userId,
        username: name,
        email: `${username}@fitbook.com`,
        phone: '(123) 456-7890',
      };
      
      await updateUserProfile(profileData);
      setEditing(false);
      setError(null);
    } catch (err) {
      console.error('Save Error:', err);
      setError('Could not save profile. Check server connection.');
    }
  };

  const addGoal = () => {
    if (!newGoal.trim() || goals.length >= MAX_GOALS) return;
    setGoals(prev => [...prev, newGoal.trim()]);
    setNewGoal('');
  };

  const removeGoal = (index) => setGoals(prev => prev.filter((_, i) => i !== index));

  if (loading) return <div className="profile-loader">Loading profile...</div>;

  return (
    <div className="profile-wrapper">
      <aside className="profile-sidebar">
        <div className="sidebar-avatar">
          <svg viewBox="0 0 80 80" width="80" height="80">
            <circle cx="40" cy="40" r="40" fill="#ddd" /><circle cx="40" cy="30" r="16" fill="#bbb" /><ellipse cx="40" cy="70" rx="24" ry="18" fill="#bbb" />
          </svg>
        </div>

        {editing ? (
          <div className="sidebar-edit-fields">
            <input className="sidebar-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
            <input className="sidebar-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          </div>
        ) : (
          <>
            <p className="sidebar-name">{name}</p>
            <p className="sidebar-username">{username}</p>
          </>
        )}

        <nav className="sidebar-nav">
          {['My Profile', 'Calendar', 'Settings'].map((item) => (
            <button key={item} className={`sidebar-nav-item ${activeSection === item ? 'sidebar-nav-item--active' : ''}`} onClick={() => setActiveSection(item)}>
              {item}
            </button>
          ))}
        </nav>

        <button className="edit-profile-btn" onClick={() => (editing ? handleSaveProfile() : setEditing(true))}>
          {editing ? 'Save Profile' : 'Edit Profile'}
        </button>
      </aside>

      <main className="profile-main">
        {error && <div className="profile-error" style={{ color: 'red', marginBottom: '20px', fontWeight: 'bold' }}>{error}</div>}

        {activeSection === 'My Profile' && (
          <>
            {nextAppt && (
              <section className="profile-section">
                <h2 className="profile-section-title">Upcoming Appointment</h2>
                <div className="profile-appt-card">
                  <div className="profile-appt-left">
                    <p className="profile-appt-date">{nextAppt.dateof}</p>
                    <p className="profile-appt-time">{nextAppt.timeof}</p>
                  </div>
                  <div className="profile-appt-divider" />
                  <div className="profile-appt-right">
                    <p className="profile-appt-trainer">{nextAppt.trainername}</p>
                    <p className="profile-appt-service">{nextAppt.servicename}</p>
                  </div>
                </div>
                <button className="go-appts-btn" onClick={() => navigate('/appointments')}>
                  <CalendarIcon /> Go To Appointments
                </button>
              </section>
            )}

            <section className="profile-section">
              <h2 className="profile-section-title">My Fitness Goals</h2>
              <ul className="goals-list">
                {goals.map((goal, index) => (
                  <li key={index} className="goal-item">
                    <span className="goal-dot">•</span>
                    <span className="goal-text">{goal}</span>
                    <button className="goal-remove" onClick={() => removeGoal(index)}>✕</button>
                  </li>
                ))}
              </ul>
              {goals.length < MAX_GOALS && (
                <div className="goal-add-row">
                  <input className="goal-input" placeholder="Add a new goal…" value={newGoal} onChange={(e) => setNewGoal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addGoal()} />
                  <button className="goal-add-btn" onClick={addGoal}>Add</button>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}