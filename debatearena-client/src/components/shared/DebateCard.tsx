import React from 'react';
import { Eye } from 'lucide-react';
import type { Session, Participant, User } from '../../types';
import styles from './DebateCard.module.css';

interface DebateCardProps {
  debate: Session & { 
    _count?: { observers: number },
    participants?: (Participant & { user?: User })[]
  };
}

const DebateCard: React.FC<DebateCardProps> = ({ debate }) => {
  const isLive = debate.status !== 'WAITING' && debate.status !== 'COMPLETED';
  const participants = debate.participants?.map((p) => p.user).filter(Boolean) as User[] || [];
  
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.badges}>
          <span className={styles.formatBadge}>{debate.status === 'open' ? '1v1' : 'Panel'}</span>
          {isLive && (
            <div className={styles.liveIndicator}>
              <div className={styles.liveDot} /> LIVE
            </div>
          )}
        </div>
      </div>
      
      <h3 className={styles.cardTitle}>{debate.topic}</h3>
      <p className={styles.cardDesc}>{debate.initialQuestion}</p>
      
      <div className={styles.cardFooter}>
        <div className={styles.participants}>
          <div className={styles.avatarGroup}>
            {participants.slice(0, 2).map((user, i) => (
              <div key={i} className={styles.avatar}>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                ) : (
                  user.username.substring(0, 2).toUpperCase()
                )}
              </div>
            ))}
            {participants.length > 2 && (
              <div className={styles.avatar}>+{participants.length - 2}</div>
            )}
          </div>
          <span className={styles.vsText}>
            {debate.status === 'open' ? 'Head to Head' : 'Panel'}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isLive && (
            <div className={styles.spectators}>
              <Eye size={14} />
              {debate._count?.observers || 0}
            </div>
          )}
          <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: '13px' }}>
            {isLive ? 'Join as Observer' : 'View Details'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebateCard;
