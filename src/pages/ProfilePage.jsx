import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const MAX_GOALS = 6;

const DEFAULT_GOALS = ['Lose 10 lbs by June', 'Run 5K without stopping', 'Improve core strength'];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('My Profile');
  const [editing, setEditing] = useState(false);
  const [name, setName]       = useState('Alex Johnson');
  const [username, setUsername] = useState('alexj');
  const [goals, setGoals]     = useState(DEFAULT_GOALS);
  const [newGoal, setNewGoal] = useState('');

  const nextAppt = { date: '25 March, 2026', time: '9:00 AM', trainer: 'Michael Strand', service: 'Personal Training' };

  const addGoal = () => {
    const trimmed = newGoal.trim();
    if (!trimmed || goals.length >= MAX_GOALS) return;
    setGoals(prev => [...prev, trimmed]);
    setNewGoal('');
  };

  const removeGoal = (i) => setGoals(prev => prev.filter((_, idx) => idx !== i));

  return (
    <div className="profile-wrapper">
      {/* Left sidebar */}
      <aside className="profile-sidebar">
        <div className="sidebar-avatar">
          <svg viewBox="0 0 80 80" width="80" height="80">
            <circle cx="40" cy="40" r="40" fill="#ddd"/>
            <circle cx="40" cy="30" r="16" fill="#bbb"/>
            <ellipse cx="40" cy="70" rx="24" ry="18" fill="#bbb"/>
          </svg>
        </div>
        {editing ? (
          <div className="sidebar-edit-fields">
            <input
              className="sidebar-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Full name"
            />
            <input
              className="sidebar-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
        ) : (
          <>
            <p className="sidebar-name">{name}</p>
            <p className="sidebar-username">{username}</p>
          </>
        )}
        <nav className="sidebar-nav">
          {['My Profile', 'Calendar', 'Settings'].map(item => (
            <button
              key={item}
              className={`sidebar-nav-item ${activeSection === item ? 'sidebar-nav-item--active' : ''}`}
              onClick={() => setActiveSection(item)}
            >
              {item}
            </button>
          ))}
        </nav>
        <button
          className="edit-profile-btn"
          onClick={() => setEditing(e => !e)}
        >
          {editing ? 'Save Profile' : 'Edit Profile'}
        </button>
      </aside>

      {/* Right content */}
      <main className="profile-main">
        {activeSection === 'My Profile' && (
          <>
            <section className="profile-section">
              <h2 className="profile-section-title">Upcoming Appointment</h2>
              <div className="profile-appt-card">
                <div className="profile-appt-left">
                  <p className="profile-appt-date">{nextAppt.date}</p>
                  <p className="profile-appt-time">{nextAppt.time}</p>
                </div>
                <div className="profile-appt-divider" />
                <div className="profile-appt-right">
                  <p className="profile-appt-trainer">{nextAppt.trainer}</p>
                  <p className="profile-appt-service">{nextAppt.service}</p>
                </div>
              </div>
              <button className="go-appts-btn" onClick={() => navigate('/appointments')}>
                <CalendarIcon /> Go To Appointments
              </button>
            </section>

            <section className="profile-section">
              <h2 className="profile-section-title">My Fitness Goals</h2>
              <ul className="goals-list">
                {goals.map((g, i) => (
                  <li key={i} className="goal-item">
                    <span className="goal-dot">•</span>
                    <span className="goal-text">{g}</span>
                    <button className="goal-remove" onClick={() => removeGoal(i)} title="Remove">✕</button>
                  </li>
                ))}
              </ul>
              {goals.length < MAX_GOALS && (
                <div className="goal-add-row">
                  <input
                    className="goal-input"
                    placeholder="Add a new goal…"
                    value={newGoal}
                    onChange={e => setNewGoal(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addGoal()}
                  />
                  <button className="goal-add-btn" onClick={addGoal}>Add</button>
                </div>
              )}
              <p className="goals-hint">Max {MAX_GOALS} fitness goals · {goals.length}/{MAX_GOALS} used</p>
            </section>
          </>
        )}

        {activeSection === 'Calendar' && (
          <div className="placeholder-section">
            <h2 className="profile-section-title">Calendar</h2>
            <p className="placeholder-text">Your booking calendar will appear here when connected to the database.</p>
          </div>
        )}

        {activeSection === 'Settings' && (
          <div className="placeholder-section">
            <h2 className="profile-section-title">Settings</h2>
            <p className="placeholder-text">Account settings will be available later.</p>
          </div>
        )}
      </main>
    </div>
  );
}
