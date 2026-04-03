import React, { useState } from 'react';
import { User, Mail, KeyRound, Lock, Cloud, Cpu, CheckCircle2, Save, Eye, EyeOff } from 'lucide-react';

const Settings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const systemStatus = [
    { icon: <Lock size={20} />, label: 'Encryption Status', status: 'Active', color: 'var(--color-primary)' },
    { icon: <Cloud size={20} />, label: 'Cloud Connection', status: 'Connected', color: 'var(--color-primary)' },
    { icon: <Cpu size={20} />, label: 'AI Detection System', status: 'Running', color: 'var(--color-primary)' },
  ];

  return (
    <div style={{ padding: '2.5rem', maxWidth: '720px' }}>
      {/* Page Header */}
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Settings</h1>
        <p className="text-dim">Manage your profile and monitor system status.</p>
      </header>

      {/* ──────────────── Operator Profile ──────────────── */}
      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          {/* Avatar Circle */}
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary-fixed), var(--color-primary-container))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 18px var(--color-primary-glow)',
          }}>
            <User size={22} color="#022100" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Operator Profile</h2>
            <p className="text-dim" style={{ fontSize: '0.8125rem', margin: 0 }}>Update your personal information</p>
          </div>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 1.5rem' }}>
          {/* Username */}
          <div className="input-group">
            <label>Codename / Username</label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)', opacity: 0.5 }} />
              <input
                type="text"
                className="input-control"
                defaultValue="Agent007"
                style={{ paddingLeft: '2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-outline-variant)', borderBottom: '1px solid var(--color-outline-variant)' }}
              />
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)', opacity: 0.5 }} />
              <input
                type="email"
                className="input-control"
                defaultValue="agent@secure.sys"
                style={{ paddingLeft: '2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-outline-variant)', borderBottom: '1px solid var(--color-outline-variant)' }}
              />
            </div>
          </div>

          {/* Password — full width  */}
          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label>Change Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)', opacity: 0.5 }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-control"
                placeholder="Enter new password"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-outline-variant)', borderBottom: '1px solid var(--color-outline-variant)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                  color: 'var(--color-text-dim)', opacity: 0.6, transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.6}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn"
            onClick={handleSave}
            style={{
              padding: '0.7rem 1.75rem', fontSize: '0.8125rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}
          >
            {saved ? (
              <><CheckCircle2 size={16} /> Saved Successfully</>
            ) : (
              <><Save size={16} /> Save Profile Changes</>
            )}
          </button>
        </div>
      </section>

      {/* ──────────────── System Status ──────────────── */}
      <section className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <div style={{ width: '28px', height: '3px', background: 'var(--color-primary)', borderRadius: '2px' }}></div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>System Status</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {systemStatus.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1.125rem 0',
                borderBottom: i !== systemStatus.length - 1 ? '1px solid var(--color-outline)' : 'none',
              }}
            >
              {/* Left — Icon + Label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface-container-lowest)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.color,
                }}>
                  {item.icon}
                </div>
                <span style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{item.label}</span>
              </div>

              {/* Right — Status Badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.3rem 0.875rem',
                background: 'var(--color-success-bg)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(57, 255, 20, 0.12)',
              }}>
                <div className="status-orb status-orb--active"></div>
                <span style={{
                  fontSize: '0.75rem', fontWeight: 600, color: item.color,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Settings;
