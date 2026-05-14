import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Home, Swords, Trophy, User, Bell, Plus } from 'lucide-react';
import logo from '../../assets/debatearena.png';
import styles from './AppLayout.module.css';

const AppLayout: React.FC = () => {
  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <Link to="/home">
            <img src={logo} alt="DebateArena Logo" style={{ height: '65px',marginTop:'30px' }} />
          </Link>
        </div>
        
        <nav className={styles.nav}>
          <div className={styles.navSection}>Menu</div>
          
          <NavLink 
            to="/home" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <Home size={20} />
            Home
          </NavLink>
          
          <NavLink 
            to="/debates" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <Swords size={20} />
            My Debates
          </NavLink>
          
          <NavLink 
            to="/leaderboard" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <Trophy size={20} />
            Leaderboard
          </NavLink>
          
          <NavLink 
            to="/profile" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <User size={20} />
            Profile
          </NavLink>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button className={`btn-primary ${styles.createBtn}`}>
            <Plus size={18} />
            Create Debate
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className={styles.main}>
        {/* Top Header */}
        <header className={styles.header}>
          <div className={styles.headerActions}>
            <button className={styles.iconBtn}>
              <Bell size={20} />
              <div className={styles.notificationBadge} />
            </button>
            
            <div className={styles.profileAvatar}>
              {/* Fallback to default avatar image or user initials */}
              <User size={18} color="var(--text-secondary)" />
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className={styles.contentArea}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
