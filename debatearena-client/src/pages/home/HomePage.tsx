import React, { useState } from 'react';
import { Users, Eye, Zap, Loader2 } from 'lucide-react';
import { useSessions } from '../../hooks/queries/useSessions';
import { useLeaderboard } from '../../hooks/queries/useLeaderboard';
import type { User } from '../../types';
import DebateCard from '../../components/shared/DebateCard';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'recent'>('live');

  const { data: sessionsData, isLoading: sessionsLoading } = useSessions(activeTab);
  const { data: leaderboardData, isLoading: leaderboardLoading } = useLeaderboard(5);

  const displayedDebates = sessionsData?.sessions || [];
  const topDebaters = leaderboardData?.data || [];

  return (
    <div className={styles.container}>
      {/* Main Feed */}
      <div className={styles.mainFeed}>
        <div className={styles.feedHeader}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'live' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('live')}
            >
              Live Now
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'upcoming' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'recent' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('recent')}
            >
              Recent Verdicts
            </button>
          </div>
        </div>

        <div className={styles.cardList}>
          {sessionsLoading ? (
            <div className={styles.card} style={{ alignItems: 'center', padding: '40px' }}>
              <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent)' }} />
            </div>
          ) : displayedDebates.length === 0 ? (
            <div className={styles.card} style={{ alignItems: 'center', padding: '40px' }}>
              <p className={styles.cardDesc}>No debates found in this category.</p>
              <button className="btn-ghost">Start a Debate</button>
            </div>
          ) : (
            displayedDebates.map((debate) => (
              <DebateCard key={debate.id} debate={debate} />
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={styles.rightSidebar}>
        <div className={`${styles.widget} ${styles.quickMatch}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Zap size={20} color="var(--accent)" />
            <h3 className={styles.quickMatchTitle}>Quick Match</h3>
          </div>
          <p className={styles.quickMatchDesc}>
            Ready to argue? Jump into a random unranked 1v1 debate right now.
          </p>
          <button className="btn-primary" style={{ width: '100%', height: '36px', fontSize: '13px' }}>
            Find Opponent
          </button>
        </div>

        <div className={styles.widget}>
          <h3 className={styles.widgetTitle}>Top Debaters</h3>
          <div className={styles.leaderboardList}>
            {leaderboardLoading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)', margin: '0 auto' }} />
              </div>
            ) : topDebaters.map((user: User) => (
              <div key={user.id} className={styles.leaderItem}>
                <div className={styles.leaderInfo}>
                  <div className={styles.leaderAvatar}>
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.username} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                    ) : (
                      user.username.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className={styles.leaderName}>{user.username}</div>
                    <div className={styles.leaderRank}>{user.globalElo} ELO</div>
                  </div>
                </div>
                <div className={styles.leaderScore}>#{user.totalWins} Wins</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
