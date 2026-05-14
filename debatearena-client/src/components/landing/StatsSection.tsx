import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './StatsSection.module.css';

const AnimatedNumber: React.FC<{ endValue: number; suffix?: string }> = ({ endValue, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000; // 2s
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4); // Quartic ease out
      
      setCount(Math.floor(easeProgress * endValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, endValue]);

  return (
    <div ref={ref} className={styles.number}>
      {count.toLocaleString()}{suffix}
    </div>
  );
};

const StatsSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.statItem}>
          <AnimatedNumber endValue={24} suffix="M+" />
          <span className={styles.label}>Arguments Analyzed</span>
        </div>
        <div className={styles.statItem}>
          <AnimatedNumber endValue={99} suffix="%" />
          <span className={styles.label}>Verdict Accuracy</span>
        </div>
        <div className={styles.statItem}>
          <AnimatedNumber endValue={850} suffix="k" />
          <span className={styles.label}>Active Users</span>
        </div>
        <div className={styles.statItem}>
          <AnimatedNumber endValue={12} />
          <span className={styles.label}>Supported Languages</span>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
