import React from 'react';
import { Swords, History, Loader2 } from 'lucide-react';
import { useUserDebates } from '../../hooks/queries/useUserDebates';
import type { DebateHistoryItem } from '../../types';
import HistoryItem from '../../components/shared/HistoryItem';
import styles from './MyDebatesPage.module.css';

const MyDebatesPage: React.FC = () => {
  const { data, isLoading } = useUserDebates();

  const history = data || [];

  const getOutcome = (item: DebateHistoryItem) => {
    const verdict = item.session?.verdict;
    if (!verdict) return 'PENDING';
    if (!verdict.winnerId) return 'TIE';
    return verdict.winner?.userId === item.userId ? 'WIN' : 'LOSS';
  };

  const getOpponentName = (item: DebateHistoryItem) => {
    // This is a simplified logic, ideally the backend should return the opponent explicitly
    const participants = item.session?.participants || [];
    const opponent = participants.find((p) => p.userId !== item.userId);
    return opponent?.user?.username || 'Unknown Opponent';
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <History size={24} color="var(--accent)" />
          <h1 className={styles.title}>Debate History</h1>
        </div>
        <p className={styles.subtitle}>A chronological record of your intellectual battles and arena performance.</p>
      </header>

      <div className={styles.historyList}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent)' }} />
          </div>
        ) : history.length === 0 ? (
          <div className={styles.emptyState}>
            <Swords size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p>You haven't participated in any debates yet.</p>
          </div>
        ) : (
          history.map((item) => (
            <HistoryItem 
              key={item.id} 
              item={item} 
              outcome={getOutcome(item)} 
              opponentName={getOpponentName(item)} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyDebatesPage;
