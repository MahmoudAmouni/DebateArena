import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';

const StatCounter: React.FC<{ endValue: number; label: string }> = ({ endValue, label }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500; // 1.5s
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOut cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easeProgress * endValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [endValue]);

  return (
    <div className={styles.statItem}>
      <span className={styles.statNumber}>
        {count.toLocaleString()}
        {endValue > 1000 ? '+' : ''}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
};

const HeroSection: React.FC = () => {
  return (
    <section className={styles.hero}>
      {/* Animated Orbs */}
      <motion.div
        className={styles.orb1}
        animate={{ x: [-100, -80, -100], y: [100, 130, 100] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={styles.orb2}
        animate={{ x: [80, 60, 80], y: [-50, -80, -50] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className={styles.content}>
        <motion.div
          className={styles.eyebrow}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          AI-POWERED DEBATE PLATFORM
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          Debate Anyone.<br />
          Win on <span className={styles.titleAccent}>Merit.</span>
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          The ultimate AI-powered arena for intellectual combat. Submit your arguments, let the impartial judge decide the victor, and climb the global rankings.
        </motion.p>

        <motion.div
          className={styles.ctaRow}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.45 }}
        >
          <Link to="/register" className="btn-primary">Start Debating &rarr;</Link>
          <Link to="/observe" className="btn-ghost">Watch a Live Debate</Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className={styles.scrollIndicator}
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={24} />
      </motion.div>

      {/* Stat Strip */}
      <motion.div 
        className={styles.statStrip}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <StatCounter endValue={12500} label="DEBATES HOSTED" />
        <StatCounter endValue={42000} label="ACTIVE DEBATERS" />
        <StatCounter endValue={100} label="UPTIME %" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
