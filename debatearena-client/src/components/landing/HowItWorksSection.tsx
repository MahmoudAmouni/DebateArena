import { motion } from 'framer-motion';
import { PlusCircle, Users, MessageSquare, Award } from 'lucide-react';
import styles from './HowItWorksSection.module.css';

const steps = [
  {
    icon: PlusCircle,
    title: 'Create Session',
    desc: 'Define your topic and 5 sub-questions. Choose your stance and invite an opponent.',
  },
  {
    icon: Users,
    title: 'Join & Lobby',
    desc: 'Enter the lobby once your opponent is ready. Lock in your positions and prepare for battle.',
  },
  {
    icon: MessageSquare,
    title: 'Live Debate',
    desc: 'Two intense phases: a live voice discussion followed by an AI-proctored writing round.',
  },
  {
    icon: Award,
    title: 'AI Verdict',
    desc: 'Receive a point-by-point breakdown and a final winner declared by the AI Judge.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how" className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.eyebrow}
          >
            THE PROCESS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={styles.title}
          >
            How It Works
          </motion.h2>
        </div>

        <div className={styles.timeline}>
          <div className={styles.line}>
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'var(--accent)',
                transformOrigin: 'top'
              }}
            />
          </div>

          <div className={styles.grid}>
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={styles.step}
              >
                {/* Number Badge */}
                <div className={styles.badge}>
                  {i + 1}
                </div>

                {/* Horizontal Content */}
                <div className={styles.contentWrapper}>
                  <div className={styles.iconContainer}>
                    <step.icon size={28} className={styles.icon} />
                  </div>
                  <div className={styles.textGroup}>
                    <h3 className={styles.stepTitle}>
                      {step.title}
                    </h3>
                    <p className={styles.stepDesc}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
