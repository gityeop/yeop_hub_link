import React, { useState } from 'react';
import '../../styles/global.css';
import bgImage from '../../assets/bg-gemini-4.png';

const Desktop = ({ children }) => {
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
        
        {children}
    </div>
  );
};

export default Desktop;
