import React, { useRef } from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

const Window = ({ id, isOpen, onClose, title, children, initialPosition = { x: 100, y: 100 }, ...props }) => {
  const constraintsRef = useRef(null);
  const dragControls = useDragControls();
  const hasTitleBar = !props.hideTitleBar;
  const windowRef = useRef(null);

  const handleTopDragPointerDown = (e) => {
    if (hasTitleBar) return;
    if (!windowRef.current) return;
    if (e.target.closest('[data-no-drag]')) return;
    const rect = windowRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    if (y <= 48) {
      dragControls.start(e);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
           ref={windowRef}
           drag
           dragControls={dragControls}
           dragListener={false}
           dragMomentum={false}
           initial={{ opacity: 0, scale: 0.9, x: initialPosition.x, y: initialPosition.y }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.9 }}
           transition={{ type: "spring", stiffness: 300, damping: 30 }}
           onPointerDownCapture={handleTopDragPointerDown}
           style={{
              position: 'absolute',
              width: props.width || '600px',
              height: props.height || '400px',
              backgroundColor: 'var(--window-bg)',
              backdropFilter: 'blur(30px)',
              borderRadius: '12px',
              boxShadow: 'var(--window-shadow)',
              border: '1px solid var(--window-border)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              cursor: 'default' // Reset cursor for content
           }}
        >
            {/* Window Header / Title Bar - Drag Handle */}
            {hasTitleBar && (
            <div 
              style={{
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                cursor: 'grab', // Cursor to indicate draggable
              }}
              onPointerDown={(e) => {
                  dragControls.start(e);
              }}
            >
              <div className="window-controls" style={{ display: 'flex', gap: '8px' }} onPointerDown={(e) => e.stopPropagation()}>
                <div onClick={onClose} style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F56', border: '0.5px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                </div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E', border: '0.5px solid rgba(0,0,0,0.1)' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27C93F', border: '0.5px solid rgba(0,0,0,0.1)' }}></div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#444', pointerEvents: 'none' }}>
                {title}
              </div>
              <div style={{ width: '52px' }}></div>
            </div>
            )}

            {/* Window Content - Prevent Dragging Here */}
            <div 
                className="window-content" 
                style={{ flex: 1, overflow: 'auto', padding: '0', cursor: 'auto' }}
                onPointerDown={(e) => e.stopPropagation()} 
            >
              {children}
            </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Window;
