import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { DebateHistoryItem } from '../../types';
import styles from './HistoryItem.module.css';

interface HistoryItemProps {
  item: DebateHistoryItem;
  outcome: 'WIN' | 'LOSS' | 'TIE' | 'PENDING';
  opponentName: string;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, outcome, opponentName }) => {
  const date = new Date(item.joinedAt).toLocaleDateString();
  const change = item.eloChange || 0;
  const eloLabel = change >= 0 ? `+${change}` : `${change}`;

  return (
    <div className={styles.historyItem}>
      <div className={styles.mainInfo}>
        <h3 className={styles.topic}>{item.session.topic}</h3>
        <div className={styles.meta}>
          <div className={styles.opponent}>
            <span>vs</span>
            <strong>{opponentName}</strong>
          </div>
          <span>•</span>
          <span>{date}</span>
        </div>
      </div>

      <div className={styles.outcomeSection}>
        <div className={styles.eloSection}>
          <span className={`${styles.eloChange} ${
            outcome === 'WIN' ? styles.eloGain : 
            outcome === 'LOSS' ? styles.eloLoss : 
            styles.eloNeutral
          }`}>
            {eloLabel}
          </span>
          {outcome === 'WIN' ? <TrendingUp size={14} className={styles.eloGain} /> : 
           outcome === 'LOSS' ? <TrendingDown size={14} className={styles.eloLoss} /> : 
           <Minus size={14} className={styles.eloNeutral} />}
        </div>
        
        <div className={`${styles.outcomeBadge} ${
          outcome === 'WIN' ? styles.outcomeWin : 
          outcome === 'LOSS' ? styles.outcomeLoss : 
          styles.outcomeNeutral
        }`}>
          {outcome}
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;
