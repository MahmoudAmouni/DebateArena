import { useEffect, useState, useRef } from 'react';
import styles from './StatsSection.module.css';

const stats = [
  { value: 48200, label: 'TOTAL ARGUMENTS ANALYZED' },
  { value: 12400, label: 'COMPLETED DEBATES' },
  { value: 4100, label: 'ACTIVE DEBATERS' },
  { value: 7, label: 'ELO TIERS' },
];

function StatItem({ value, label }: { value: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const end = value;
          const duration = 2000;
          const increment = end / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className={styles.item}>
      <span className={styles.value}>
        {count.toLocaleString()}
      </span>
      <span className={styles.label}>
        {label}
      </span>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {stats.map((stat, i) => (
            <StatItem key={i} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
