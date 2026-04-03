import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getServices, getTrainers, createAppointment } from '../api/client';
import './BookPage.css';

const SERVICE_IMAGES = {
  'Personal Training': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
  'Yoga': 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80',
  'Pilates': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
  'Nutrition': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
};

/*
const TRAINER_IMAGES = {
  'Alex Rivera': 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=600&q=80',
  'Jordan Smith': 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=600&q=80',
  'Sam Taylor': 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=600&q=80',
};
*/

const TIME_SLOTS = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'];
const STEPS = ['Select Service', 'Select Trainer', 'Select Date & Time', 'Review & Book'];


function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function Stepper({ currentStep }) {
  return (
    <div className="stepper">
      {STEPS.map((label, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <React.Fragment key={label}>
            <div className="stepper-item">
              <div className={`stepper-dot ${done ? 'stepper-dot--done' : ''} ${active ? 'stepper-dot--active' : ''}`}>
                {done ? '✓' : ''}
              </div>
              <span className={`stepper-label ${active ? 'stepper-label--active' : ''}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`stepper-line ${done ? 'stepper-line--done' : ''}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function StepService({ services, selected, onSelect, loading }) {
  if (loading) return <p style={{ textAlign: 'center' }}>Loading services...</p>;
  return (
    <div className="step-grid">
      {services.map((s) => (
        <button
          key={s.id}
          className={`grid-card ${selected?.id === s.id ? 'grid-card--selected' : ''}`}
          type="button"
          onClick={() => onSelect(s)}
        >
          <img src={SERVICE_IMAGES[s.servicename] || SERVICE_IMAGES['Personal Training']} alt={s.serviceName} className="grid-img" />
          <div className="grid-overlay">
            <span className="grid-name">{s.servicename}</span>
            <span className="grid-sub">{s.duration} minutes</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function StepTrainer({ trainers, selected, onSelect, loading }) {
  if (loading) return <p style={{ textAlign: 'center' }}>Loading trainers...</p>;
  return (
    <div className="step-grid">
      {trainers.map((t) => (
        <button
          key={t.id}
          className={`grid-card ${selected?.id === t.id ? 'grid-card--selected' : ''}`}
          type="button"
          onClick={() => onSelect(t)}
        >
          <img src={t.photo || 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=600&q=80'} alt={t.trainerName} className="grid-img" />
          <div className="grid-overlay">
            <span className="grid-name">{t.trainername}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function StepDateTime({ date, time, onDate, onTime }) {
  const today = new Date().toISOString().split('T')[0];
  return (
    <div className="datetime-layout">
      <div className="datetime-section">
        <h3 className="datetime-heading">Select Preferred Date</h3>
        <div className="calendar-wrap">
          <input type="date" className="date-input" min={today} value={date} onChange={(e) => onDate(e.target.value)} />
        </div>
      </div>
      <div className="datetime-section">
        <h3 className="datetime-heading">Select Preferred Time</h3>
        <div className="time-grid">
          {TIME_SLOTS.map((slot) => (
            <button key={slot} type="button" className={`time-btn ${time === slot ? 'time-btn--selected' : ''}`} onClick={() => onTime(slot)}>
              {slot}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepReview({ service, trainer, date, time, onBook, booked }) {
  return (
    <div className="review-layout">
      <div className="review-row">
        <span className="review-label">Service</span>
        <div className="review-value">{service?.servicename}</div>
      </div>
      <div className="review-row">
        <span className="review-label">Trainer</span>
        <div className="review-value">{trainer?.trainername}</div>
      </div>
      <div className="review-row">
        <span className="review-label">Date & Time</span>
        <div className="review-value">{formatDate(date)} — {time}</div>
      </div>
      <div className="review-cta-row">
        <button type="button" className={`book-btn ${booked ? 'book-btn--booked' : ''}`} onClick={onBook} disabled={booked}>
          {booked ? 'Appointment Booked ✓' : 'Book'}
        </button>
      </div>
    </div>
  );
}

export default function BookPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [service, setService] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [services, setServices] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, trainersRes] = await Promise.all([getServices(), getTrainers()]);
        setServices(servicesRes.data || []);
        setTrainers(trainersRes.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load services or trainers:', err);
        setError('Failed to load services or trainers. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const canNext = () => {
    if (step === 0) return !!service;
    if (step === 1) return !!trainer;
    if (step === 2) return !!date && !!time;
    return true;
  };

  const handleNext = () => {
    if (canNext() && step < 3) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  // Inside BookPage.jsx -> handleBook function

  const handleBook = async () => {
    const bookingData = {
      trainer_id: trainer.id,
      service_id: service.id,
      dateOf: date,
      timeOf: time, // e.g., "10 AM"
    };

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setBooked(true);
        setTimeout(() => navigate('/appointments'), 1800);
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Could not connect to the server.");
    }
  };

  return (
    <div className="book-wrapper">
      <div className="book-card">
        <h1 className="site-title">FitBook</h1>
        <Navbar />

        <main className="book-main">
          {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}
          <Stepper currentStep={step} />

          <div className="step-body">
            {step === 0 && <StepService services={services} selected={service} onSelect={setService} loading={loading} />}
            {step === 1 && <StepTrainer trainers={trainers} selected={trainer} onSelect={setTrainer} loading={loading} />}
            {step === 2 && <StepDateTime date={date} time={time} onDate={setDate} onTime={setTime} />}
            {step === 3 && <StepReview service={service} trainer={trainer} date={date} time={time} onBook={handleBook} booked={booked} />}
          </div>

          <div className="book-footer">
            <button type="button" className="footer-btn footer-btn--ghost" onClick={() => (step === 0 ? navigate('/') : setStep(step - 1))}>
              {step === 0 ? 'Cancel' : 'Back'}
            </button>
            {step < 3 && (
              <button type="button" className={`footer-btn footer-btn--next ${!canNext() ? 'footer-btn--disabled' : ''}`} onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()}>
                Next
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
