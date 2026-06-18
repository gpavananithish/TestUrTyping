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
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { getAchievements } from '../utils/achievements';

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

  const achievements = getAchievements(history, overallTimeSpent, overallWordsTyped);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // Calculate advanced analytics
  const totalCorrectHits = history.reduce((sum, run) => sum + (run.correctChars || 0), 0);
  const totalIncorrectHits = history.reduce((sum, run) => sum + (run.incorrectChars || 0), 0);
  const totalKeystrokes = totalCorrectHits + totalIncorrectHits;
  const perfectRuns = history.filter(run => (run.accuracy ?? 0) === 100).length;

  let accuracyGrade = 'C-Tier 🐢';
  if (averageAccuracy >= 98) accuracyGrade = 'SS-Tier 💎';
  else if (averageAccuracy >= 95) accuracyGrade = 'S-Tier 🌟';
  else if (averageAccuracy >= 90) accuracyGrade = 'A-Tier ✨';
  else if (averageAccuracy >= 80) accuracyGrade = 'B-Tier 🐇';

  const pieData = [
    { name: 'Correct Hits', value: totalCorrectHits, color: 'var(--correct)' },
    { name: 'Error Hits', value: totalIncorrectHits, color: 'var(--incorrect)' }
  ];

  const volumeData = history.map((run, idx) => ({
    name: run.name || `Run ${idx + 1}`,
    words: Math.round((run.totalChars || 0) / 5)
  }));

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

      {/* Supplementary Analytics Strip */}
      {totalTests > 0 && (
        <div className="stats-grid-row" style={{ marginTop: '0.8rem' }}>
          <div className="stat-box card-bg-lime">
            <div>
              <span className="section-title neon-text-lime" style={{ margin: 0 }}>Accuracy Grade</span>
              <span className="stat-meta">Lifetime precision tier</span>
              <span className="stat-value neon-text-lime" style={{ fontSize: '1.65rem' }}>{accuracyGrade}</span>
            </div>
            <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))', userSelect: 'none' }}>🏆</span>
          </div>

          <div className="stat-box card-bg-cyan">
            <div>
              <span className="section-title neon-text-cyan" style={{ margin: 0 }}>Perfect Runs</span>
              <span className="stat-meta">100% accuracy sessions</span>
              <span className="stat-value neon-text-cyan">{perfectRuns}</span>
            </div>
            <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))', userSelect: 'none' }}>🎯</span>
          </div>

          <div className="stat-box card-bg-magenta">
            <div>
              <span className="section-title neon-text-magenta" style={{ margin: 0 }}>Total Keystrokes</span>
              <span className="stat-meta">Lifetime inputs recorded</span>
              <span className="stat-value neon-text-magenta">{totalKeystrokes}</span>
            </div>
            <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))', userSelect: 'none' }}>⌨️</span>
          </div>
        </div>
      )}

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

          <div className="chart-box">
            <h2 className="section-title neon-text-lime">
              <span style={{ marginRight: '0.5rem', userSelect: 'none' }}>🎯</span> Keystroke Distribution
            </h2>
            <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--accent)', backgroundColor: 'var(--bg)', color: 'var(--fg)' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-box">
            <h2 className="section-title neon-text-orange">
              <span style={{ marginRight: '0.5rem', userSelect: 'none' }}>📊</span> Words Typed per Run
            </h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={volumeData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dimmer)" />
                  <XAxis dataKey="name" stroke="var(--dim)" fontSize={11} />
                  <YAxis stroke="var(--dim)" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid var(--neon-orange)', 
                      backgroundColor: 'var(--bg)', 
                      color: 'var(--neon-orange)',
                      boxShadow: '0 4px 20px rgba(251, 146, 60, 0.15)'
                    }} 
                  />
                  <Bar dataKey="words" name="Words" fill="var(--neon-orange)" radius={[4, 4, 0, 0]} />
                </BarChart>
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
