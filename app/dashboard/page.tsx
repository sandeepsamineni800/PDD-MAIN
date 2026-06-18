'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layers, Users, CheckSquare, PlusCircle, Trash2, Edit2, Save, X, LogOut } from 'lucide-react';
import { useLanguage } from '@/lib/i18nContext';
import styles from './page.module.css';

interface Domain {
  id: string;
  name: string;
  description: string;
  template?: string;
  createdAt: string | Date;
  _count: { tasks: number };
  members: any[];
}

export default function Dashboard() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();
  const { t } = useLanguage();

  const [editingDomainId, setEditingDomainId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Domain Delete Modal State
  const [deleteDomainId, setDeleteDomainId] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteReason, setDeleteReason] = useState('');

  // Leave Workspace Modal State
  const [leaveDomain, setLeaveDomain] = useState<Domain | null>(null);
  const [leavePassword, setLeavePassword] = useState('');
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveError, setLeaveError] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  const fetchDomains = async () => {
    try {
      const [res, meRes] = await Promise.all([
        fetch('/api/domains', { cache: 'no-store' }),
        fetch('/api/auth/me', { cache: 'no-store' })
      ]);
      
      if (meRes.ok) {
        const data = await meRes.json();
        setCurrentUser(data.user);
      }

      if (res.ok) {
        const data = await res.json();
        setDomains(data.domains);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  // Refresh domains list when a membership is accepted (e.g., user accepted an invitation)
  useEffect(() => {
    const handleMembershipUpdate = () => fetchDomains();
    window.addEventListener('domain-membership-updated', handleMembershipUpdate);
    return () => window.removeEventListener('domain-membership-updated', handleMembershipUpdate);
  }, []);

  const handleDeleteDomainClick = (e: React.MouseEvent, domainId: string) => {
    e.stopPropagation();
    setDeleteDomainId(domainId);
    setConfirmPassword('');
    setDeleteError('');
    setDeleteReason('');
  };

  const handleConfirmDelete = async () => {
    if (!deleteDomainId || !confirmPassword) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const res = await fetch(`/api/domains/${deleteDomainId}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: confirmPassword, reason: deleteReason })
      });
      if (res.ok) {
        setDeleteDomainId(null);
        fetchDomains(); // Refresh the list
        router.refresh(); // Refresh client router cache
      } else {
        const data = await res.json();
        setDeleteError(data.error || 'Failed to delete domain');
      }
    } catch (err: any) {
      console.error(err);
      setDeleteError(err.message || 'An unexpected error occurred.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleLeaveClick = (e: React.MouseEvent, domain: Domain) => {
    e.stopPropagation();
    setLeaveDomain(domain);
    setLeavePassword('');
    setLeaveError('');
    setLeaveReason('');
  };

  const handleConfirmLeave = async () => {
    if (!leaveDomain || !leavePassword) return;
    const myMembership = leaveDomain.members.find(m => m.user?.id === currentUser?.id || m.userId === currentUser?.id);
    if (!myMembership) return;
    setLeaveLoading(true);
    setLeaveError('');
    try {
      const res = await fetch(`/api/domains/${leaveDomain.id}/members/${myMembership.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: leavePassword, reason: leaveReason })
      });
      if (res.ok) {
        setLeaveDomain(null);
        fetchDomains();
        router.refresh();
      } else {
        const data = await res.json();
        setLeaveError(data.error || 'Failed to leave workspace');
      }
    } catch (err: any) {
      console.error(err);
      setLeaveError(err.message || 'An unexpected error occurred.');
    } finally {
      setLeaveLoading(false);
    }
  };

  const startEditing = (e: React.MouseEvent, domain: Domain) => {
    e.stopPropagation();
    setEditingDomainId(domain.id);
    setEditName(domain.name);
    setEditDesc(domain.description || '');
  };

  const handleUpdateDomain = async (e: React.MouseEvent, domainId: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/domains/${domainId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, description: editDesc }),
      });
      if (res.ok) {
        setEditingDomainId(null);
        fetchDomains();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="animate-fade-in">{t('dashboard.loading')}</div>;
  }

  return (
    <div className={`${styles.dashboard} animate-fade-in`}>
      <div className={styles.header}>
        <h2>{t('dashboard.yourWorkspaces')}</h2>
        <Link href="/dashboard/domains/new" className="btn-primary">
          <PlusCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          {t('dashboard.createWorkspace')}
        </Link>
      </div>

      {domains.length === 0 ? (
        <div className={styles.emptyState}>
          <Layers size={48} className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>{t('dashboard.noWorkspaces')}</h3>
          <p className={styles.emptyDesc}>
            {t('dashboard.noWorkspacesDesc')}
          </p>
          <Link href="/dashboard/domains/new" className="btn-primary">
            {t('dashboard.createWorkspace')}
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* Admin Workspaces */}
          {domains.filter(d => d.members.find(m => m.user?.id === currentUser?.id || m.userId === currentUser?.id)?.role === 'ADMIN').length > 0 && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                {t('dashboard.myWorkspaces')}
              </h3>
              <div className={styles.domainsGrid}>
                {domains.filter(d => d.members.find(m => m.user?.id === currentUser?.id || m.userId === currentUser?.id)?.role === 'ADMIN').map((domain) => (
                  <div 
                    key={domain.id} 
                    className={`${styles.domainCard} glass-panel`}
                    onClick={() => { if (editingDomainId !== domain.id) router.push(`/dashboard/domains/${domain.id}`) }}
                  >
                    {editingDomainId === domain.id ? (
                      <div className={styles.editForm} onClick={(e) => e.stopPropagation()}>
                        <input 
                          className="input-field" 
                          value={editName} 
                          onChange={e => setEditName(e.target.value)} 
                          placeholder="Workspace Name"
                          autoFocus
                        />
                        <textarea 
                          className="input-field" 
                          value={editDesc} 
                          onChange={e => setEditDesc(e.target.value)} 
                          placeholder="Description"
                          rows={2}
                          style={{ marginTop: '0.5rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <button className="btn-primary" onClick={(e) => handleUpdateDomain(e, domain.id)}><Save size={16} /> {t('domain.saveChanges')}</button>
                          <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); setEditingDomainId(null); }}><X size={16} /> {t('newDomain.cancel')}</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <div>
                            <h3 className={styles.domainName}>
                              <Layers size={20} className="text-accent-primary" />
                              {domain.name}
                            </h3>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                              {domain.template || 'Custom'} {t('dashboard.template')}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '0.5rem' }}>
                              {t('dashboard.created')} {new Date(domain.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className={styles.cardActions}>
                            <button className="btn-icon" onClick={(e) => startEditing(e, domain)} title="Edit Workspace Details">
                              <Edit2 size={16} />
                            </button>
                            <button className="btn-icon text-danger" onClick={(e) => handleDeleteDomainClick(e, domain.id)} title="Delete Workspace">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <p className={styles.domainDesc}>
                          {domain.description || t('dashboard.noDesc')}
                        </p>
                        
                        <div className={styles.domainStats}>
                          <div className={styles.statItem}>
                            <Users size={16} />
                            <span>{domain.members.length} {t('dashboard.members')}</span>
                          </div>
                          <div className={styles.statItem}>
                            <CheckSquare size={16} />
                            <span>{domain._count.tasks} {t('domain.tasks')}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                
                {/* End of Quick Create Card removal */}
              </div>
            </div>
          )}

          {/* Member Workspaces */}
          {domains.filter(d => d.members.find(m => m.user?.id === currentUser?.id || m.userId === currentUser?.id)?.role !== 'ADMIN').length > 0 && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                {t('dashboard.sharedWithMe')}
              </h3>
              <div className={styles.domainsGrid}>
                {domains.filter(d => d.members.find(m => m.user?.id === currentUser?.id || m.userId === currentUser?.id)?.role !== 'ADMIN').map((domain) => (
                  <div 
                    key={domain.id} 
                    className={`${styles.domainCard} glass-panel`}
                    onClick={() => router.push(`/dashboard/domains/${domain.id}`)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <h3 className={styles.domainName}>
                          <Layers size={20} className="text-accent-primary" />
                          {domain.name}
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                          {domain.template || 'Custom'} {t('dashboard.template')}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '0.5rem' }}>
                          {t('dashboard.created')} {new Date(domain.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={styles.cardActions}>
                        <button className="btn-icon text-danger" onClick={(e) => handleLeaveClick(e, domain)} title="Leave Workspace">
                          <LogOut size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <p className={styles.domainDesc}>
                      {domain.description || t('dashboard.noDesc')}
                    </p>
                    
                    <div className={styles.domainStats}>
                      <div className={styles.statItem}>
                        <Users size={16} />
                        <span>{domain.members.length} {t('dashboard.members')}</span>
                      </div>
                      <div className={styles.statItem}>
                        <CheckSquare size={16} />
                        <span>{domain._count.tasks} {t('domain.tasks')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteDomainId && (
        <div className={styles.modalOverlay} onClick={() => { setDeleteDomainId(null); setConfirmPassword(''); setDeleteError(''); setDeleteReason(''); }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>
              <Trash2 size={22} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
              Delete Workspace
            </h3>
            <p className={styles.modalDesc}>
              This action is permanent and cannot be undone. All tasks, members, and data in this workspace will be deleted forever. Please enter your account password to confirm.
            </p>
            {deleteError && (
              <div className={styles.errorMessage}>{deleteError}</div>
            )}
            <input
              type="password"
              className="input-field"
              placeholder="Enter your account password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmDelete(); }}
              autoFocus
              style={{ width: '100%' }}
            />
            <textarea
              className="input-field"
              placeholder="Reason for deletion (optional)"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              rows={2}
              style={{ width: '100%', marginTop: '0.75rem', resize: 'vertical' }}
            />
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => { setDeleteDomainId(null); setConfirmPassword(''); setDeleteError(''); setDeleteReason(''); }}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className={styles.dangerBtn}
                onClick={handleConfirmDelete}
                disabled={deleteLoading || !confirmPassword}
              >
                <Trash2 size={16} />
                {deleteLoading ? 'Deleting...' : 'Delete Workspace'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Workspace Confirmation Modal */}
      {leaveDomain && (
        <div className={styles.modalOverlay} onClick={() => { setLeaveDomain(null); setLeavePassword(''); setLeaveError(''); setLeaveReason(''); }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle} style={{ color: 'var(--text-primary)' }}>
              <LogOut size={22} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
              Leave Workspace
            </h3>
            <p className={styles.modalDesc}>
              You are about to leave <strong>"{leaveDomain.name}"</strong>. Your assigned tasks will be removed. Enter your account password to confirm.
            </p>
            {leaveError && (
              <div className={styles.errorMessage}>{leaveError}</div>
            )}
            <input
              type="password"
              className="input-field"
              placeholder="Enter your account password"
              value={leavePassword}
              onChange={(e) => setLeavePassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmLeave(); }}
              autoFocus
              style={{ width: '100%' }}
            />
            <textarea
              className="input-field"
              placeholder="Reason for leaving (optional)"
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              rows={2}
              style={{ width: '100%', marginTop: '0.75rem', resize: 'vertical' }}
            />
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => { setLeaveDomain(null); setLeavePassword(''); setLeaveError(''); setLeaveReason(''); }}
                disabled={leaveLoading}
              >
                Cancel
              </button>
              <button
                className={styles.dangerBtn}
                onClick={handleConfirmLeave}
                disabled={leaveLoading || !leavePassword}
              >
                <LogOut size={16} />
                {leaveLoading ? 'Leaving...' : 'Leave Workspace'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
