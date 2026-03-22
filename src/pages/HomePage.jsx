import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <div className="home-card">
        <h1 className="site-title">FitBook</h1>
        <Navbar />

        <div className="hero">
          {/* Gym background via unsplash */}
          <img
            className="hero-img"
            src="/images/homeimg.jpg"
            alt="People working out in a gym"
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            <h2 className="hero-title">Discover your new fitness routine</h2>
            <p className="hero-sub">
              Explore how our services and experts can help you stay on track with your goals
              and achieve real results
            </p>
            <button className="hero-cta" onClick={() => navigate('/book')}>
              Book a Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const SERVICES = [
  {
    name: 'Personal Training',
    duration: '60 minutes',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
  },
  {
    name: 'Yoga',
    duration: '60 minutes',
    img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80',
  },
  {
    name: 'Pilates',
    duration: '80 minutes',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
  },
  {
    name: 'Nutrition',
    duration: '40 minutes',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  },
];
