import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLeaderboard } from '../../hooks/queries/useLeaderboard';
import type { User } from '../../types';
import LeaderboardRow from '../../components/shared/LeaderboardRow';
import styles from './LeaderboardPage.module.css';

const LeaderboardPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { data, isLoading, error } = useLeaderboard();

  const leaders = data?.data || [];

  if (isLoading) {
    return (
      <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Failed to load leaderboard. Please try again later.
        </div>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Global Leaderboard</h1>
        <p className={styles.subtitle}>The world's most authoritative debaters, ranked by AI-judged merit.</p>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Rank</th>
              <th className={styles.th}>Debater</th>
              <th className={styles.th}>Rating</th>
              <th className={styles.th}>Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((user: User, index: number) => (
              <LeaderboardRow 
                key={user.id} 
                user={user} 
                rank={index + 1} 
                isCurrentUser={currentUser?.id === user.id} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
