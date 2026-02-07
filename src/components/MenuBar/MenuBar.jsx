import React, { useState, useEffect } from 'react';
import { Apple } from 'lucide-react';

const MenuBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    // Format: "Tue Jan 9   9:41 AM"
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateStr = date.toLocaleDateString('en-US', options).replace(',', '');
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `${dateStr}   ${timeStr}`;
  };

  return (
    <div className="menu-bar liquid-glass" style={{
      height: '30px',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      fontSize: '13px',
      fontWeight: '500',
      color: 'rgba(0,0,0,0.8)', // Dark text for light mode glass
      position: 'absolute',
      top: 0,
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.3)', // Slightly more opaque than default glass
      borderBottom: '1px solid rgba(255,255,255,0.4)'
    }}>
      <div className="left-menu" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="menu-item" style={{display: 'flex', alignItems: 'center'}}>
            <Apple size={16} fill="rgba(0,0,0,0.8)" />
        </div>
        <div className="menu-item" style={{ fontWeight: '700' }}>Finder</div>
        <div className="menu-item">File</div>
        <div className="menu-item">Edit</div>
        <div className="menu-item">View</div>
        <div className="menu-item">Go</div>
        <div className="menu-item">Window</div>
        <div className="menu-item">Help</div>
      </div>

      <div className="right-menu" style={{ display: 'flex', gap: '15px' }}>
        <div className="menu-item">KOR</div>
        <div className="menu-item">{formatDate(time)}</div>
      </div>
    </div>
  );
};

export default MenuBar;
