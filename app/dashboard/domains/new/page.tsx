'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Code, GraduationCap, Loader2 } from 'lucide-react';
import styles from './page.module.css';

const TEMPLATES = [
  {
    id: 'roomcore',
    name: 'Room Core',
    description: 'Manage chores, groceries, and shared responsibilities with your roommates.',
    icon: Home,
  },
  {
    id: 'software',
    name: 'Software Team',
    description: 'Track bugs, feature requests, and agile sprint tasks for your development team.',
    icon: Code,
  },
  {
    id: 'college',
    name: 'College Project',
    description: 'Organize research, presentations, and assignments for your group project.',
    icon: GraduationCap,
  }
];

export default function NewDomain() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const router = useRouter();

  const [selectedTemplate, setSelectedTemplate] = useState<typeof TEMPLATES[0] | null>(null);

  const handleSelectTemplate = (template: typeof TEMPLATES[0]) => {
    setSelectedTemplate(template);
    setProjectDesc(template.description);
    setError('');
  };

  const handleCreateTemplate = async () => {
    if (!selectedTemplate) return;
    if (!projectName.trim()) {
      setError('Please enter a custom name for your workspace first.');
      return;
    }
    setLoadingId(selectedTemplate.id);
    setError('');

    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName, description: projectDesc, template: selectedTemplate.name }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/domains/${data.domain.id}`);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create domain');
        setLoadingId(null);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoadingId(null);
    }
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      {error && <div style={{ color: 'var(--danger)', marginBottom: '2rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>{error}</div>}

      {!selectedTemplate ? (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>Choose a Workspace Template</h2>
            <p className={styles.subtitle}>Select a template format to get started.</p>
          </div>
          <div className={styles.grid}>
            {TEMPLATES.map((template) => {
              const Icon = template.icon;
              return (
                <div 
                  key={template.id} 
                  className={styles.templateCard}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className={styles.iconWrapper}>
                    <Icon size={32} />
                  </div>
                  <h3 className={styles.cardTitle}>{template.name}</h3>
                  <p className={styles.cardDesc}>{template.description}</p>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className={styles.stepTwoContainer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <div className={styles.iconWrapper} style={{ marginBottom: 0 }}>
              {(() => {
                const Icon = selectedTemplate.icon;
                return <Icon size={24} />;
              })()}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{selectedTemplate.name}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Template Selected</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              What do you want to name this project?
            </label>
            <input 
              type="text"
              className="input-field" 
              placeholder="e.g., Biology 101, Alpha Squad..." 
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
              placeholder="What is this workspace for?" 
              value={projectDesc}
              onChange={e => setProjectDesc(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className={styles.stepTwoButtons}>
            <button 
              className="btn-secondary" 
              style={{ flex: 1 }} 
              onClick={() => setSelectedTemplate(null)}
              disabled={loadingId !== null}
            >
              Back
            </button>
            <button 
              className="btn-primary" 
              style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} 
              onClick={handleCreateTemplate}
              disabled={loadingId !== null}
            >
              {loadingId ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Creating...
                </>
              ) : 'Create Workspace'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
