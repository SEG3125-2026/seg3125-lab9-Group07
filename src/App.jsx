import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage         from './pages/HomePage';
import BookPage         from './pages/BookPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ContactPage      from './pages/ContactPage';
import ProfilePage      from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"             element={<HomePage />} />
        <Route path="/book"         element={<BookPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/contact"      element={<ContactPage />} />
        <Route path="/profile"      element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}
