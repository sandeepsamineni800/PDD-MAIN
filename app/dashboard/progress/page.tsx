'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18nContext';
import { Loader2, BarChart } from 'lucide-react';
import styles from './page.module.css';

interface DomainProgress {
  id: string;
  name: string;
  role: string;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

export default function ProgressPage() {
  const [domains, setDomains] = useState<DomainProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetch('/api/progress', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.domains) {
          setDomains(data.domains);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Loader2 className={styles.spinner} style={{ animation: 'spin 1s linear infinite' }} size={32} />
      </div>
    );
  }

  const adminDomains = domains.filter(d => d.role === 'ADMIN');
  const memberDomains = domains.filter(d => d.role !== 'ADMIN');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('sidebar.progress')}</h1>
        <p className={styles.subtitle}>
          Track task completion and overall progress across all domains where you are an active member.
        </p>
      </div>

      {domains.length === 0 ? (
        <div className={styles.emptyState}>
          <BarChart size={48} style={{ opacity: 0.5, margin: '0 auto 1rem auto' }} />
          <h3>No Active Domains Found</h3>
          <p>You are not currently active in any domains. Create or join a domain to track its progress.</p>
        </div>
      ) : (
        <>
          {adminDomains.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Domains I Manage (Admin)</h2>
              <div className={styles.grid}>
                {adminDomains.map(domain => (
                  <Link href={`/dashboard/domains/${domain.id}`} key={domain.id} style={{ textDecoration: 'none' }}>
                    <div className={styles.card}>
                      <div className={styles.cardHeader}>
                        <div className={styles.domainName}>{domain.name}</div>
                        <div className={`${styles.roleBadge} ${styles['role_' + domain.role]}`}>
                          {domain.role}
                        </div>
                      </div>

                      <div className={styles.statsRow}>
                        <span>Completed: {domain.completedTasks}</span>
                        <span>Total Tasks: {domain.totalTasks}</span>
                      </div>

                      <div className={styles.progressContainer}>
                        <div 
                          className={styles.progressBar} 
                          style={{ width: `${domain.progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className={styles.progressText}>
                        {domain.progressPercentage}% Done
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {memberDomains.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Domains I Contribute To (Member)</h2>
              <div className={styles.grid}>
                {memberDomains.map(domain => (
                  <Link href={`/dashboard/domains/${domain.id}`} key={domain.id} style={{ textDecoration: 'none' }}>
                    <div className={styles.card}>
                      <div className={styles.cardHeader}>
                        <div className={styles.domainName}>{domain.name}</div>
                        <div className={`${styles.roleBadge} ${styles['role_' + domain.role]}`}>
                          {domain.role}
                        </div>
                      </div>

                      <div className={styles.statsRow}>
                        <span>Completed: {domain.completedTasks}</span>
                        <span>Total Tasks: {domain.totalTasks}</span>
                      </div>

                      <div className={styles.progressContainer}>
                        <div 
                          className={styles.progressBar} 
                          style={{ width: `${domain.progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className={styles.progressText}>
                        {domain.progressPercentage}% Done
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
