'use client';

import { useState, useEffect } from 'react';
import { Settings, Moon, Sun } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    setIsOpen(false);
  };

  const pathname = usePathname();

  if (!mounted) return null;
  
  // Hide global floating settings toggle on the dashboard pages
  if (pathname?.startsWith('/dashboard')) return null;

  return (
    <div style={{ position: 'fixed', top: '0.75rem', right: '0.75rem', zIndex: 100000 }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-glass)',
          transition: 'transform 0.2s'
        }}
        title="Settings & Theme"
      >
        <Settings size={20} style={{ animation: isOpen ? 'spin 2s linear infinite' : 'none' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '50px',
          right: '0',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          boxShadow: 'var(--shadow-glass)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <button 
            onClick={() => toggleTheme('light')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: theme === 'light' ? 'var(--bg-tertiary)' : 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Sun size={16} /> Light Mode
          </button>
          <button 
            onClick={() => toggleTheme('dark')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: theme === 'dark' ? 'var(--bg-tertiary)' : 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Moon size={16} /> Dark Mode
          </button>
        </div>
      )}
    </div>
  );
}
