import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Scale, Trophy, Users } from 'lucide-react';
import styles from './HowItWorksSection.module.css';

const steps = [
  {
    number: '1',
    icon: <Users size={24} />,
    title: 'Challenge an Opponent',
    description: 'Create a public session or invite someone directly. Choose the debate format and topic.',
  },
  {
    number: '2',
    icon: <MessageSquare size={24} />,
    title: 'Debate Live',
    description: 'Enter the arena. Argue your points across 5 sub-questions in a structured, timed format.',
  },
  {
    number: '3',
    icon: <Scale size={24} />,
    title: 'AI Judgment',
    description: 'The impartial AI judge analyzes both sides for logic, evidence, and rhetoric to determine a winner.',
  },
  {
    number: '4',
    icon: <Trophy size={24} />,
    title: 'Climb the Ranks',
    description: 'Earn ELO points for your victories and climb the global leaderboard to Diamond tier.',
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <motion.div
        className={styles.eyebrow}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        HOW IT WORKS
      </motion.div>
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        The Path to Victory
      </motion.h2>

      <div className={styles.timeline}>
        {/* Animated Connecting Line */}
        <div className={styles.lineContainer}>
          <svg width="100%" height="0" preserveAspectRatio="none">
            <motion.line
              x1="0"
              y1="1"
              x2="100%"
              y2="1"
              className={styles.animatedLine}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
        </div>

        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            className={styles.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 + 0.3 }}
          >
            <div className={styles.numberBadge}>{step.number}</div>
            <div className={styles.icon}>{step.icon}</div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDesc}>{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
