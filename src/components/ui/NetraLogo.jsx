import React from 'react';

/**
 * VaultEyeIcon - The Cyber Guardian Eye & Encrypted Vault Logo in NetraVault Violet & Hyperblue Theme
 */
export const NetraEyeIcon = ({ size = 28, className = '', glow = true, style = {} }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`vault-eye-icon ${glow ? 'vault-glow-filter' : ''} ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <defs>
        <linearGradient id="vaultShieldGrad" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="vaultEyeGrad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#7c3aed" stopOpacity="1" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id="vaultCoreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="1" />
          <stop offset="40%" stopColor="#7c3aed" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0a0515" stopOpacity="0" />
        </radialGradient>
        <filter id="vaultGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Cyber Vault Hexagonal Shield */}
      <polygon
        points="50,6 88,24 88,68 50,94 12,68 12,24"
        fill="#0a0515"
        stroke="url(#vaultShieldGrad)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Inner Vault Security Perimeter Grid */}
      <path
        d="M 50 13 L 81 27 L 81 65 L 50 87 L 19 65 L 19 27 Z"
        fill="none"
        stroke="rgba(192, 132, 252, 0.35)"
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />

      {/* Guardian Sentinel Eye Eyelid Contour */}
      <path
        d="M 22,50 Q 50,22 78,50 Q 50,78 22,50 Z"
        fill="rgba(124, 58, 237, 0.15)"
        stroke="url(#vaultEyeGrad)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Outer Iris Targeting Reticle */}
      <circle
        cx="50"
        cy="50"
        r="16"
        fill="none"
        stroke="#c084fc"
        strokeWidth="2"
        strokeDasharray="6 3"
      />

      {/* Inner Iris Core / Vault Keyhole Core */}
      <circle cx="50" cy="50" r="10" fill="url(#vaultCoreGlow)" />
      <circle cx="50" cy="50" r="6" fill="#0f0820" stroke="#a855f7" strokeWidth="2" />

      {/* Center Pupil Cryptographic Spark */}
      <circle cx="50" cy="50" r="2.5" fill="#c084fc" />

      {/* Laser Target Reticle Crosshairs in Hyperblue */}
      <line x1="50" y1="28" x2="50" y2="35" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="65" x2="50" y2="72" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="50" x2="35" y2="50" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
      <line x1="65" y1="50" x2="72" y2="50" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const NetraLogo = ({
  size = 32,
  showText = true,
  fontSize = '1.25rem',
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`vault-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        textDecoration: 'none',
        ...style,
      }}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 0 10px rgba(124, 58, 237, 0.45))',
        }}
      >
        <NetraEyeIcon size={size} />
      </div>

      {showText && (
        <span
          style={{
            fontSize: fontSize,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            fontFamily: 'var(--font-display, "Inter", sans-serif)',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          <span className="text-neon" style={{ color: '#c084fc' }}>
            Secure
          </span>
          <span style={{ color: '#ffffff' }}>Vault</span>
        </span>
      )}
    </div>
  );
};

export const VaultEyeIcon = NetraEyeIcon;
export const NetraVaultLogo = NetraLogo;

export default NetraLogo;
