import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import styles from './AIJudgeSection.module.css';

const criteria = [
  { label: 'LOGIC', score: 92 },
  { label: 'EVIDENCE', score: 88 },
  { label: 'RHETORIC', score: 75 },
  { label: 'REBUTTAL', score: 95 },
  { label: 'CLARITY', score: 82 },
];

const bulletPoints = [
  'Logical consistency and soundness',
  'Factual accuracy and source quality',
  'Directness of rebuttals',
  'Absence of logical fallacies',
  'Persuasive rhetoric'
];

const AIJudgeSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Left Side: Copy */}
        <motion.div 
          className={styles.leftContent}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className={styles.eyebrow}>THE AI JUDGE</div>
          <h2 className={styles.heading}>An impartial verdict.<br/>Every time.</h2>
          <p className={styles.bodyCopy}>
            No more endless arguments that go nowhere. Our specialized AI models act as the ultimate arbiter, evaluating both sides on a strict rubric to declare a definitive winner.
          </p>
          <div className={styles.bulletList}>
            {bulletPoints.map((point, i) => (
              <div key={i} className={styles.bulletItem}>
                <CheckCircle2 size={18} color="var(--accent)" />
                {point}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Mock ScoreCard */}
        <motion.div 
          className={styles.scoreCard}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>FINAL SCORE</span>
            <span className={styles.cardScore}>86.4</span>
          </div>
          
          <div className={styles.criteriaList}>
            {criteria.map((item, index) => (
              <div key={item.label} className={styles.criterionRow}>
                <span className={styles.criterionLabel}>{item.label}</span>
                <div className={styles.barTrack}>
                  <motion.div 
                    className={styles.barFill}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.0, delay: 0.4 + (index * 0.15), ease: 'easeOut' }}
                  />
                </div>
                <span className={styles.criterionScore}>{item.score}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIJudgeSection;
