import React, { useState, useEffect } from 'react';

/**
 * Universal UserAvatar component for CVnest
 * Renders user profile picture if valid, or a polished default user avatar silhouette
 * with graceful error fallback (no broken image icons).
 */
export function UserAvatar({
  user,
  size = 'sm',
  variant = 'navbar', // 'navbar' | 'sidebar' | 'teal'
  showStatus = false,
  className = '',
  title = '',
}) {
  const [imgError, setImgError] = useState(false);

  // Extract clean picture URL (ignoring legacy dicebear cartoon placeholders)
  const pictureUrl = user?.picture && !user.picture.includes('dicebear.com') ? user.picture : null;

  // Reset error state if user or picture changes
  useEffect(() => {
    setImgError(false);
  }, [pictureUrl]);

  // Size mapping
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  }[size] || size;

  const statusSize = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-2.5 h-2.5',
    xl: 'w-3 h-3',
  }[size] || 'w-2 h-2';

  // Variant themes for the default avatar background & silhouette
  const variantStyles = {
    sidebar: {
      container: 'bg-gradient-to-b from-teal-800/90 to-teal-950 border border-teal-600/40 text-teal-200/90 shadow-inner',
      svgColor: 'text-teal-200/80',
      ring: 'ring-teal-950',
      statusRing: 'ring-teal-950',
    },
    navbar: {
      container: 'bg-gradient-to-b from-slate-100 to-slate-200/90 border border-slate-300/80 text-slate-500 shadow-2xs',
      svgColor: 'text-slate-400',
      ring: 'ring-white',
      statusRing: 'ring-white',
    },
    teal: {
      container: 'bg-gradient-to-tr from-teal-500 to-emerald-600 border border-teal-400/50 text-white shadow-xs',
      svgColor: 'text-white/90',
      ring: 'ring-white',
      statusRing: 'ring-white',
    },
  }[variant] || {
    container: 'bg-slate-100 border border-slate-200 text-slate-400',
    svgColor: 'text-slate-400',
    ring: 'ring-white',
    statusRing: 'ring-white',
  };

  const displayName = user?.name || user?.email?.split('@')?.[0] || 'User';
  const hasValidPicture = !!pictureUrl && !imgError;

  return (
    <div
      className={`relative inline-flex shrink-0 ${sizeClasses} ${className}`}
      title={title || displayName}
    >
      <div
        className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden shrink-0 transition-all select-none ${
          hasValidPicture
            ? 'border border-slate-200/80 bg-slate-100'
            : variantStyles.container
        }`}
      >
        {hasValidPicture ? (
          <img
            src={pictureUrl}
            alt={displayName}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover rounded-full"
            loading="lazy"
          />
        ) : (
          /* Sleek Default User Avatar Silhouette (Tailwind/Heroicons Pro standard) */
          <svg
            className={`w-full h-full translate-y-[12%] scale-110 ${variantStyles.svgColor}`}
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </div>

      {/* Online / Active status indicator if requested */}
      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 ${statusSize} rounded-full bg-emerald-400 ring-2 ${variantStyles.statusRing}`}
        />
      )}
    </div>
  );
}

export default UserAvatar;

