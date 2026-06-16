import React from 'react';
import { Sun, Moon, Volume2, VolumeX, Settings, Keyboard, BarChart2 } from 'lucide-react';

export default function Navbar({ theme, setTheme, currentView, setView, soundVolume, setSoundVolume }) {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Left Column: TUT Brand Logo */}
        <div className="navbar-left">
          <div className="brand-logo-container" onClick={() => setView('setup')}>
            <svg className="brand-logo-svg" width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="antiGrad" x1="0" y1="0" x2="100" y2="100">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <filter id="antiGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <ellipse cx="50" cy="50" rx="36" ry="12" stroke="var(--accent)" strokeWidth="4" transform="rotate(-30 50 50)" strokeDasharray="5 3" />
              <ellipse cx="50" cy="50" rx="36" ry="12" stroke="#ec4899" strokeWidth="4" transform="rotate(30 50 50)" />
              <circle cx="50" cy="50" r="16" fill="url(#antiGrad)" filter="url(#antiGlow)" />
            </svg>
            <div className="brand-logo-text-group">
              <h1 className="brand-logo-main">Test ur typing</h1>
            </div>
          </div>
        </div>

        {/* Center Column: Quick Navigation Capsule */}
        <div className="navbar-center">
          <div className="nav-links-capsule">
            <button 
              className={`nav-link-new ${currentView === 'setup' ? 'active' : ''}`}
              onClick={() => setView('setup')}
            >
              <Settings size={14} className="nav-link-icon" style={{ strokeWidth: 2.5 }} />
              <span className="nav-link-text">Setup</span>
            </button>
            
            <button 
              className={`nav-link-new ${currentView === 'practice' ? 'active' : ''}`}
              onClick={() => setView('practice')}
            >
              <Keyboard size={14} className="nav-link-icon" style={{ strokeWidth: 2.5 }} />
              <span className="nav-link-text">Practice</span>
            </button>
            
            <button 
              className={`nav-link-new ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setView('dashboard')}
            >
              <BarChart2 size={14} className="nav-link-icon" style={{ strokeWidth: 2.5 }} />
              <span className="nav-link-text">Dashboard</span>
            </button>
          </div>
        </div>

        {/* Right Column: Theme/Volume controls */}
        <div className="navbar-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button className="theme-toggle" onClick={() => setSoundVolume(soundVolume === 0 ? 0.8 : 0)} aria-label="Toggle Sound" title="Toggle Sound">
              {soundVolume > 0 ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={soundVolume} 
              onChange={(e) => setSoundVolume(Number(e.target.value))}
              style={{ width: '50px', accentColor: 'var(--accent)', cursor: 'pointer' }}
              aria-label="Volume"
              title="Volume"
            />
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme" title="Toggle Theme">
              {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
