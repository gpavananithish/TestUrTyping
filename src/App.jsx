import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import Navbar from './components/Navbar';
import LetterSelector from './components/LetterSelector';
import VirtualKeyboard from './components/VirtualKeyboard';
import TypingEngine from './components/TypingEngine';
import Analytics from './components/Analytics';
import Dashboard from './components/Dashboard';
import NotificationModal from './components/NotificationModal';
import Footer from './components/Footer';
import DynamicBackground from './components/DynamicBackground';
import { generatePassage } from './utils/generator';

gsap.registerPlugin(useGSAP);

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('tut_theme') || 'light');
  const [soundVolume, setSoundVolume] = useState(() => {
    const saved = localStorage.getItem('tut_volume');
    return saved !== null ? Number(saved) : 0.8;
  });
  const [view, setView] = useState(() => localStorage.getItem('tut_view') || 'setup');
  const [selectedLetters, setSelectedLetters] = useState(() => {
    const saved = localStorage.getItem('tut_letters');
    return saved ? new Set(JSON.parse(saved)) : new Set(['a', 's', 'd', 'f', 'j', 'k', 'l', 'e', 't']);
  });
  const [useCaps, setUseCaps] = useState(() => localStorage.getItem('tut_caps') === 'true');
  const [useNumbers, setUseNumbers] = useState(() => localStorage.getItem('tut_nums') === 'true');
  const [usePunctuation, setUsePunctuation] = useState(() => localStorage.getItem('tut_punc') === 'true');
  const [lengthConfig, setLengthConfig] = useState(() => Number(localStorage.getItem('tut_len')) || 25);
  
  const [passage, setPassage] = useState(() => localStorage.getItem('tut_passage') || '');
  const [activeKey, setActiveKey] = useState(null);
  
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('tut_stats');
    return saved ? JSON.parse(saved) : { wpm: 0, accuracy: 100 };
  });
  const [liveStats, setLiveStats] = useState({ wpm: 0, accuracy: 100 });
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('tut_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Track overall and session stats
  const [sessionTimeSpent, setSessionTimeSpent] = useState(0);
  const [sessionCharsTyped, setSessionCharsTyped] = useState(0);
  const [sessionWordsTyped, setSessionWordsTyped] = useState(0);

  const [overallTimeSpent, setOverallTimeSpent] = useState(() => Number(localStorage.getItem('tut_overall_time_spent')) || 0);
  const [overallCharsTyped, setOverallCharsTyped] = useState(() => Number(localStorage.getItem('tut_overall_chars_typed')) || 0);
  const [overallWordsTyped, setOverallWordsTyped] = useState(() => Number(localStorage.getItem('tut_overall_words_typed')) || 0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('tut_theme', theme);
    localStorage.setItem('tut_view', view);
    localStorage.setItem('tut_letters', JSON.stringify([...selectedLetters]));
    localStorage.setItem('tut_caps', useCaps);
    localStorage.setItem('tut_nums', useNumbers);
    localStorage.setItem('tut_punc', usePunctuation);
    localStorage.setItem('tut_len', lengthConfig);
    localStorage.setItem('tut_passage', passage);
    localStorage.setItem('tut_stats', JSON.stringify(stats));
    localStorage.setItem('tut_history', JSON.stringify(history));
    localStorage.setItem('tut_volume', soundVolume);
    localStorage.setItem('tut_overall_time_spent', overallTimeSpent);
    localStorage.setItem('tut_overall_chars_typed', overallCharsTyped);
    localStorage.setItem('tut_overall_words_typed', overallWordsTyped);
  }, [theme, view, selectedLetters, useCaps, useNumbers, usePunctuation, lengthConfig, passage, stats, history, soundVolume, overallTimeSpent, overallCharsTyped, overallWordsTyped]);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  useEffect(() => {
    let pageTitle = 'TestUrTyping';
    let faviconSvg = '';
    
    if (view === 'setup') {
      pageTitle = 'Setup - TUT';
      faviconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <rect x="5" y="5" width="90" height="90" rx="20" fill="#021a1f" stroke="#06b6d4" stroke-width="6"/>
          <path d="M50 30a20 20 0 1 0 0 40 20 20 0 0 0 0-40zm0 12a8 8 0 1 1 0 16 8 8 0 0 1 0-16z" fill="#06b6d4"/>
          <path d="M50 20a5 5 0 0 1 5 5v5a5 5 0 0 1-10 0v-5a5 5 0 0 1 5-5zm0 50a5 5 0 0 1 5 5v5a5 5 0 0 1-10 0v-5a5 5 0 0 1 5-5zm-30-20a5 5 0 0 1 5-5h5a5 5 0 0 1 0 10h-5a5 5 0 0 1-5-5zm50 0a5 5 0 0 1 5-5h5a5 5 0 0 1 0 10h-5a5 5 0 0 1-5-5zm-38.3-21.7a5 5 0 0 1 7.1 0l3.5 3.5a5 5 0 0 1-7.1 7.1l-3.5-3.5a5 5 0 0 1 0-7.1zm28.3 28.3a5 5 0 0 1 7.1 0l3.5 3.5a5 5 0 0 1-7.1 7.1l-3.5-3.5a5 5 0 0 1 0-7.1zm-28.3 0a5 5 0 0 1 0 7.1l-3.5 3.5a5 5 0 1 1-7.1-7.1l3.5-3.5a5 5 0 0 1 7.1 0zm28.3-28.3a5 5 0 0 1 0 7.1l-3.5 3.5a5 5 0 1 1-7.1-7.1l3.5-3.5a5 5 0 0 1 7.1 0z" fill="#06b6d4"/>
        </svg>
      `;
    } else if (view === 'practice') {
      pageTitle = 'Practice - TUT';
      faviconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <rect x="5" y="15" width="90" height="70" rx="16" fill="#1f0213" stroke="#ec4899" stroke-width="8"/>
          <rect x="18" y="30" width="12" height="12" rx="3" fill="#ec4899"/>
          <rect x="36" y="30" width="12" height="12" rx="3" fill="#ffffff" opacity="0.9"/>
          <rect x="54" y="30" width="12" height="12" rx="3" fill="#ffffff" opacity="0.9"/>
          <rect x="72" y="30" width="12" height="12" rx="3" fill="#ec4899"/>
          <rect x="18" y="50" width="12" height="12" rx="3" fill="#ffffff" opacity="0.9"/>
          <rect x="36" y="50" width="48" height="12" rx="3" fill="#ec4899"/>
        </svg>
      `;
    } else if (view === 'dashboard') {
      pageTitle = 'Dashboard - TUT';
      faviconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <rect x="5" y="5" width="90" height="90" rx="20" fill="#0f091f" stroke="#8b5cf6" stroke-width="6"/>
          <rect x="20" y="50" width="14" height="30" rx="4" fill="#8b5cf6"/>
          <rect x="43" y="25" width="14" height="55" rx="4" fill="#ffffff" opacity="0.9"/>
          <rect x="66" y="38" width="14" height="42" rx="4" fill="#8b5cf6"/>
          <line x1="15" y1="80" x2="85" y2="80" stroke="#8b5cf6" stroke-width="4" stroke-linecap="round"/>
        </svg>
      `;
    }
    
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = `data:image/svg+xml,${encodeURIComponent(faviconSvg.trim())}`;
    document.title = pageTitle;
  }, [view]);

  const handleStartPractice = () => {
    setPassage(generatePassage(selectedLetters, lengthConfig, { useCaps, useNumbers, usePunctuation }));
    setStats({ wpm: 0, accuracy: 100 });
    setLiveStats({ wpm: 0, accuracy: 100 });
    setView('practice');
  };

  const handleProgress = (liveResult) => {
    setLiveStats(liveResult);
  };

  const handleFinish = (resultStats) => {
    setStats(resultStats);
    setLiveStats(resultStats);
    setHistory((prev) => [...prev, { name: `Run ${prev.length + 1}`, ...resultStats }]);
  };

  const handleActiveTick = () => {
    setSessionTimeSpent((prev) => {
      const next = prev + 1;
      // Trigger notification modal at multiples of 15 minutes (900 seconds)
      if (next > 0 && next % 900 === 0) {
        setIsModalOpen(true);
      }
      return next;
    });
    setOverallTimeSpent((prev) => prev + 1);
  };

  const handleKeyStroke = (isCorrect) => {
    if (isCorrect) {
      setSessionCharsTyped((prev) => {
        const next = prev + 1;
        setSessionWordsTyped(Math.round(next / 5));
        return next;
      });
      setOverallCharsTyped((prev) => {
        const next = prev + 1;
        setOverallWordsTyped(Math.round(next / 5));
        return next;
      });
    }
  };

  const handleResetStats = () => {
    if (window.confirm("Are you sure you want to reset all progress, statistics, and history? This cannot be undone.")) {
      setHistory([]);
      setStats({ wpm: 0, accuracy: 100 });
      setLiveStats({ wpm: 0, accuracy: 100 });
      setOverallTimeSpent(0);
      setOverallWordsTyped(0);
      setOverallCharsTyped(0);
      setSessionTimeSpent(0);
      setSessionWordsTyped(0);
      setSessionCharsTyped(0);
    }
  };

  return (
    <>
      <DynamicBackground theme={theme} />
      <div className="mobile-warning">
        <h2 className="neon-text-orange" style={{fontSize: '2rem', marginBottom: '1rem'}}>⚠️ Orientation Warning</h2>
        <p style={{fontSize: '1.2rem', lineHeight: '1.5', color: 'var(--dim)'}}>
          Please rotate your device to landscape mode or switch to a desktop browser. 
          <br/><br/>
          This application requires a physical keyboard for the best experience and cannot be used effectively in portrait mobile mode.
        </p>
      </div>
      <Navbar theme={theme} setTheme={setTheme} currentView={view} setView={setView} soundVolume={soundVolume} setSoundVolume={setSoundVolume} />
      <div className="dashboard-container" ref={containerRef}>
        {view === 'setup' && (
          <div className="setup-container">
            <div className="setup-console-card">
              <div className="console-header">
                <h1 className="console-title neon-text-cyan">
                  <span className="console-pulse-dot"></span> Practice Config Console
                </h1>
                <p className="console-subtitle">Configure your target practice keys and engine parameters side-by-side.</p>
              </div>
              
              <div className="console-grid">
                {/* Column 1: Step 1 */}
                <div className="console-left">
                  <h2 className="section-title neon-text-purple">
                    <span style={{ marginRight: '0.5rem', userSelect: 'none' }}>🎯</span> Step 1: Target Keys
                  </h2>
                  <LetterSelector selectedLetters={selectedLetters} setSelectedLetters={setSelectedLetters} />
                </div>
                
                {/* Column 2: Step 2 */}
                <div className="console-right">
                  <h2 className="section-title neon-text-orange">
                    <span style={{ marginRight: '0.5rem', userSelect: 'none' }}>⚙️</span> Step 2: Configuration
                  </h2>
                  
                  <div className="config-panel" style={{ width: '100%' }}>
                    <div className="config-group">
                      <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Passage Length (Words)</span>
                        <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{lengthConfig}</span>
                      </label>
                      <div style={{ marginTop: '1rem' }}>
                        <input 
                          type="range" 
                          min="10" 
                          max="100" 
                          step="5" 
                          value={lengthConfig} 
                          onChange={(e) => setLengthConfig(Number(e.target.value))} 
                          className="range-slider"
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--dim)', marginTop: '0.5rem' }}>
                          <span>10</span>
                          <span>100</span>
                        </div>
                      </div>
                    </div>

                    <div className="config-group" style={{ marginTop: '1.5rem' }}>
                      <label>Include Extras</label>
                      <div className="btn-group" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                        <button 
                          className={`config-btn ${useCaps ? 'active' : ''}`} 
                          onClick={() => setUseCaps(!useCaps)}
                        >
                          Capital Letters
                        </button>
                        <button 
                          className={`config-btn ${useNumbers ? 'active' : ''}`} 
                          onClick={() => setUseNumbers(!useNumbers)}
                        >
                          Numbers
                        </button>
                        <button 
                          className={`config-btn ${usePunctuation ? 'active' : ''}`} 
                          onClick={() => setUsePunctuation(!usePunctuation)}
                        >
                          Punctuation
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="console-launch">
                    <button className="btn-primary console-launch-btn" onClick={handleStartPractice}>
                      Launch Practice Engine 🚀
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'practice' && (
          <div className="practice-container" style={{ gap: '1rem' }}>
            {/* TOP METRICS STRIP — 4 live stats */}
            <Analytics
              liveStats={liveStats}
              history={history}
              side="top"
            />

            {/* CENTER: Typing Paragraph + Keyboard as a single unit */}
            <div className="practice-typing-keyboard-unit">
              {/* Paragraph area — buttons are inside TypingEngine */}
              <div className="ptku-paragraph">
                <TypingEngine
                  passage={passage}
                  onFinish={handleFinish}
                  onProgress={handleProgress}
                  activeKeyHandler={setActiveKey}
                  soundVolume={soundVolume}
                  onKeyStroke={handleKeyStroke}
                  onActiveTick={handleActiveTick}
                  isPaused={isModalOpen}
                  key={passage}
                  onBack={() => setView('setup')}
                  onRestart={handleStartPractice}
                />
              </div>

              {/* Divider */}
              <div className="ptku-divider">
                <span className="ptku-divider-label">Virtual Keyboard</span>
                <span className="ptku-divider-hint">Highlighted keys are your practice targets</span>
              </div>

              {/* Keyboard area */}
              <div className="ptku-keyboard">
                <VirtualKeyboard selectedLetters={selectedLetters} activeKey={activeKey} />
              </div>
            </div>

            {/* BOTTOM METRICS + charts */}
            <Analytics
              liveStats={liveStats}
              history={history}
              side="bottom-full"
              sessionTimeSpent={sessionTimeSpent}
              sessionWordsTyped={sessionWordsTyped}
              passage={passage}
            />
          </div>
        )}


        {view === 'dashboard' && (
          <Dashboard 
            history={history} 
            overallTimeSpent={overallTimeSpent} 
            overallWordsTyped={overallWordsTyped} 
            onResetStats={handleResetStats} 
            onTriggerDemoNotification={() => setIsModalOpen(true)}
            setView={setView} 
          />
        )}
      </div>

      <Footer setView={setView} />

      <NotificationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        sessionTimeSpent={sessionTimeSpent} 
        sessionWordsTyped={sessionWordsTyped} 
        overallTimeSpent={overallTimeSpent} 
        overallWordsTyped={overallWordsTyped} 
      />
    </>
  );
}
