import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Analytics({ liveStats, history, side, sessionTimeSpent, sessionWordsTyped, passage }) {
  const wpmRef = useRef();
  const accRef = useRef();
  const peakRef = useRef();
  const avgRef = useRef();

  const wpm = liveStats?.wpm || 0;
  const accuracy = liveStats?.accuracy ?? 100;

  const totalTests = history ? history.length : 0;
  const historyHighest = totalTests > 0 ? Math.max(...history.map(h => h.wpm)) : 0;
  const highestWpm = Math.max(historyHighest, wpm);

  const historySum = totalTests > 0 ? history.reduce((acc, curr) => acc + curr.wpm, 0) : 0;
  const averageWpm = Math.round((historySum + wpm) / (totalTests + (wpm > 0 ? 1 : 0))) || 0;

  useEffect(() => {
    const wpmObj = { val: 0 };
    gsap.to(wpmObj, { val: wpm, duration: 1.5, ease: 'power2.out', onUpdate: () => { if (wpmRef.current) wpmRef.current.innerHTML = Math.round(wpmObj.val); } });

    const accObj = { val: 100 };
    gsap.to(accObj, { val: accuracy, duration: 1.5, ease: 'power2.out', onUpdate: () => { if (accRef.current) accRef.current.innerHTML = Math.round(accObj.val) + '%'; } });

    const peakObj = { val: 0 };
    gsap.to(peakObj, { val: highestWpm, duration: 1.5, ease: 'power2.out', onUpdate: () => { if (peakRef.current) peakRef.current.innerHTML = Math.round(peakObj.val); } });

    const avgObj = { val: 0 };
    gsap.to(avgObj, { val: averageWpm, duration: 1.5, ease: 'power2.out', onUpdate: () => { if (avgRef.current) avgRef.current.innerHTML = Math.round(avgObj.val); } });
  }, [wpm, accuracy, highestWpm, averageWpm]);

  let speedCategory = '🐢 Slow';
  let speedColorClass = 'neon-text-purple';
  if (wpm > 70) { speedCategory = '🚀 Super Sonic!'; speedColorClass = 'neon-text-magenta'; }
  else if (wpm > 45) { speedCategory = '⚡ Fast!'; speedColorClass = 'neon-text-cyan'; }
  else if (wpm > 20) { speedCategory = '🐇 Moderate'; speedColorClass = 'neon-text-purple'; }

  const sessionMinutes = Math.floor((sessionTimeSpent || 0) / 60);
  const sessionSeconds = (sessionTimeSpent || 0) % 60;

  const correctHits = liveStats?.correctChars || 0;
  const incorrectHits = liveStats?.incorrectChars || 0;
  const totalHits = liveStats?.totalChars || 0;

  const uniqueMistakes = [];
  if (passage && liveStats?.inputState) {
    liveStats.inputState.forEach((isCorrect, idx) => {
      if (!isCorrect) {
        const char = passage[idx];
        if (char && char !== ' ' && !uniqueMistakes.includes(char)) uniqueMistakes.push(char);
      }
    });
  }

  /* ── TOP STRIP: 4 live metric cards side by side ── */
  if (side === 'top') {
    return (
      <div className="practice-metrics-top">
        {/* WPM */}
        <div className="metric-chip card-bg-cyan">
          <div className="metric-chip-icon">⚡</div>
          <div className="metric-chip-body">
            <span className="metric-chip-label">Current WPM</span>
            <span className="metric-chip-value neon-text-cyan" ref={wpmRef}>0</span>
            <span className="metric-chip-sub">Live Speed</span>
          </div>
        </div>

        {/* Accuracy */}
        <div className="metric-chip card-bg-magenta">
          <div className="metric-chip-icon">🎯</div>
          <div className="metric-chip-body">
            <span className="metric-chip-label">Accuracy</span>
            <span className="metric-chip-value neon-text-magenta" ref={accRef}>100%</span>
            <span className="metric-chip-sub">Live Precision</span>
          </div>
        </div>

        {/* Peak WPM */}
        <div className="metric-chip card-bg-purple">
          <div className="metric-chip-icon">👑</div>
          <div className="metric-chip-body">
            <span className="metric-chip-label">Peak WPM</span>
            <span className="metric-chip-value neon-text-purple" ref={peakRef}>0</span>
            <span className="metric-chip-sub">All-Time High</span>
          </div>
        </div>

        {/* Avg WPM */}
        <div className="metric-chip card-bg-cyan">
          <div className="metric-chip-icon">📊</div>
          <div className="metric-chip-body">
            <span className="metric-chip-label">Avg WPM</span>
            <span className="metric-chip-value neon-text-cyan" ref={avgRef}>0</span>
            <span className="metric-chip-sub">Lifetime Average</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── BOTTOM-FULL: Session HUD + Keystrokes + Mistakes + Charts ── */
  if (side === 'bottom-full') {
    return (
      <div className="practice-bottom-section">
        {/* 3 detail stat cards */}
        <div className="practice-bottom-stats">
          {/* Session HUD */}
          <div className="stat-box card-bg-purple" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span className="section-title neon-text-purple" style={{ margin: 0 }}>Session HUD 🕒</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--dim)' }}>Active Time:</span>
                <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
                  {sessionMinutes}:{sessionSeconds.toString().padStart(2, '0')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--dim)' }}>Words Typed:</span>
                <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{sessionWordsTyped || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '0.5rem', borderTop: '1px solid var(--dimmer)', paddingTop: '0.5rem' }}>
                <span style={{ color: 'var(--dim)' }}>Speed level:</span>
                <span className={speedColorClass} style={{ fontWeight: 'bold' }}>{speedCategory}</span>
              </div>
            </div>
          </div>

          {/* Keystrokes */}
          <div className="stat-box card-bg-magenta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span className="section-title neon-text-magenta" style={{ margin: 0 }}>Keystrokes 🎯</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--dim)' }}>Correct Hits:</span>
                <span className="neon-text-cyan" style={{ fontWeight: 'bold' }}>✔️ {correctHits}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--dim)' }}>Error Hits:</span>
                <span className="neon-text-magenta" style={{ fontWeight: 'bold' }}>❌ {incorrectHits}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '0.5rem', borderTop: '1px solid var(--dimmer)', paddingTop: '0.5rem' }}>
                <span style={{ color: 'var(--dim)' }}>Total Hits:</span>
                <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{totalHits}</span>
              </div>
            </div>
          </div>

          {/* Mistakes Radar */}
          <div className="stat-box card-bg-cyan" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span className="section-title neon-text-cyan" style={{ margin: 0 }}>Mistakes Radar ⚠️</span>
            {uniqueMistakes.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', width: '100%' }}>
                {uniqueMistakes.map((char, i) => (
                  <span key={i} style={{
                    background: 'rgba(244, 63, 94, 0.15)',
                    border: '1px solid var(--neon-magenta)',
                    color: 'var(--neon-magenta)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {char === ' ' ? 'space' : char}
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>⭐</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--dim)', fontWeight: 'bold' }}>Flawless Run!</span>
              </div>
            )}
          </div>
        </div>

        {/* Charts when history exists */}
        {history && history.length > 0 && (
          <div className="practice-charts-row">
            <div className="chart-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="section-title neon-text-cyan" style={{ margin: 0 }}><span style={{ marginRight: '0.5rem' }}>📈</span> WPM Trend</h2>
              </div>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dimmer)" />
                    <XAxis dataKey="name" stroke="var(--dim)" fontSize={10} />
                    <YAxis stroke="var(--dim)" fontSize={10} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--accent)', backgroundColor: 'var(--bg)', color: 'var(--accent)' }} />
                    <Line type="natural" dataKey="wpm" name="WPM" stroke="var(--accent)" strokeWidth={3} activeDot={{ r: 8, fill: 'var(--accent)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="chart-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="section-title neon-text-purple" style={{ margin: 0 }}><span style={{ marginRight: '0.5rem' }}>✨</span> Accuracy (%)</h2>
              </div>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dimmer)" />
                    <XAxis dataKey="name" stroke="var(--dim)" fontSize={10} />
                    <YAxis stroke="var(--dim)" fontSize={10} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--neon-purple)', backgroundColor: 'var(--bg)', color: 'var(--neon-purple)' }} />
                    <Area type="natural" dataKey="accuracy" name="Accuracy" stroke="var(--neon-purple)" strokeWidth={3} fillOpacity={0.2} fill="var(--neon-purple)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── LEGACY: left / right / bottom (kept for compatibility) ── */
  return (
    <div className={`analytics-section ${side}-sidebar`}>
      <div className="stats-grid-column" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
        {side === 'left' && (
          <>
            <div className="stat-box card-bg-cyan">
              <div>
                <span className="section-title neon-text-cyan" style={{ margin: 0 }}>Current WPM</span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--dim)', marginBottom: '0.5rem' }}>Live Speed</span>
                <span className="stat-value neon-text-cyan" ref={wpmRef}>0</span>
              </div>
              <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 5px 8px rgba(16, 185, 129, 0.25))', userSelect: 'none' }}>⚡</span>
            </div>
            <div className="stat-box card-bg-magenta">
              <div>
                <span className="section-title neon-text-magenta" style={{ margin: 0 }}>Accuracy</span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--dim)', marginBottom: '0.5rem' }}>Live Precision</span>
                <span className="stat-value neon-text-magenta" ref={accRef}>100%</span>
              </div>
              <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 5px 8px rgba(236, 72, 153, 0.25))', userSelect: 'none' }}>🎯</span>
            </div>
            <div className="stat-box card-bg-purple" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span className="section-title neon-text-purple" style={{ margin: 0 }}>Session HUD 🕒</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--dim)' }}>Active Time:</span>
                  <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{sessionMinutes}:{sessionSeconds.toString().padStart(2, '0')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--dim)' }}>Words Typed:</span>
                  <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{sessionWordsTyped || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '0.5rem', borderTop: '1px solid var(--dimmer)', paddingTop: '0.5rem' }}>
                  <span style={{ color: 'var(--dim)' }}>Speed level:</span>
                  <span className={speedColorClass} style={{ fontWeight: 'bold' }}>{speedCategory}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {side === 'right' && (
          <>
            <div className="stat-box card-bg-purple">
              <div>
                <span className="section-title neon-text-purple" style={{ margin: 0 }}>Peak WPM</span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--dim)', marginBottom: '0.5rem' }}>All-Time High</span>
                <span className="stat-value neon-text-purple" ref={peakRef}>0</span>
              </div>
              <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 5px 8px rgba(139, 92, 246, 0.25))', userSelect: 'none' }}>👑</span>
            </div>
            <div className="stat-box card-bg-cyan">
              <div>
                <span className="section-title neon-text-cyan" style={{ margin: 0 }}>Avg WPM</span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--dim)', marginBottom: '0.5rem' }}>Lifetime Average</span>
                <span className="stat-value neon-text-cyan" ref={avgRef}>0</span>
              </div>
              <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 5px 8px rgba(6, 182, 212, 0.25))', userSelect: 'none' }}>🧸</span>
            </div>
          </>
        )}

        {side === 'bottom' && history && history.length > 0 && (
          <div className="stats-grid-row" style={{ marginTop: '2rem', justifyContent: 'center', flexWrap: 'nowrap' }}>
            <div className="chart-box" style={{ flex: 'none', width: '400px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="section-title neon-text-cyan" style={{ margin: 0 }}><span style={{ marginRight: '0.5rem' }}>📈</span> WPM Trend</h2>
              </div>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dimmer)" />
                    <XAxis dataKey="name" stroke="var(--dim)" fontSize={10} />
                    <YAxis stroke="var(--dim)" fontSize={10} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--accent)', backgroundColor: 'var(--bg)', color: 'var(--accent)' }} />
                    <Line type="natural" dataKey="wpm" name="WPM" stroke="var(--accent)" strokeWidth={3} activeDot={{ r: 8, fill: 'var(--accent)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="chart-box" style={{ flex: 'none', width: '400px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="section-title neon-text-purple" style={{ margin: 0 }}><span style={{ marginRight: '0.5rem' }}>✨</span> Accuracy (%)</h2>
              </div>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dimmer)" />
                    <XAxis dataKey="name" stroke="var(--dim)" fontSize={10} />
                    <YAxis stroke="var(--dim)" fontSize={10} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--neon-purple)', backgroundColor: 'var(--bg)', color: 'var(--neon-purple)' }} />
                    <Area type="natural" dataKey="accuracy" name="Accuracy" stroke="var(--neon-purple)" strokeWidth={3} fillOpacity={0.2} fill="var(--neon-purple)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
