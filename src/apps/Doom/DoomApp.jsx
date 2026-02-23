import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, RotateCcw } from 'lucide-react';

const DOOM_LOCAL_PATH = `${import.meta.env.BASE_URL}doom/index.html`;
const CONTROL_HINTS = [
  { key: 'W / A / S / D', action: 'Move' },
  { key: 'Arrow Keys', action: 'Move' },
  { key: 'Ctrl', action: 'Fire' },
  { key: 'Command / J', action: 'Fire (Mac fallback)' },
  { key: 'Space', action: 'Use / Open' },
  { key: 'Shift', action: 'Run' },
  { key: '1 - 7', action: 'Switch weapon' },
  { key: 'Esc', action: 'Menu' }
];

const DoomApp = ({ onClose }) => {
  const [reloadVersion, setReloadVersion] = useState(0);
  const iframeSrc = useMemo(() => DOOM_LOCAL_PATH, []);
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleWindowMessage = (event) => {
      if (event?.data?.type !== 'hub-link-doom-exit') return;
      if (event.source !== iframeRef.current?.contentWindow) return;
      onClose?.();
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [onClose]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'linear-gradient(180deg, #101217 0%, #06080B 100%)',
        color: '#E5E7EB'
      }}
    >
      <div
        data-no-drag
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '48px',
          padding: '0 14px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(11, 14, 18, 0.75)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <div className="window-controls" style={{ display: 'flex', gap: '8px' }}>
          <div
            onClick={onClose}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#FF5F56',
              border: '0.5px solid rgba(0,0,0,0.2)',
              cursor: 'pointer'
            }}
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#FFBD2E',
              border: '0.5px solid rgba(0,0,0,0.2)'
            }}
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#27C93F',
              border: '0.5px solid rgba(0,0,0,0.2)'
            }}
          />
        </div>

        <div style={{ fontSize: '13px', fontWeight: 600, color: '#F3F4F6', letterSpacing: '0.02em' }}>
          DOOM
        </div>

        <button
          type="button"
          data-no-drag
          onClick={() => window.open(iframeSrc, '_blank', 'noopener,noreferrer')}
          style={{
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.08)',
            color: '#E5E7EB',
            borderRadius: '8px',
            height: '28px',
            padding: '0 10px',
            fontSize: '11px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <ExternalLink size={12} />
          Open Local Runtime
        </button>
      </div>

      <div style={{ padding: '12px', flex: 1, minHeight: 0 }}>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            height: '100%'
          }}
        >
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div
              data-no-drag
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '8px'
              }}
            >
              <button
                type="button"
                onClick={() => setReloadVersion((prev) => prev + 1)}
                style={{
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#E5E7EB',
                  borderRadius: '8px',
                  height: '28px',
                  padding: '0 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={12} />
                Restart
              </button>
            </div>

            <div
              style={{
                width: '100%',
                flex: 1,
                minHeight: 0,
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.12)',
                background: '#000'
              }}
            >
              <iframe
                key={reloadVersion}
                ref={iframeRef}
                src={iframeSrc}
                title="DOOM"
                loading="lazy"
                allow="autoplay; fullscreen; gamepad"
                allowFullScreen
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  background: '#000'
                }}
              />
            </div>
          </div>

          <aside
            data-no-drag
            style={{
              width: '220px',
              flexShrink: 0,
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)',
              padding: '12px',
              overflowY: 'auto'
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                color: 'rgba(243, 244, 246, 0.92)',
                marginBottom: '10px'
              }}
            >
              Controls
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              {CONTROL_HINTS.map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '12px'
                  }}
                >
                  <span
                    style={{
                      color: '#E5E7EB',
                      fontWeight: 600,
                      padding: '3px 6px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.08)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.key}
                  </span>
                  <span style={{ color: 'rgba(229, 231, 235, 0.78)', textAlign: 'right' }}>{item.action}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DoomApp;
