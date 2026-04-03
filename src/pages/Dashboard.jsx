import React from 'react';
import { Lock, Image as ImageIcon, ShieldAlert, Activity, ArrowUpRight, Cloud, Zap } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Encrypted Messages', value: '1,248', icon: <Lock size={22} color="var(--color-primary)" />, trend: '+12% this week', trendColor: 'var(--color-primary)' },
    { title: 'Secured Images', value: '342', icon: <ImageIcon size={22} color="var(--color-secondary)" />, trend: '+5% this week', trendColor: 'var(--color-primary)' },
    { title: 'AI Scans Run', value: '89', icon: <ShieldAlert size={22} color="var(--color-danger)" />, trend: '2 threats detected', trendColor: 'var(--color-danger)' },
  ];

  const activities = [
    { action: 'Steganography payload generated', target: 'confidential_q3.png', time: '2 hours ago', status: 'Success' },
    { action: 'Message encrypted via KMS', target: 'Project Alpha Details', time: '5 hours ago', status: 'Success' },
    { action: 'AI Scan detected anomaly', target: 'suspicious_file.jpg', time: '1 day ago', status: 'Flagged' },
    { action: 'New vault access authorized', target: 'Agent Smith', time: '2 days ago', status: 'Success' },
  ];

  const systemMetrics = [
    { label: 'Latency Benchmark', value: '0.02ms', desc: 'Average handshake response time across global nodes.' },
    { label: 'Encryption Depth', value: '4096-bit', desc: 'Maximum RSA key support for hybrid cryptographic architectures.' },
    { label: 'Compliance', value: 'SOC2-H', desc: 'Hardened certification for high-risk data environments.' },
  ];

  return (
    <div style={{ padding: '2.5rem' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome back, Agent</h1>
          <p className="text-dim">Here is the status of your secure vault.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--color-success-bg)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(57,255,20,0.15)' }}>
          <div className="status-orb status-orb--active"></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>System: Secure</span>
        </div>
      </header>

      {/* Stats Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem 1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{stat.title}</p>
                <h3 style={{ fontSize: '2rem', margin: 0, fontFamily: 'var(--font-display)' }}>{stat.value}</h3>
              </div>
              <div style={{ background: 'var(--color-surface-container-lowest)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                {stat.icon}
              </div>
            </div>
            <p style={{ fontSize: '0.8125rem', color: stat.trendColor, margin: 0, fontWeight: 500 }}>
              {stat.trend}
            </p>
          </div>
        ))}
      </section>

      {/* Activity Timeline */}
      <section className="card" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <Activity color="var(--color-primary)" size={20} />
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Recent Vault Activity</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {activities.map((act, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '1.5rem',
              padding: '1.25rem 0',
              borderBottom: i !== activities.length - 1 ? '1px solid var(--color-outline)' : 'none',
            }}>
              <div className={`status-orb ${act.status === 'Flagged' ? 'status-orb--danger' : 'status-orb--active'}`} style={{ marginTop: '6px' }}></div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 0.25rem 0', fontWeight: 500, fontSize: '0.9375rem' }}>{act.action}</p>
                <p className="text-dim" style={{ fontSize: '0.8125rem', margin: 0 }}>
                  Target: <span style={{ color: 'var(--color-text)', fontFamily: 'monospace', fontSize: '0.8125rem' }}>{act.target}</span>
                </p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p className="text-dim" style={{ fontSize: '0.8125rem', margin: '0 0 0.25rem 0' }}>{act.time}</p>
                <span style={{
                  fontSize: '0.6875rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)',
                  fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
                  background: act.status === 'Flagged' ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
                  color: act.status === 'Flagged' ? 'var(--color-danger)' : 'var(--color-primary)',
                }}>
                  {act.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* System Authenticity Logs */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '28px', height: '3px', background: 'var(--color-primary)', borderRadius: '2px' }}></div>
          <h2 style={{ fontSize: '1rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>System Authenticity Logs</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {systemMetrics.map((m, i) => (
            <div key={i} style={{ padding: '1.25rem 0' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{m.label}</p>
              <p style={{ fontFamily: 'monospace', fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>{m.value}</p>
              <p style={{ color: 'var(--color-text-dim)', fontSize: '0.8125rem', margin: 0, lineHeight: 1.5 }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
