import React from 'react';

/**
 * CVnest Icon SVG
 * A modern, iconic brand mark featuring:
 * - A supportive curved Nest cradle (C)
 * - An aerodynamic CV document / soaring career page (V)
 * - A North Star sparkle symbolizing career elevation
 */
export function CVnestIcon({ className = "w-6 h-6", glow = false }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${glow ? 'drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]' : ''}`}
    >
      {/* Gradients */}
      <defs>
        {/* Nest Cradle Gradient */}
        <linearGradient id="cvnest-nest-grad" x1="4" y1="22" x2="32" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="50%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>

        {/* Soaring Document Gradient */}
        <linearGradient id="cvnest-doc-grad" x1="12" y1="6" x2="26" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        {/* Accent Sparkle Gradient */}
        <linearGradient id="cvnest-sparkle-grad" x1="24" y1="3" x2="31" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>

      {/* --- 1. NEST CRADLE (Protective woven arcs) --- */}
      {/* Outer base nest arc */}
      <path
        d="M 6 22.5 C 9.5 28 24.5 28 28 22.5"
        stroke="url(#cvnest-nest-grad)"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      {/* Inner weave arc */}
      <path
        d="M 10 25.5 C 13 28.5 21 28.5 24 25.5"
        stroke="url(#cvnest-nest-grad)"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* --- 2. CV DOCUMENT / SOARING CAREER FOLD --- */}
      {/* Main Resume Sheet */}
      <path
        d="M 12 7.5 C 12 6.67 12.67 6 13.5 6 H 20.5 L 25 10.5 V 18 C 25 18.83 24.33 19.5 23.5 19.5 H 13.5 C 12.67 19.5 12 18.83 12 18 V 7.5 Z"
        fill="url(#cvnest-doc-grad)"
        stroke="#0F3546"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      {/* Folded Top Corner */}
      <path
        d="M 20.5 6 V 10.5 H 25"
        fill="#CBD5E1"
        stroke="#0F3546"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      {/* ATS Resume Content Lines */}
      <line x1="14.5" y1="11" x2="18" y2="11" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14.5" y1="13.8" x2="22" y2="13.8" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14.5" y1="16.6" x2="20" y2="16.6" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" />

      {/* --- 3. CAREER NORTH STAR / SPARKLE --- */}
      <path
        d="M 27 3.5 L 27.8 5.4 L 29.7 6.2 L 27.8 7 L 27 8.9 L 26.2 7 L 24.3 6.2 L 26.2 5.4 Z"
        fill="url(#cvnest-sparkle-grad)"
      />
    </svg>
  );
}

/**
 * CVnest Logo Component
 * Combines the brand icon badge with the distinctive "CVnest" typography.
 * 
 * Props:
 * - size: 'sm' | 'md' | 'lg' | 'xl'
 * - theme: 'light' (for light backgrounds like landing page) | 'dark' (for dark sidebar / mobile bar)
 * - showText: boolean (whether to render "CVnest" wordmark)
 * - badgeStyle: 'overview' | 'luminous' | 'flat'
 * - badgeClassName: extra class names for the icon wrapper
 * - textClassName: extra class names for text
 */
export function CVnestLogo({
  size = 'md',
  theme = 'light',
  showText = true,
  badgeStyle = 'overview',
  badgeClassName = '',
  textClassName = '',
  onClick
}) {
  // Dimension definitions
  const sizeMap = {
    sm: {
      badge: 'w-7 h-7 rounded-lg',
      icon: 'w-4.5 h-4.5',
      text: 'text-lg',
      subtext: 'text-[9px]'
    },
    md: {
      badge: 'w-9 h-9 rounded-xl',
      icon: 'w-6 h-6',
      text: 'text-2xl',
      subtext: 'text-[10px]'
    },
    lg: {
      badge: 'w-11 h-11 rounded-2xl',
      icon: 'w-7 h-7',
      text: 'text-3xl',
      subtext: 'text-xs'
    },
    xl: {
      badge: 'w-14 h-14 rounded-2xl',
      icon: 'w-9 h-9',
      text: 'text-4xl',
      subtext: 'text-xs'
    }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Badge gradient based on theme & style
  const badgeGradient =
    badgeStyle === 'luminous'
      ? 'bg-gradient-to-tr from-teal-500 via-teal-400 to-cyan-400 border border-teal-300/60 shadow-md shadow-teal-900/30'
      : theme === 'dark'
      ? 'bg-gradient-to-tr from-[#164e63] via-[#0f766e] to-[#0d9488] border border-teal-400/40 shadow-md shadow-teal-950/40'
      : 'bg-gradient-to-tr from-[#0d2a3a] via-[#103d4c] to-[#0f606e] border border-teal-700/30 shadow-md shadow-slate-900/10';

  // Wordmark colors
  const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const nestColor = theme === 'dark' ? 'text-teal-400' : 'text-teal-600';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Icon Badge */}
      <div
        className={`${currentSize.badge} ${badgeGradient} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${badgeClassName}`}
      >
        <CVnestIcon className={currentSize.icon} glow={theme === 'dark'} />
      </div>

      {/* Typography: CVnest */}
      {showText && (
        <span
          className={`font-black tracking-tight ${currentSize.text} ${textColor} leading-none ${textClassName}`}
        >
          CV<span className={`${nestColor} font-black`}>nest</span>
        </span>
      )}
    </div>
  );
}

export default CVnestLogo;

