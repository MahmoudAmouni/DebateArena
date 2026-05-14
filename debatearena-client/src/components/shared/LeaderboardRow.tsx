import React from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import type { User } from '../../types';
import styles from './LeaderboardRow.module.css';

interface LeaderboardRowProps {
  user: User;
  rank: number;
  isCurrentUser: boolean;
}

const getTier = (elo: number) => {
  if (elo < 1200) return 'Bronze';
  if (elo < 1500) return 'Silver';
  if (elo < 1900) return 'Gold';
  if (elo < 2300) return 'Platinum';
  return 'Diamond';
};

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ user, rank, isCurrentUser }) => {
  const isTop3 = rank <= 3;
  const winRate = user.totalWins + user.totalLosses > 0 
    ? Math.round((user.totalWins / (user.totalWins + user.totalLosses)) * 100) 
    : 0;

  return (
    <tr className={`${styles.tr} ${isCurrentUser ? styles.currentUser : ''}`}>
      <td className={styles.td}>
        <div className={styles.rankCell}>
          {rank === 1 && <Crown size={18} color="var(--accent)" />}
          {rank === 2 && <Medal size={18} color="#C0C0C0" />}
          {rank === 3 && <Medal size={18} color="#CD7F32" />}
          {rank > 3 && <span className={styles.rankNumber}>{rank}</span>}
        </div>
      </td>
      <td className={styles.td}>
        <div className={styles.debaterCell}>
          <div className={styles.avatar}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} />
            ) : (
              user.username.substring(0, 2).toUpperCase()
            )}
          </div>
          <div className={styles.debaterInfo}>
            <span className={styles.username}>{user.username} {isCurrentUser && '(You)'}</span>
            <span className={styles.tier}>{getTier(user.globalElo)}</span>
          </div>
        </div>
      </td>
      <td className={styles.td}>
        <div className={styles.eloCell}>
          <Trophy size={14} color="var(--accent)" />
          <span className={styles.eloValue}>{user.globalElo}</span>
        </div>
      </td>
      <td className={styles.td}>
        <div className={styles.winRateCell}>
          <div className={styles.winRateBar}>
            <div className={styles.winRateFill} style={{ width: `${winRate}%` }} />
          </div>
          <span className={styles.winRateValue}>{winRate}%</span>
        </div>
      </td>
    </tr>
  );
};

export default LeaderboardRow;
