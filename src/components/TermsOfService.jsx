import React from 'react';

export default function TermsOfService({ setView }) {
  return (
    <div className="setup-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <button 
        className="engine-action-btn engine-btn-back" 
        onClick={() => setView('setup')} 
        style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border-shadow)', padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', color: 'inherit' }}
      >
        <span>👈 Go Back</span>
      </button>

      <div className="setup-console-card" style={{ padding: '2.5rem', background: 'var(--surface)', border: '1px solid var(--border-shadow)', borderRadius: '12px' }}>
        <h1 className="neon-text-orange" style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
          Terms of Service
        </h1>
        <p style={{ color: 'var(--dim)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Last Updated: June 18, 2026
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--fg)', fontSize: '0.95rem', lineHeight: '1.6' }}>
          <section>
            <h2 className="neon-text-purple" style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>1. Agreement to Terms</h2>
            <p>
              By accessing and using TestUrTyping (https://testurtyping.vercel.app/), you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue use of the site.
            </p>
          </section>

          <section>
            <h2 className="neon-text-purple" style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>2. Use License</h2>
            <p>
              TestUrTyping is an open typing practice utility. You are granted permission to access and play typing exercises for personal, non-commercial use. You may not copy, modify, scrape, or reverse engineer any part of the site code without explicit permission.
            </p>
          </section>

          <section>
            <h2 className="neon-text-purple" style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>3. Disclaimer</h2>
            <p>
              The materials and features on TestUrTyping are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
            </p>
          </section>

          <section>
            <h2 className="neon-text-purple" style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>4. Limitations of Liability</h2>
            <p>
              In no event shall TestUrTyping or its contributors be liable for any damages (including, without limitation, damages for loss of data, practice metrics, or browser storage failures) arising out of the use or inability to use the services on the site.
            </p>
          </section>

          <section>
            <h2 className="neon-text-purple" style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>5. Revisions and Errata</h2>
            <p>
              The materials appearing on TestUrTyping could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="neon-text-purple" style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>6. Governing Law</h2>
            <p>
              Any claim relating to TestUrTyping shall be governed by the laws of your home jurisdiction without regard to its conflict of law provisions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
