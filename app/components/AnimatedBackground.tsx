import React from 'react';
import { Terminal, BookOpen, Home } from 'lucide-react';
import styles from './AnimatedBackground.module.css';

export default function AnimatedBackground() {
  return (
    <div className={styles.bgContainer}>
      {/* Blurred background orbs */}
      <div className={styles.orbOne}></div>
      <div className={styles.orbTwo}></div>
      
      {/* Floating Domain Cards */}
      <div className={`${styles.floatingCard} ${styles.cardSoftware}`}>
        <div className={styles.cardIcon}><Terminal size={24} /></div>
        <div className={styles.cardContent}>
          <div className={styles.cardTitle}>Software Team</div>
          <div className={styles.cardSubtitle}>Sprint Planning</div>
        </div>
      </div>

      <div className={`${styles.floatingCard} ${styles.cardCollege}`}>
        <div className={styles.cardIcon}><BookOpen size={24} /></div>
        <div className={styles.cardContent}>
          <div className={styles.cardTitle}>College Project</div>
          <div className={styles.cardSubtitle}>Assignments & Research</div>
        </div>
      </div>

      <div className={`${styles.floatingCard} ${styles.cardRoom}`}>
        <div className={styles.cardIcon}><Home size={24} /></div>
        <div className={styles.cardContent}>
          <div className={styles.cardTitle}>Room Core</div>
          <div className={styles.cardSubtitle}>Daily Chores</div>
        </div>
      </div>
    </div>
  );
}
