import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, ShieldAlert, TimerReset, LineChart, Globe, Zap } from 'lucide-react';
import styles from './FeaturesSection.module.css';

const features = [
  {
    icon: <BrainCircuit size={22} color="#C9A84C" />,
    color: 'rgba(201, 168, 76, 0.1)',
    title: 'Impartial AI Judgments',
    description: 'No bias, no favoritism. Our AI models analyze arguments purely on logical consistency, evidence quality, and rhetorical strength.',
  },
  {
    icon: <TimerReset size={22} color="#4CAF82" />,
    color: 'rgba(76, 175, 130, 0.1)',
    title: 'Structured Formats',
    description: 'Strict turn-based formats with enforced time limits ensure both parties get equal opportunity to present their case.',
  },
  {
    icon: <ShieldAlert size={22} color="#E05C5C" />,
    color: 'rgba(224, 92, 92, 0.1)',
    title: 'Fallacy Detection',
    description: 'The AI actively flags logical fallacies in real-time, penalizing ad hominem attacks and straw man arguments.',
  },
  {
    icon: <LineChart size={22} color="#6A8EF0" />,
    color: 'rgba(106, 142, 240, 0.1)',
    title: 'ELO Rating System',
    description: 'A competitive ranking system that matches you with opponents of similar skill, from Bronze up to Diamond tier.',
  },
  {
    icon: <Globe size={22} color="#E8A44C" />,
    color: 'rgba(232, 164, 76, 0.1)',
    title: 'Public & Private Arenas',
    description: 'Host private debates with friends to settle disputes, or open the floor to public observers who can vote on the outcome.',
  },
  {
    icon: <Zap size={22} color="#C084F5" />,
    color: 'rgba(192, 132, 245, 0.1)',
    title: 'Real-time Rebuttals',
    description: 'Experience the pressure of live intellectual combat. Respond to opponent points as they happen with built-in voice or text.',
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const FeaturesSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Everything you need to prove them wrong.
      </motion.h2>

      <motion.div
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={styles.card}
            variants={cardVariants}
            whileHover={{ 
              y: -4, 
              borderColor: 'var(--border-strong)',
              boxShadow: 'var(--shadow-md)',
              transition: { duration: 0.15 }
            }}
          >
            <div className={styles.iconContainer} style={{ background: feature.color }}>
              {feature.icon}
            </div>
            <h3 className={styles.cardTitle}>{feature.title}</h3>
            <p className={styles.cardDesc}>{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
