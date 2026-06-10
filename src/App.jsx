import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Target, Settings, ArrowLeft } from 'lucide-react';
import Navbar from './components/Navbar';
import LetterSelector from './components/LetterSelector';
import VirtualKeyboard from './components/VirtualKeyboard';
import TypingEngine from './components/TypingEngine';
import Analytics from './components/Analytics';
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
  }, [theme, view, selectedLetters, useCaps, useNumbers, usePunctuation, lengthConfig, passage, stats, history, soundVolume]);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  useEffect(() => {
    let faviconEmoji = '⌨️';
    let pageTitle = 'TestUrTyping';
    
    if (view === 'setup') {
      faviconEmoji = '⚙️';
      pageTitle = 'Setup - TUT';
    } else if (view === 'practice') {
      faviconEmoji = '⌨️';
      pageTitle = 'Practice - TUT';
    } else if (view === 'dashboard') {
      faviconEmoji = '📊';
      pageTitle = 'Dashboard - TUT';
    }

    const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${faviconEmoji}</text></svg>`;
    
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;
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
    setHistory((prev) => [...prev, { name: `Test ${prev.length + 1}`, ...resultStats }]);
  };

  return (
    <>
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
        {view === 'setup' ? (
          <div className="setup-container">
            <div className="card-section">
              <h2 className="section-title neon-text-purple"><Target size={24} className="neon-icon-purple" style={{marginRight:'0.5rem'}} /> Step 1: Target Keys</h2>
              <LetterSelector selectedLetters={selectedLetters} setSelectedLetters={setSelectedLetters} />
            </div>

            <div className="card-section config-panel">
              <h2 className="section-title neon-text-orange"><Settings size={24} className="neon-icon-orange" style={{marginRight:'0.5rem'}} /> Step 2: Configuration</h2>
              
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

              <div className="config-group">
                <label>Include Extras</label>
                <div className="btn-group" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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

            <div className="action-row" style={{ marginTop: '2rem' }}>
              <button className="btn-primary massive" onClick={handleStartPractice}>
                Go to Practice
              </button>
            </div>
          </div>
        ) : (
          <div className="practice-container workspace-3d-env">
            <div className="practice-header">
              <button className="btn-secondary" onClick={() => setView('setup')}>
                <ArrowLeft size={20} className="neon-icon-cyan" /> Back to Setup
              </button>
              <button className="btn-primary" onClick={handleStartPractice} style={{ padding: '0.75rem 1.5rem' }}>
                Restart Passage
              </button>
            </div>

            <div className="practice-dashboard-layout">
              <div className="left-analytics">
                <Analytics liveStats={liveStats} history={history} side="left" />
              </div>

              <div className="practice-main-center">
                <div className="typing-engine-wrapper">
                  <TypingEngine 
                    passage={passage} 
                    onFinish={handleFinish} 
                    onProgress={handleProgress}
                    activeKeyHandler={setActiveKey}
                    soundVolume={soundVolume}
                    key={passage} 
                  />
                </div>
                
                <div className="keyboard-overlay">
                  <VirtualKeyboard selectedLetters={selectedLetters} activeKey={activeKey} />
                </div>

                <div className="bottom-analytics" style={{ width: '100%' }}>
                  <Analytics liveStats={liveStats} history={history} side="bottom" />
                </div>
              </div>

              <div className="right-analytics">
                <Analytics liveStats={liveStats} history={history} side="right" />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
