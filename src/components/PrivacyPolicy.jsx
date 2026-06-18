import React from 'react';

export default function PrivacyPolicy({ setView }) {
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
        <h1 className="neon-text-cyan" style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--dim)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Last Updated: June 18, 2026
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--fg)', fontSize: '0.95rem', lineHeight: '1.6' }}>
          <section>
            <h2 className="neon-text-purple" style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>1. Introduction</h2>
            <p>
              Welcome to TestUrTyping. We respect your privacy and are committed to protecting it. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website (https://testurtyping.vercel.app/).
            </p>
          </section>

          <section>
            <h2 className="neon-text-purple" style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>2. Information Collection</h2>
            <p>
              TestUrTyping is a local-first application. We do not run databases or collect personal identity details (like your name or email address) unless you voluntarily reach out to our official support email. Your typing test statistics, milestones, and setting configurations are saved directly in your browser's local storage.
            </p>
          </section>

          <section>
            <h2 className="neon-text-purple" style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>3. Google AdSense and DoubleClick Cookies</h2>
            <p>
              Google is a third-party vendor on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>https://policies.google.com/technologies/ads</a>.
            </p>
          </section>

          <section>
            <h2 className="neon-text-purple" style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>4. Log Files</h2>
            <p>
              TestUrTyping follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
            </p>
          </section>

          <section>
            <h2 className="neon-text-purple" style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>5. Third Party Privacy Policies</h2>
            <p>
              Our Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
            </p>
          </section>

          <section>
            <h2 className="neon-text-purple" style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>6. Consent</h2>
            <p>
              By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
