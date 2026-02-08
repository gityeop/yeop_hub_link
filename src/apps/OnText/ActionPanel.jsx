import React, { useLayoutEffect, useRef, useState } from 'react';
import { 
    Search, Bot, Sparkles, Globe2, Code, Terminal, Link2
} from 'lucide-react';
import { motion } from 'framer-motion';

const ActionButton = ({ icon: Icon, label, shortcut, onClick }) => {
    const [isActive, setIsActive] = useState(false);

    const handleClick = () => {
        onClick(label);
        setTimeout(() => setIsActive(false), 120);
    };

    return (
        <button
            onClick={handleClick}
            onPointerDown={() => setIsActive(true)}
            onPointerUp={() => setIsActive(false)}
            onPointerLeave={() => setIsActive(false)}
            onPointerCancel={() => setIsActive(false)}
            className="ontext-action-button"
            style={{
                background: isActive ? 'rgba(255,255,255,0.55)' : 'transparent',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '7px',
                cursor: 'pointer',
                color: '#2E2E2E',
                position: 'relative',
                transition: 'background-color 120ms ease',
                outline: 'none'
            }}
        >
            {shortcut && (
                 <span style={{ 
                     position: 'absolute', 
                     top: '-3px', 
                     left: '-2px', 
                     fontSize: '7px', 
                     fontWeight: '600', 
                     color: '#666',
                     opacity: 0.75
                 }}>
                     {shortcut}
                 </span>
            )}
            <Icon size={16} strokeWidth={2.25} />
        </button>
    );
};

const ActionPanel = ({ anchor, containerRect, onAction }) => {
    const panelRef = useRef(null);
    const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0, opacity: 0 });
    const actions = [
        [
            { icon: Sparkles, label: 'Inline AI (BYOK)', shortcut: 'q' },
            { icon: Search, label: 'URL Action Search', shortcut: 'w' },
            { icon: Bot, label: 'Prompt Relay', shortcut: 'e' },
            { icon: Globe2, label: 'Bi-directional Translate', shortcut: 'r' },
            { icon: Code, label: 'Case Converting', shortcut: 't' },
        ],
        [
            { icon: Terminal, label: 'Shell/AppleScript Workflow', shortcut: 'a' },
            { icon: Link2, label: 'Shortcut Action', shortcut: 's' },
        ],
    ];

    useLayoutEffect(() => {
        if (!panelRef.current || !containerRect || !anchor) return;

        const panelRect = panelRef.current.getBoundingClientRect();
        const margin = 12;
        const offset = 12;

        const anchorX = anchor.x - containerRect.left;
        const anchorY = anchor.y - containerRect.top;

        let left = anchorX - (panelRect.width / 2);
        left = Math.min(
            Math.max(left, margin),
            containerRect.width - panelRect.width - margin
        );

        let top = anchorY - panelRect.height - offset;
        if (top < margin) {
            top = anchorY + offset;
        }

        top = Math.min(
            Math.max(top, margin),
            containerRect.height - panelRect.height - margin
        );

        setPanelPosition({ top, left, opacity: 1 });
    }, [anchor, containerRect]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
                position: 'absolute',
                top: `${panelPosition.top}px`,
                left: `${panelPosition.left}px`,
                opacity: panelPosition.opacity,
                backgroundColor: '#D9D9D9',
                borderRadius: '12px',
                padding: '9px',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.18)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                display: 'flex',
                gap: '8px',
                zIndex: 1000,
                flexDirection: 'column',
                willChange: 'transform, opacity',
                transform: 'translateZ(0)'
            }}
            onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            ref={panelRef}
        >
            <style>{`
                .ontext-action-button:hover {
                    background: rgba(255, 255, 255, 0.4);
                }
                .ontext-action-button:active {
                    background: rgba(255, 255, 255, 0.55);
                }
            `}</style>
            {actions.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex', gap: '9px' }}>
                    {row.map((action, colIndex) => (
                         <ActionButton 
                            key={colIndex} 
                            {...action} 
                            onClick={onAction} 
                        />
                    ))}
                </div>
            ))}
        </motion.div>
    );
};

export default ActionPanel;
