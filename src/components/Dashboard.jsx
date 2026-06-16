import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

export default function Dashboard({ 
  history, 
  overallTimeSpent, 
  overallWordsTyped, 
  onResetStats, 
  onTriggerDemoNotification,
  setView
}) {
  const totalTests = history.length;
  
  // Calculate average WPM and Accuracy
  const averageWpm = totalTests > 0 
    ? Math.round(history.reduce((sum, item) => sum + (item.wpm || 0), 0) / totalTests)
    : 0;
  
  const averageAccuracy = totalTests > 0 
    ? Math.round(history.reduce((sum, item) => sum + (item.accuracy ?? 100), 0) / totalTests)
    : 100;

  const peakWpm = totalTests > 0 
    ? Math.max(...history.map(item => item.wpm || 0))
    : 0;

  const totalMinutes = Math.floor(overallTimeSpent / 60);
  const totalSeconds = overallTimeSpent % 60;

  // Achievement check list using emojis instead of vector icons for fluffy aesthetic
  const achievements = [
    {
      id: 'first_test',
      title: 'First Step',
      description: 'Complete 1 typing practice run',
      unlocked: totalTests >= 1,
      emoji: '🐣',
      color: 'cyan'
    },
    {
      id: 'ten_tests',
      title: 'Decathlon Typist',
      description: 'Complete 10 typing practice runs',
      unlocked: totalTests >= 10,
      emoji: '🔥',
      color: 'purple'
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Achieve a speed of 50 WPM or more',
      unlocked: peakWpm >= 50,
      emoji: '⚡',
      color: 'magenta'
    },
    {
      id: 'sonic',
      title: 'Sonic Velocity',
      description: 'Achieve a speed of 80 WPM or more',
      unlocked: peakWpm >= 80,
      emoji: '🚀',
      color: 'magenta'
    },
    {
      id: 'perfect_accuracy',
      title: 'Flawless Flow',
      description: 'Hit 100% accuracy on any practice run',
      unlocked: history.some(item => (item.accuracy ?? 0) === 100),
      emoji: '🎯',
      color: 'purple'
    },
    {
      id: 'marathon',
      title: 'Zen Master',
      description: 'Accumulate 15 minutes of typing practice',
      unlocked: overallTimeSpent >= 900,
      emoji: '🧸',
      color: 'cyan'
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="dashboard-view-container">
      <div className="dashboard-header-row">
        <div>
          <h1 className="neon-text-cyan dashboard-title">Typing Dashboard</h1>
          <p className="dashboard-subtitle">Monitor your muscle memory growth, track statistics, and review milestones.</p>
        </div>
        <button className="btn-primary" onClick={() => setView('practice')}>
          <span style={{ marginRight: '0.35rem', userSelect: 'none' }}>🚀</span> Start Practicing
        </button>
      </div>

      {/* KPI Stats Panel */}
      <div className="stats-grid-row">
        <div className="stat-box card-bg-cyan">
          <div>
            <span className="section-title neon-text-cyan" style={{ margin: 0 }}>Total Practice Time</span>
            <span className="stat-meta">Active typing hours/minutes</span>
            <span className="stat-value neon-text-cyan">
              {totalMinutes}m <span style={{ fontSize: '1.5rem' }}>{totalSeconds}s</span>
            </span>
          </div>
          <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))', userSelect: 'none' }}>⏱️</span>
        </div>

        <div className="stat-box card-bg-magenta">
          <div>
            <span className="section-title neon-text-magenta" style={{ margin: 0 }}>Words Practiced</span>
            <span className="stat-meta">Lifetime total words typed</span>
            <span className="stat-value neon-text-magenta">{overallWordsTyped}</span>
          </div>
          <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))', userSelect: 'none' }}>✍️</span>
        </div>

        <div className="stat-box card-bg-orange">
          <div>
            <span className="section-title neon-text-orange" style={{ margin: 0 }}>Peak Speed</span>
            <span className="stat-meta">Your highest WPM recorded</span>
            <span className="stat-value neon-text-orange">{peakWpm} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>WPM</span></span>
          </div>
          <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))', userSelect: 'none' }}>🏆</span>
        </div>

        <div className="stat-box card-bg-lime">
          <div>
            <span className="section-title neon-text-lime" style={{ margin: 0 }}>Average Speed</span>
            <span className="stat-meta">Average across all runs</span>
            <span className="stat-value neon-text-lime">{averageWpm} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>WPM</span></span>
          </div>
          <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))', userSelect: 'none' }}>⚡</span>
        </div>

        <div className="stat-box card-bg-purple">
          <div>
            <span className="section-title neon-text-purple" style={{ margin: 0 }}>Avg Accuracy</span>
            <span className="stat-meta">Lifetime correct hits %</span>
            <span className="stat-value neon-text-purple">{averageAccuracy}%</span>
          </div>
          <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))', userSelect: 'none' }}>🎯</span>
        </div>
      </div>

      {/* Chart Section */}
      {totalTests > 0 ? (
        <div className="charts-grid">
          <div className="chart-box">
            <h2 className="section-title neon-text-cyan">
              <span style={{ marginRight: '0.5rem', userSelect: 'none' }}>📈</span> WPM Progression
            </h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={history} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dimmer)" />
                  <XAxis dataKey="name" stroke="var(--dim)" fontSize={11} />
                  <YAxis stroke="var(--dim)" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid var(--accent)', 
                      backgroundColor: 'var(--bg)', 
                      color: 'var(--accent)',
                      boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wpm" 
                    name="WPM" 
                    stroke="var(--accent)" 
                    strokeWidth={3} 
                    activeDot={{ r: 8, fill: 'var(--accent)' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-box">
            <h2 className="section-title neon-text-purple">
              <span style={{ marginRight: '0.5rem', userSelect: 'none' }}>✨</span> Accuracy Trend
            </h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={history} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--neon-purple)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--neon-purple)" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dimmer)" />
                  <XAxis dataKey="name" stroke="var(--dim)" fontSize={11} />
                  <YAxis stroke="var(--dim)" fontSize={11} domain={[50, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid var(--neon-purple)', 
                      backgroundColor: 'var(--bg)', 
                      color: 'var(--neon-purple)',
                      boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="accuracy" 
                    name="Accuracy %" 
                    stroke="var(--neon-purple)" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorAcc)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="card-section glass-empty-state">
          <span style={{ fontSize: '3.5rem', marginBottom: '1rem', display: 'block', userSelect: 'none' }}>📝</span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>No typing history found</h3>
          <p style={{ color: 'var(--dim)', marginTop: '0.5rem' }}>
            Complete your first typing practice run to generate progression graphs and charts.
          </p>
        </div>
      )}

      {/* Achievements Section */}
      <div className="card-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="section-title neon-text-purple" style={{ margin: 0 }}>
            <span style={{ marginRight: '0.5rem', userSelect: 'none' }}>🏅</span> Milestones & Achievements
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--dim)', fontWeight: 'bold' }}>
            Unlocked: {unlockedCount} / {achievements.length}
          </span>
        </div>
        
        <div className="achievements-grid">
          {achievements.map((badge, idx) => {
            const themeClass = badge.unlocked ? `card-bg-${badge.color}` : 'achievement-locked';
            const textTheme = badge.unlocked ? `neon-text-${badge.color}` : '';
            
            return (
              <div key={idx} className={`achievement-card ${themeClass}`}>
                <div className={`achievement-icon-wrapper ${badge.unlocked ? 'unlocked' : ''}`} style={{ fontSize: '1.6rem', userSelect: 'none' }}>
                  {badge.emoji}
                </div>
                <div className="achievement-info">
                  <h4 className={textTheme} style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{badge.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--dim)', marginTop: '0.2rem' }}>{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action / Debug Panel */}
      <div className="card-section config-panel">
        <h2 className="section-title neon-text-orange">
          <span style={{ marginRight: '0.5rem', userSelect: 'none' }}>🛠️</span> System Management
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--dim)', marginBottom: '1rem' }}>
          Configure system notifications, verify milestones, or wipe local database configurations.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={onTriggerDemoNotification}>
            <span style={{ marginRight: '0.25rem' }}>👁️</span> Preview 15-Min Notification
          </button>
          
          <button 
            className="btn-secondary" 
            style={{ borderColor: 'var(--incorrect)', color: 'var(--incorrect)' }}
            onClick={onResetStats}
          >
            <span style={{ marginRight: '0.25rem' }}>🔄</span> Reset All Progress & History
          </button>
        </div>
      </div>
    </div>
  );
}
