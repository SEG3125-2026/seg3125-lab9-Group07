import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { Accessibility, CalendarMonth, MenuBook } from '@mui/icons-material';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';

const HomeIcon = () => (
  <AddHomeWorkIcon style={{ width: '24px', height: '24px' }} />
);

const BookIcon = () => (
  <Accessibility style={{ width: '24px', height: '24px' }} />
);

const CalIcon = () => (
  <CalendarMonth style={{ width: '24px', height: '24px' }} />
);

const ContactIcon = () => (
  <MenuBook style={{ width: '24px', height: '24px' }} />
);

const ProfileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const HamburgerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const navLinks = [
  { to: '/',            label: 'Home',          Icon: HomeIcon },
  { to: '/book',        label: 'Book',          Icon: BookIcon },
  { to: '/appointments',label: 'Appointments',  Icon: CalIcon },
  { to: '/contact',     label: 'Contact us',    Icon: ContactIcon },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <button className="nav-hamburger"><HamburgerIcon /></button>
      <div className="nav-links">
        {navLinks.map(({ to, label, Icon }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} className={`nav-btn ${active ? 'nav-btn--active' : ''}`}>
              <Icon />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
      <Link to="/profile" className="nav-profile">
        <ProfileIcon />
      </Link>
    </nav>
  );
}
