'use client';

import { useFontSize } from '@/lib/FontSizeContext';
import styles from './FontSizeSwitcher.module.css';

export default function FontSizeSwitcher() {
  const { fontSize, setFontSize } = useFontSize();

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={`${styles.button} ${fontSize === 'small' ? styles.active : ''}`}
        onClick={() => setFontSize('small')}
        title="Small Text"
        style={{ fontSize: '0.8rem' }}
      >
        A-
      </button>
      <button
        type="button"
        className={`${styles.button} ${fontSize === 'medium' ? styles.active : ''}`}
        onClick={() => setFontSize('medium')}
        title="Medium Text"
        style={{ fontSize: '1rem' }}
      >
        A
      </button>
      <button
        type="button"
        className={`${styles.button} ${fontSize === 'large' ? styles.active : ''}`}
        onClick={() => setFontSize('large')}
        title="Large Text"
        style={{ fontSize: '1.2rem' }}
      >
        A+
      </button>
    </div>
  );
}
