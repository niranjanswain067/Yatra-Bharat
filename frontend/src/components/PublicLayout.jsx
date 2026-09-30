import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import '../styles/public.css';

const PublicLayout = () => {
  return (
    <>
      <nav className="public-nav">
        <Link to="/" className="brand">Yatra Bharat</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/destinations">Destinations</Link>
          <Link to="/plans">Travel Plans</Link>
          <Link to="/admin/login" style={{ color: 'var(--primary)' }}>Admin</Link>
        </div>
      </nav>
      
      <main>
        <Outlet />
      </main>

      <footer style={{ backgroundColor: 'var(--dark)', color: 'white', padding: '3rem', textAlign: 'center', marginTop: '4rem' }}>
        <p>&copy; {new Date().getFullYear()} Yatra Bharat. All rights reserved.</p>
        <p style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '1rem' }}>Designed with ❤️ for Incredible India</p>
      </footer>
    </>
  );
};

export default PublicLayout;
