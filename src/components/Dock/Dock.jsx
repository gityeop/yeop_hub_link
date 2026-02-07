import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import images
import msgIcon from '../../assets/icons/messages.png';
import instaIcon from '../../assets/icons/instagram.png';
import threadIcon from '../../assets/icons/threads.png';
import mailIcon from '../../assets/icons/mail.png';
import ontextIcon from '../../assets/ontext-icon.png';
import flowclipIcon from '../../assets/flowclip-icon.png';

const DockItem = ({ icon, label, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
        <AnimatePresence>
            {isHovered && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                    exit={{ opacity: 0, y: 5, scale: 0.9, x: "-50%" }}
                    transition={{ duration: 0.2 }}
                    style={{
                        position: 'absolute',
                        top: '-65px', // Position above the icon
                        left: '50%',
                        backgroundColor: 'rgba(240, 240, 240, 0.95)', // Light gray background
                        color: 'black',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        zIndex: 100
                    }}
                >
                    {label}
                    {/* Triangle Arrow */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-6px',
                        left: '50%',
                        marginLeft: '-6px',
                        width: '0',
                        height: '0',
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid rgba(240, 240, 240, 0.95)',
                    }} />
                </motion.div>
            )}
        </AnimatePresence>

        <motion.div 
          className="dock-item"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.2, translateY: -15 }}
          style={{
            width: '55px', // Slightly larger for real icons
            height: '55px',
            borderRadius: '14px', // Standard iOS/macOS icon radius
            cursor: 'pointer',
            margin: '0 6px',
            position: 'relative'
          }}
          onClick={onClick}
        >
          <img src={icon} alt={label} style={{ width: '100%', height: '100%', borderRadius: '14px', objectFit: 'cover' }} />
        </motion.div>
    </div>
  );
};

const Dock = ({ onAppClick }) => {
  return (
    <div className="dock-container" style={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'flex-end',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      zIndex: 9000
    }}>
      <DockItem icon={msgIcon} label="Messages" onClick={() => onAppClick('messages')} />
      <DockItem icon={instaIcon} label="Instagram" onClick={() => onAppClick('instagram')} />
      <DockItem icon={threadIcon} label="Threads" onClick={() => onAppClick('threads')} />
      <DockItem icon={mailIcon} label="Mail" onClick={() => onAppClick('mail')} />
      <DockItem icon={ontextIcon} label="OnText" onClick={() => onAppClick('ontext')} />
      <DockItem icon={flowclipIcon} label="FlowClip" onClick={() => onAppClick('flowclip')} />
    </div>
  );
};


export default Dock;
