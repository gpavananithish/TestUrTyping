import React from 'react';
import { Sun, Moon, Keyboard, Settings, Type } from 'lucide-react';

export default function Navbar({ theme, setTheme, currentView, setView }) {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="header-title" style={{ cursor: 'pointer' }} onClick={() => setView('setup')}>
          <Keyboard size={42} className="neon-icon-cyan" />
          <div>
            <h1 className="neon-text-cyan">TUT</h1>
            <h2 className="brand-name" style={{ marginTop: 0 }}>TestUrTyping</h2>
          </div>
        </div>

        <div className="nav-links">
          <button 
            className={`nav-link ${currentView === 'setup' ? 'active' : ''}`}
            onClick={() => setView('setup')}
          >
            <Settings size={22} className="neon-icon-orange" /> Setup
          </button>
          <button 
            className={`nav-link ${currentView === 'practice' ? 'active' : ''}`}
            onClick={() => setView('practice')}
          >
            Practice
          </button>
        </div>

        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </nav>
  );
}
