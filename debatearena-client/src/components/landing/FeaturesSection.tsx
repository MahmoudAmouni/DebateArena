import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Trophy, Eye, Search } from 'lucide-react';
import styles from './FeaturesSection.module.css';

const features = [
  {
    icon: Brain,
    title: 'AI Judgment',
    desc: 'Our Gemini-powered judge evaluates clarity, logic, evidence, and consistency. Zero bias. Pure merit.',
    color: '#8B5CF6',
  },
  {
    icon: Search,
    title: 'Real-Time Fact Check',
    desc: 'Every claim you make is verified instantly against live data. You can\'t bluff your way to victory.',
    color: '#F59E0B',
  },
  {
    icon: Shield,
    title: 'ELO Ranking',
    desc: 'A global leaderboard tracks your skill across 7 categories. Climb from Bronze all the way to Diamond.',
    color: '#10B981',
  },
  {
    icon: Trophy,
    title: 'Structured Formats',
    desc: 'Choose Quick, Standard, or Extended debate formats with automated timed phases.',
    color: '#EF4444',
  },
  {
    icon: Eye,
    title: 'Spectator Mode',
    desc: 'Watch live debates, vote for your favorite debater, and see the audience verdict alongside the AI.',
    color: '#3B82F6',
  },
  {
    icon: Zap,
    title: 'AI Fact Screening',
    desc: 'AI screens all arguments for misinformation before they even reach the judge\'s desk.',
    color: '#EC4899',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.title}
          >
            Built Different
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={styles.subtitle}
          >
            Every system is engineered to reward the best arguments, 
            not the loudest voice.
          </motion.p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={styles.card}
            >
              <div 
                className={styles.iconContainer}
                style={{ backgroundColor: `${feature.color}1a` }}
              >
                <feature.icon size={22} style={{ color: feature.color }} />
              </div>

              <div className={styles.textGroup}>
                <h3 className={styles.featureTitle}>
                  {feature.title}
                </h3>
                <p className={styles.featureDesc}>
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
