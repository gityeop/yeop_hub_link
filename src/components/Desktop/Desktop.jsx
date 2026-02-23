import React from 'react';
import '../../styles/global.css';
import bgImage from '../../assets/bg-gemini-4.png';
import DesktopWidgets from './DesktopWidgets';
import doomIcon from '../../assets/icons/doom.svg';

const Desktop = ({ children, onLaunchDoom }) => {
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

        <div
            data-no-drag
            role="button"
            tabIndex={0}
            onDoubleClick={() => onLaunchDoom?.()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onLaunchDoom?.();
              }
            }}
            title="Double-click to run DOOM"
            style={{
              position: 'absolute',
              top: '18px',
              left: '22px',
              width: '92px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              zIndex: 20,
              cursor: 'default',
              userSelect: 'none'
            }}
        >
            <img
              src={doomIcon}
              alt="DOOM"
              style={{
                width: '58px',
                height: '58px',
                borderRadius: '14px',
                boxShadow: '0 8px 18px rgba(0, 0, 0, 0.28)'
              }}
            />
            <div
              style={{
                maxWidth: '100%',
                padding: '2px 8px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.22)',
                color: '#F8FAFC',
                fontSize: '12px',
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: 1.2
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
