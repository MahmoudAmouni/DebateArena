import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import styles from './AIJudgeSection.module.css';

const criteria = [
  { label: 'Clarity & Structure', score: 8.5 },
  { label: 'Logical Consistency', score: 9.2 },
  { label: 'Evidence Quality', score: 7.8 },
  { label: 'Rebuttal Strength', score: 8.9 },
  { label: 'Tone & Conduct', score: 9.5 },
];

function MockScoreBar({ label, score, delay }: { label: string; score: number; delay: number }) {
  return (
    <div className={styles.scoreItem}>
      <div className={styles.scoreHeader}>
        <span className={styles.scoreLabel}>{label}</span>
        <span className={styles.scoreValue}>{score}/10</span>
      </div>
      <div className={styles.scoreTrack}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${score * 10}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className={styles.scoreBar}
        />
      </div>
    </div>
  );
}

export default function AIJudgeSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Content */}
          <div className={styles.left}>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={styles.eyebrow}
            >
              THE AI JUDGE
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={styles.title}
            >
              An impartial verdict.<br />Every time.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={styles.desc}
            >
              DebateArena uses Gemini 1.5 Pro to evaluate every argument. 
              No personal bias, no emotional interference—just pure analysis of logic and evidence.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className={styles.list}
            >
              {[
                'Evaluates clarity and structural integrity',
                'Detects logical fallacies in real-time',
                'Weights the quality of cited evidence',
                'Analyzes rebuttal relevance and strength',
                'Considers conduct and adherence to rules',
              ].map((item, i) => (
                <li key={i} className={styles.listItem}>
                  <div className={styles.checkContainer}>
                    <Check size={12} className={styles.checkIcon} />
                  </div>
                  <span className={styles.listItemText}>{item}</span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right Mock Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={styles.right}
          >
            {/* Glow effect */}
            <div className={styles.glow} />
            
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>Final Verdict</h3>
                  <p className={styles.cardId}>Session #8291</p>
                </div>
                <div className={styles.cardScoreContainer}>
                  <div className={styles.cardScore}>88.4</div>
                  <div className={styles.cardScoreLabel}>AI AGGREGATE SCORE</div>
                </div>
              </div>

              <div className={styles.scoreList}>
                {criteria.map((item, i) => (
                  <MockScoreBar
                    key={i}
                    label={item.label}
                    score={item.score}
                    delay={0.5 + i * 0.1}
                  />
                ))}
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.footerContent}>
                  <div className={styles.aiAvatar}>AI</div>
                  <div>
                    <p className={styles.footerText}>"The winner demonstrated superior evidence quality and rebutted all sub-questions with logical consistency."</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
