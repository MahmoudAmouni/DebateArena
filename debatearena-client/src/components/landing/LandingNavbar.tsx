import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingNavbar.module.css';

import logo from '../../assets/debatearena.png';

const LandingNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <Link to="/" className={styles.logo}>
        <img src={logo} alt="DebateArena Logo" style={{ height: '55px' ,marginTop:"10px" }} />
      </Link>
      <div className={styles.actions}>
        <Link to="/login" className="btn-ghost">Login</Link>
        <Link to="/register" className="btn-primary">Get Started</Link>
      </div>
    </nav>
  );
};

export default LandingNavbar;
