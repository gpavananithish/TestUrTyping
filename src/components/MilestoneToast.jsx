import React, { useEffect } from 'react';

export default function MilestoneToast({ toasts, setToasts }) {
  useEffect(() => {
    if (toasts.length === 0) return;

    const timer = setInterval(() => {
      setToasts(prev => {
        if (prev.length === 0) return prev;
        const now = Date.now();
        const filtered = prev.filter(t => now - t.timestamp < 4500);
        if (filtered.length !== prev.length) {
          return filtered;
        }
        return prev;
      });
    }, 500);

    return () => clearInterval(timer);
  }, [toasts, setToasts]);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card border-${toast.color}`}>
          <div style={{ fontSize: '2rem', userSelect: 'none' }}>
            {toast.emoji}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span style={{ 
              fontWeight: '900', 
              fontSize: '0.75rem', 
              textTransform: 'uppercase', 
              color: 'var(--dim)',
              letterSpacing: '1px'
            }}>
              Milestone Achieved! 🎉
            </span>
            <span style={{ 
              fontWeight: '900', 
              fontSize: '1.05rem',
              color: `var(--neon-${toast.color})`
            }}>
              {toast.title}
            </span>
            <span style={{ 
              fontSize: '0.8rem', 
              color: 'var(--dim)',
              marginTop: '0.1rem'
            }}>
              {toast.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
