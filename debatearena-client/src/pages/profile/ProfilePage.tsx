import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Settings, Calendar, History, TrendingUp, Award, Zap } from 'lucide-react';
import type { TopicRating, UserBadge } from '../../types';
import styles from './ProfilePage.module.css';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  const totalDebates = (user.totalWins || 0) + (user.totalLosses || 0) + (user.totalTies || 0);
  const winRate = totalDebates > 0 
    ? Math.round(((user.totalWins || 0) / totalDebates) * 100) + '%'
    : '0%';

  const stats = [
    { label: 'Total Debates', value: totalDebates.toString() },
    { label: 'Wins', value: (user.totalWins || 0).toString(), className: styles.winValue },
    { label: 'Losses', value: (user.totalLosses || 0).toString(), className: styles.lossValue },
    { label: 'Ties', value: (user.totalTies || 0).toString() },
    { label: 'Win Rate', value: winRate },
    { label: 'ELO Rating', value: (user.globalElo || 1000).toString(), isAccent: true },
    { label: 'Global Rank', value: '#--' }, // Placeholder for rank
  ];

  const topics = user.topicRatings || [];
  const badges = user.badges || [];

  return (
    <div className={styles.container}>
      {/* Profile Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.userBasicInfo}>
            <div className={styles.avatar}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              ) : (
                user.username?.substring(0, 2).toUpperCase()
              )}
            </div>
            <div className={styles.userDetails}>
              <h1 className={styles.username}>{user.username}</h1>
              <div className={styles.memberSince}>
                <Calendar size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Member Since {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
          <button 
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => navigate('/profile/edit')}
          >
            <Settings size={18} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <span className={`${styles.statValue} ${stat.className || ''}`}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.content}>
        {/* Topic Ratings (Left) */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Topic Ratings</h2>
          <div className={styles.topicList}>
            {topics.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No topic ratings yet. Participate in categorized debates to earn ELO!</p>
            ) : topics.map((topic: TopicRating, i: number) => (
              <div key={i} className={styles.topicItem}>
                <div className={styles.topicInfo}>
                  <span className={styles.topicName}>{topic.category?.name || 'Unknown'}</span>
                  <span className={styles.topicElo}>{topic.elo} ELO</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${Math.min((topic.elo / 2500) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements / Info (Right) */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Badges & Trophies</h2>
          <div className={styles.topicList} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {badges.length === 0 ? (
              [1, 2, 3, 4].map((n) => (
                <div key={n} style={{ 
                  backgroundColor: 'var(--surface-1)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '16px',
                  opacity: 0.3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Award size={32} color="var(--text-muted)" />
                  <span style={{ fontSize: '11px', textAlign: 'center', fontWeight: '600' }}>Locked</span>
                </div>
              ))
            ) : badges.map((b: UserBadge, i: number) => (
              <div key={i} style={{ 
                backgroundColor: 'var(--surface-1)', 
                border: '1px solid var(--accent-border)', 
                borderRadius: 'var(--radius-md)', 
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Award size={32} color="var(--accent)" />
                <span style={{ fontSize: '11px', textAlign: 'center', fontWeight: '600' }}>{b.badge?.name}</span>
              </div>
            ))}
          </div>

          <div className={`${styles.statCard} ${styles.quickMatch}`} style={{ marginTop: 'auto', border: '1px solid var(--accent-border)', background: 'var(--accent-dim)' }}>
            <Zap size={20} color="var(--accent)" style={{ margin: '0 auto 8px' }} />
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Level Up!</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>You are 160 ELO away from Platinum tier.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
