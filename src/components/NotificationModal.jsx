import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function NotificationModal({ 
  isOpen, 
  onClose, 
  sessionTimeSpent, 
  sessionWordsTyped, 
  overallTimeSpent, 
  overallWordsTyped 
}) {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Entry Animation
      gsap.to(backdropRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.fromTo(modalRef.current, 
        { scale: 0.8, y: 50, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in'
    });
    gsap.to(modalRef.current, {
      scale: 0.8,
      y: 30,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: onClose
    });
  };

  if (!isOpen) return null;

  const sessionMinutes = Math.floor(sessionTimeSpent / 60);
  const sessionSeconds = sessionTimeSpent % 60;
  const overallMinutes = Math.floor(overallTimeSpent / 60);

  return (
    <div 
      className="glass-modal-backdrop" 
      ref={backdropRef} 
      style={{ opacity: 0 }}
      onClick={handleClose}
    >
      <div 
        className="glass-modal-content" 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-glow-effect"></div>
        
        <div className="modal-header-badge" style={{ fontSize: '2.5rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', width: '4.5rem', height: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)' }}>
          🏆
        </div>

        <h2 className="modal-title neon-text-purple">
          15-Minute Practice Milestone!
        </h2>
        
        <p className="modal-subtitle">
          Fantastic effort! Taking regular brief breaks helps keep your muscle memory sharp and prevents fatigue. Here is what you've achieved so far:
        </p>

        <div className="modal-stats-grid">
          <div className="modal-stat-card card-bg-cyan">
            <span style={{ fontSize: '1.75rem', userSelect: 'none' }}>⏱️</span>
            <div className="modal-stat-info">
              <span className="modal-stat-label">Session Practice Time</span>
              <span className="modal-stat-value neon-text-cyan">
                {sessionMinutes > 0 ? `${sessionMinutes}m ` : ''}{sessionSeconds}s
              </span>
            </div>
          </div>

          <div className="modal-stat-card card-bg-magenta">
            <span style={{ fontSize: '1.75rem', userSelect: 'none' }}>✍️</span>
            <div className="modal-stat-info">
              <span className="modal-stat-label">Session Words Typed</span>
              <span className="modal-stat-value neon-text-magenta">
                {sessionWordsTyped} words
              </span>
            </div>
          </div>

          <div className="modal-stat-card card-bg-cyan">
            <span style={{ fontSize: '1.75rem', userSelect: 'none' }}>🧸</span>
            <div className="modal-stat-info">
              <span className="modal-stat-label">Lifetime Practice Time</span>
              <span className="modal-stat-value neon-text-cyan">
                {overallMinutes} minutes
              </span>
            </div>
          </div>

          <div className="modal-stat-card card-bg-purple">
            <span style={{ fontSize: '1.75rem', userSelect: 'none' }}>🎯</span>
            <div className="modal-stat-info">
              <span className="modal-stat-label">Lifetime Words Typed</span>
              <span className="modal-stat-value neon-text-purple">
                {overallWordsTyped} words
              </span>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-modal-dismiss" onClick={handleClose}>
            Continue Practicing
          </button>
          <button 
            className="btn-modal-break" 
            onClick={() => {
              handleClose();
            }}
          >
            Take a Quick Stretch 🚶‍♂️
          </button>
        </div>
      </div>
    </div>
  );
}
