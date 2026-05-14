import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/debatearena.png';
import styles from './LandingFooter.module.css';

const LandingFooter: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <img src={logo} alt="DebateArena Logo" />
            </Link>
            <p className={styles.description}>
              The world's first AI-judged competitive debating platform. Sharpen your mind, challenge the status quo, and climb the global ranks.
            </p>
          </div>

          {/* Product Column */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Product</h4>
            <div className={styles.linkList}>
              <a href="#features" className={styles.link}>Features</a>
              <a href="#how-it-works" className={styles.link}>How it Works</a>
              <a href="#ai-judging" className={styles.link}>AI Judging</a>
              <Link to="/leaderboard" className={styles.link}>Leaderboard</Link>
            </div>
          </div>

          {/* Community Column */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Community</h4>
            <div className={styles.linkList}>
              <a href="#" className={styles.link}>Community Hub</a>
              <a href="#" className={styles.link}>Rules of Conduct</a>
              <a href="#" className={styles.link}>Official Tournaments</a>
              <a href="#" className={styles.link}>Discussion Forum</a>
            </div>
          </div>

          {/* Support Column */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Support</h4>
            <div className={styles.linkList}>
              <a href="#" className={styles.link}>Help Center</a>
              <a href="#" className={styles.link}>API Documentation</a>
              <a href="#" className={styles.link}>System Status</a>
              <a href="mailto:support@debatearena.com" className={styles.link}>Contact Us</a>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} DebateArena. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <a href="#" className={styles.link}>Privacy Policy</a>
            <a href="#" className={styles.link}>Terms of Service</a>
            <a href="#" className={styles.link}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
