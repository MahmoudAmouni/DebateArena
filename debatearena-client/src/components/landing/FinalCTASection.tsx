import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './FinalCTASection.module.css';

const FinalCTASection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.glow} />
      
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h2 className={styles.heading}>The arena is waiting.</h2>
        <p className={styles.subtext}>
          Stop yelling into the void. Bring your best arguments, face worthy opponents, and let the impartial AI judge decide who truly won.
        </p>
        <Link to="/register" className="btn-primary" style={{ padding: '0 32px', height: '48px', fontSize: '16px' }}>
          Enter the Arena
        </Link>
      </motion.div>
    </section>
  );
};

export default FinalCTASection;
