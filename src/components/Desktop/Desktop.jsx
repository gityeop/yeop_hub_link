import React, { useEffect, useRef, useState } from 'react';
import '../../styles/global.css';
import bgImage from '../../assets/bg-gemini-4.png';
import DesktopWidgets from './DesktopWidgets';
import doomIcon from '../../assets/icons/doom.svg';

const Desktop = ({ children, onLaunchDoom }) => {
  const [isDoomSelected, setIsDoomSelected] = useState(false);
  const [isDoomLaunching, setIsDoomLaunching] = useState(false);
  const doomIconRef = useRef(null);
  const launchTimerRef = useRef(null);
  const launchResetTimerRef = useRef(null);

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

  const launchDoomWithInteraction = () => {
    if (isDoomLaunching) return;

    setIsDoomSelected(true);
    setIsDoomLaunching(true);
    clearLaunchTimers();

    launchTimerRef.current = window.setTimeout(() => {
      onLaunchDoom?.();
    }, 170);

    launchResetTimerRef.current = window.setTimeout(() => {
      setIsDoomLaunching(false);
    }, 430);
  };

  useEffect(() => {
    const handleOutsidePointerDown = (event) => {
      if (!doomIconRef.current) return;
      if (!doomIconRef.current.contains(event.target)) {
        setIsDoomSelected(false);
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

        <DesktopWidgets onLaunchDoom={onLaunchDoom} />

        <style>{`
          @keyframes doom-icon-launch {
            0% { transform: scale(1); filter: brightness(1); }
            35% { transform: scale(0.92); filter: brightness(1.06); }
            70% { transform: scale(1.08); filter: brightness(1.14); }
            100% { transform: scale(1); filter: brightness(1); }
          }
        `}</style>

        <div
            ref={doomIconRef}
            data-no-drag
            role="button"
            tabIndex={0}
            aria-label="Launch DOOM"
            onClick={() => setIsDoomSelected(true)}
            onDoubleClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              launchDoomWithInteraction();
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                launchDoomWithInteraction();
              }
            }}
            title="Double-click to run DOOM"
            style={{
              position: 'fixed',
              top: '48%',
              left: '36%',
              transform: `translate(-50%, -50%) ${isDoomLaunching ? 'scale(0.98)' : 'scale(1)'}`,
              width: '92px',
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
              src={doomIcon}
              alt="DOOM"
              style={{
                width: '58px',
                height: '58px',
                borderRadius: '14px',
                boxShadow: isDoomSelected
                  ? '0 0 0 2px rgba(147, 197, 253, 0.92), 0 10px 24px rgba(0, 0, 0, 0.36)'
                  : '0 8px 18px rgba(0, 0, 0, 0.28)',
                animation: isDoomLaunching ? 'doom-icon-launch 0.42s cubic-bezier(0.22, 0.61, 0.36, 1)' : 'none'
              }}
            />
            <div
              style={{
                maxWidth: '100%',
                padding: '2px 8px',
                borderRadius: '8px',
                background: isDoomSelected ? 'rgba(59, 130, 246, 0.38)' : 'rgba(0, 0, 0, 0.22)',
                color: '#F8FAFC',
                fontSize: '12px',
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: 1.2,
                border: isDoomSelected ? '1px solid rgba(191, 219, 254, 0.7)' : '1px solid transparent',
                transition: 'background-color 0.16s ease, border-color 0.16s ease'
              }}
            >
              DOOM
            </div>
        </div>
        
        {children}
    </div>
  );
};

export default Desktop;
