import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { submitContactForm } from '../api/client';
import './ContactPage.css';

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="22" height="22">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="22" height="22">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
    <polygon points="22 2 11 13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const ClearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearField = (field) => {
    setForm(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return;

    try {
      setLoading(true);
      setError(null);
      await submitContactForm({
        customerName: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-card">
        <h1 className="site-title">FitBook</h1>
        <Navbar />

        <main className="contact-main">
          <h2 className="contact-heading">Contact us</h2>

          <div className="contact-body">
            {/* Left: Info */}
            <div className="contact-info-card">
              <div className="info-row">
                <div className="info-icon"><PhoneIcon /></div>
                <div>
                  <p className="info-label">Phone</p>
                  <p className="info-value">1-888-1234567</p>
                </div>
              </div>
              <div className="info-row">
                <div className="info-icon"><EmailIcon /></div>
                <div>
                  <p className="info-label">Email</p>
                  <p className="info-value">info@fitbook.ca</p>
                </div>
              </div>
              <div className="info-row">
                <div className="info-icon"><LocationIcon /></div>
                <div>
                  <p className="info-label">Address</p>
                  <p className="info-value">15 Rideau<br />Ottawa, ON</p>
                </div>
              </div>
              <div className="info-row">
                <div className="info-icon"><ClockIcon /></div>
                <div>
                  <p className="info-label">Business Hours</p>
                  <p className="info-value">
                    Mon–Fri: 9:00 AM – 9:00 PM<br />
                    Sat: 7:00 AM – 7:00 PM<br />
                    Sun: 10:00 AM – 4:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Please enter your name"
                    className="form-input"
                  />
                  <label className="form-label">Name</label>
                  {form.name && (
                    <button type="button" className="clear-btn" onClick={() => clearField('name')}>
                      <ClearIcon />
                    </button>
                  )}
                </div>
                <div className="form-field">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Please enter your email"
                    className="form-input"
                  />
                  <label className="form-label">Email</label>
                  {form.email && (
                    <button type="button" className="clear-btn" onClick={() => clearField('email')}>
                      <ClearIcon />
                    </button>
                  )}
                </div>
              </div>

              <div className="form-field">
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Please enter subject of your message"
                  className="form-input"
                />
                <label className="form-label">Subject</label>
                {form.subject && (
                  <button type="button" className="clear-btn" onClick={() => clearField('subject')}>
                    <ClearIcon />
                  </button>
                )}
              </div>

              <div className="form-field form-field--textarea">
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Enter your message here..."
                  className="form-input form-textarea"
                  rows={7}
                />
                <label className="form-label">Message</label>
                {form.message && (
                  <button type="button" className="clear-btn clear-btn--textarea" onClick={() => clearField('message')}>
                    <ClearIcon />
                  </button>
                )}
              </div>

              <div className="form-submit-row">
                <button type="submit" className={`send-btn ${submitted ? 'send-btn--success' : ''}`}>
                  {submitted ? (
                    <>✓ Message Sent!</>
                  ) : (
                    <><SendIcon /> Send</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
