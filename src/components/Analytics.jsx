import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Timer, Zap, Activity, Trophy, Hash, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

export default function Analytics({ liveStats, history, side }) {
  const wpmRef = useRef();
  const accRef = useRef();
  const peakRef = useRef();
  const avgRef = useRef();

  const wpm = liveStats?.wpm || 0;
  const accuracy = liveStats?.accuracy ?? 100;

  const totalTests = history ? history.length : 0;
  const historyHighest = totalTests > 0 ? Math.max(...history.map(h => h.wpm)) : 0;
  const highestWpm = Math.max(historyHighest, wpm); // Live dynamic peak

  const historySum = totalTests > 0 ? history.reduce((acc, curr) => acc + curr.wpm, 0) : 0;
  const averageWpm = Math.round((historySum + wpm) / (totalTests + (wpm > 0 ? 1 : 0))) || 0; // Live dynamic average

  useEffect(() => {
    // Current WPM Animation
    const wpmObj = { val: 0 };
    gsap.to(wpmObj, {
      val: wpm,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        if (wpmRef.current) wpmRef.current.innerHTML = Math.round(wpmObj.val);
      }
    });

    // Current Accuracy Animation
    const accObj = { val: 100 };
    gsap.to(accObj, {
      val: accuracy,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        if (accRef.current) accRef.current.innerHTML = Math.round(accObj.val) + '%';
      }
    });

    // Peak WPM Animation
    const peakObj = { val: 0 };
    gsap.to(peakObj, {
      val: highestWpm,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        if (peakRef.current) peakRef.current.innerHTML = Math.round(peakObj.val);
      }
    });

    // Avg WPM Animation
    const avgObj = { val: 0 };
    gsap.to(avgObj, {
      val: averageWpm,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        if (avgRef.current) avgRef.current.innerHTML = Math.round(avgObj.val);
      }
    });

  }, [wpm, accuracy, highestWpm, averageWpm]);

  return (
    <div className={`analytics-section ${side}-sidebar`}>
      <div className="stats-grid-column">
        {side === 'left' && (
          <>
            <div className="stat-box card-bg-cyan">
              <div>
                <span className="section-title neon-text-cyan" style={{margin:0}}>Current WPM</span>
                <span style={{display: 'block', fontSize: '0.8rem', color: 'var(--dim)', marginBottom: '0.5rem'}}>Live Speed</span>
                <span className="stat-value neon-text-cyan" ref={wpmRef}>0</span>
              </div>
              <Timer size={48} className="neon-icon-cyan" style={{ opacity: 0.6 }} />
            </div>
            <div className="stat-box card-bg-lime">
              <div>
                <span className="section-title neon-text-lime" style={{margin:0}}>Accuracy</span>
                <span style={{display: 'block', fontSize: '0.8rem', color: 'var(--dim)', marginBottom: '0.5rem'}}>Live Precision</span>
                <span className="stat-value neon-text-lime" ref={accRef}>100%</span>
              </div>
              <Zap size={48} className="neon-icon-lime" style={{ opacity: 0.6 }} />
            </div>


          </>
        )}

        {side === 'right' && (
          <>
            <div className="stat-box card-bg-orange">
              <div>
                <span className="section-title neon-text-orange" style={{margin:0}}>Peak WPM</span>
                <span style={{display: 'block', fontSize: '0.8rem', color: 'var(--dim)', marginBottom: '0.5rem'}}>All-Time High</span>
                <span className="stat-value neon-text-orange" ref={peakRef}>0</span>
              </div>
              <Trophy size={48} className="neon-icon-orange" style={{ opacity: 0.6 }} />
            </div>
            <div className="stat-box card-bg-purple">
              <div>
                <span className="section-title neon-text-purple" style={{margin:0}}>Avg WPM</span>
                <span style={{display: 'block', fontSize: '0.8rem', color: 'var(--dim)', marginBottom: '0.5rem'}}>Lifetime Average</span>
                <span className="stat-value neon-text-purple" ref={avgRef}>0</span>
              </div>
              <Activity size={48} className="neon-icon-purple" style={{ opacity: 0.6 }} />
            </div>
            

          </>
        )}

        {side === 'bottom' && history && history.length > 0 && (
          <div className="stats-grid-row" style={{ marginTop: '2rem', justifyContent: 'center', flexWrap: 'nowrap' }}>
            <div className="chart-box" style={{ flex: 'none', width: '400px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="section-title neon-text-cyan" style={{margin: 0}}><Activity size={20} className="neon-icon-cyan" style={{marginRight:'0.5rem'}}/> WPM Trend</h2>
              </div>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dimmer)" />
                    <XAxis dataKey="name" stroke="var(--dim)" fontSize={10} />
                    <YAxis stroke="var(--dim)" fontSize={10} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--neon-cyan)', backgroundColor: 'var(--bg)', color: 'var(--neon-cyan)' }} />
                    <Line type="natural" dataKey="wpm" name="WPM" stroke="var(--fg)" strokeWidth={2} activeDot={{ r: 8, fill: 'var(--fg)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-box" style={{ flex: 'none', width: '400px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="section-title neon-text-lime" style={{margin: 0}}><Zap size={20} className="neon-icon-lime" style={{marginRight:'0.5rem'}}/> Accuracy (%)</h2>
              </div>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dimmer)" />
                    <XAxis dataKey="name" stroke="var(--dim)" fontSize={10} />
                    <YAxis stroke="var(--dim)" fontSize={10} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--neon-lime)', backgroundColor: 'var(--bg)', color: 'var(--neon-lime)' }} />
                    <Area type="natural" dataKey="accuracy" name="Accuracy" stroke="var(--fg)" strokeWidth={2} fillOpacity={0.2} fill="var(--fg)" />
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
