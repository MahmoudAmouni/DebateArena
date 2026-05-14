import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import styles from './GuestLayout.module.css';

import logo from '../../assets/debatearena.png';

const GuestLayout: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.glow} />
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logo}>
            <img src={logo} alt="DebateArena Logo" style={{ height: '66px' }} />
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default GuestLayout;
