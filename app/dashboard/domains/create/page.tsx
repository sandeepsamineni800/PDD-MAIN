'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layers, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from '../new/page.module.css';

export default function CreateDomainPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const router = useRouter();

  const handleCreate = async () => {
    if (!projectName.trim()) {
      setError('Please enter a name for your domain.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName, description: projectDesc, template: 'Custom' }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/domains/${data.domain.id}`);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create domain');
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <div className={styles.header} style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.5rem 1rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1>Create New Domain</h1>
        <p>Set up a new workspace to start organizing your team and tasks.</p>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          {error}
        </div>
      )}

      <div className={styles.stepTwoContainer} style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div className={styles.iconWrapper} style={{ marginBottom: 0, background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', padding: '0.75rem', borderRadius: '12px' }}>
            <Layers size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Custom Domain</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Blank Canvas</p>
          </div>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            Domain Name
          </label>
          <input 
            type="text"
            className="input-field" 
            placeholder="e.g., Development Team, Client Project..." 
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}
            autoFocus
          />

          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            Description (Optional)
          </label>
          <textarea 
            className="input-field" 
            placeholder="What is this domain for?" 
            value={projectDesc}
            onChange={e => setProjectDesc(e.target.value)}
            rows={3}
          />
        </div>
        
        <button 
          className="btn-primary" 
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem' }} 
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="spin" /> Creating Domain...
            </>
          ) : 'Create Domain'}
        </button>
      </div>
    </div>
  );
}
