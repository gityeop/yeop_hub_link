import React, { useEffect, useRef, useState } from 'react';
import '../../styles/global.css';
import bgImage from '../../assets/bg-gemini-4.webp';
import DesktopWidgets from './DesktopWidgets';
import doomIcon from '../../assets/icons/doom-custom.png';
import youtubeIcon from '../../assets/icons/youtube-custom.png';
import rejectionMailIcon from '../../assets/icons/rejection-mail.svg';

const DesktopShortcut = ({ shortcut, isSelected, isLaunching, onSelect, onLaunch, iconRef }) => {
  return (
    <div
      ref={iconRef}
      data-no-drag
      role="button"
      tabIndex={0}
      aria-label={shortcut.ariaLabel}
      onClick={() => onSelect(shortcut.id)}
      onDoubleClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onLaunch(shortcut);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onLaunch(shortcut);
        }
      }}
      title={shortcut.title}
      style={{
        position: 'fixed',
        top: shortcut.top,
        left: shortcut.left,
        transform: `translate(-50%, -50%) ${isLaunching ? 'scale(0.98)' : 'scale(1)'}`,
        width: shortcut.width || '92px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        zIndex: 20,
        cursor: 'default',
        userSelect: 'none',
        transition: 'transform 0.2s ease'
      }}
    >
      <img
        src={shortcut.icon}
        alt={shortcut.label}
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '14px',
          boxShadow: isSelected
            ? '0 0 0 2px rgba(147, 197, 253, 0.92), 0 10px 24px rgba(0, 0, 0, 0.36)'
            : '0 8px 18px rgba(0, 0, 0, 0.28)',
          animation: isLaunching ? 'desktop-icon-launch 0.42s cubic-bezier(0.22, 0.61, 0.36, 1)' : 'none'
        }}
      />
      <div
        style={{
          maxWidth: '100%',
          padding: '2px 8px',
          borderRadius: '8px',
          background: isSelected ? 'rgba(59, 130, 246, 0.38)' : 'rgba(0, 0, 0, 0.22)',
          color: '#F8FAFC',
          fontSize: shortcut.fontSize || '12px',
          fontWeight: 600,
          textAlign: 'center',
          lineHeight: 1.2,
          wordBreak: 'keep-all',
          border: isSelected ? '1px solid rgba(191, 219, 254, 0.7)' : '1px solid transparent',
          transition: 'background-color 0.16s ease, border-color 0.16s ease'
        }}
      >
        {shortcut.label}
      </div>
    </div>
  );
};

const Desktop = ({ children, onOpenApp }) => {
  const [selectedShortcutId, setSelectedShortcutId] = useState(null);
  const [launchingShortcutId, setLaunchingShortcutId] = useState(null);
  const shortcutRefs = useRef({});
  const launchTimerRef = useRef(null);
  const launchResetTimerRef = useRef(null);
  const youtubeUrl = 'https://www.youtube.com/watch?v=_EW9jk07vbc';

  const clearLaunchTimers = () => {
    if (launchTimerRef.current) {
      window.clearTimeout(launchTimerRef.current);
      launchTimerRef.current = null;
    }
    if (launchResetTimerRef.current) {
      window.clearTimeout(launchResetTimerRef.current);
      launchResetTimerRef.current = null;
    }
  };

  const shortcuts = [
    {
      id: 'doom',
      label: 'DOOM',
      icon: doomIcon,
      ariaLabel: 'Launch DOOM',
      title: 'Double-click to run DOOM',
      top: '48%',
      left: '36%',
      launch: () => onOpenApp?.('doom')
    },
    {
      id: 'youtube',
      label: 'YouTube',
      icon: youtubeIcon,
      ariaLabel: 'Open YouTube video',
      title: 'Double-click to open YouTube',
      top: '48%',
      left: '44%',
      launch: () => window.open(youtubeUrl, '_blank', 'noopener,noreferrer')
    },
    {
      id: 'rejectedMail',
      label: '채용불합격 이메일 해석기',
      icon: rejectionMailIcon,
      ariaLabel: 'Open 채용불합격 이메일 해석기',
      title: 'Double-click to open 채용불합격 이메일 해석기',
      top: '48%',
      left: '52%',
      width: '118px',
      fontSize: '11px',
      launch: () => onOpenApp?.('rejectedMail')
    }
  ];

  const launchShortcut = (shortcut) => {
    if (launchingShortcutId === shortcut.id) return;

    setSelectedShortcutId(shortcut.id);
    setLaunchingShortcutId(shortcut.id);
    clearLaunchTimers();

    launchTimerRef.current = window.setTimeout(() => {
      shortcut.launch?.();
    }, 170);

    launchResetTimerRef.current = window.setTimeout(() => {
      setLaunchingShortcutId(null);
    }, 430);
  };

  useEffect(() => {
    const handleOutsidePointerDown = (event) => {
      const clickedShortcut = Object.values(shortcutRefs.current).some((node) => node?.contains(event.target));
      if (!clickedShortcut) {
        setSelectedShortcutId(null);
      }
    };

    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown);
      clearLaunchTimers();
    };
  }, []);

  return (
    <div 
      className="desktop-container"
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }}
    >
        {/* Background Overlay for depth if needed */}
        {/* Radial Blur Overlay */}
        <div style={{
            position: 'absolute',
            top: 0, 
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            maskImage: 'radial-gradient(circle, transparent 0%, black 100%)',
            WebkitMaskImage: 'radial-gradient(circle, transparent 0%, black 100%)',
            pointerEvents: 'none',
            zIndex: 0
        }} />

        <DesktopWidgets />

        <style>{`
          @keyframes desktop-icon-launch {
            0% { transform: scale(1); filter: brightness(1); }
            35% { transform: scale(0.93); filter: brightness(1.04); }
            70% { transform: scale(1.08); filter: brightness(1.1); }
            100% { transform: scale(1); filter: brightness(1); }
          }
        `}</style>

        {shortcuts.map((shortcut) => (
          <DesktopShortcut
            key={shortcut.id}
            shortcut={shortcut}
            isSelected={selectedShortcutId === shortcut.id}
            isLaunching={launchingShortcutId === shortcut.id}
            onSelect={setSelectedShortcutId}
            onLaunch={launchShortcut}
            iconRef={(node) => {
              shortcutRefs.current[shortcut.id] = node;
            }}
          />
        ))}
        
        {children}
    </div>
  );
};

export default Desktop;
