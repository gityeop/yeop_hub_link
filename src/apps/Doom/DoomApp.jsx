import React, { useMemo, useState } from 'react';
import { ExternalLink, RotateCcw } from 'lucide-react';

const DOOM_LOCAL_PATH = `${import.meta.env.BASE_URL}doom/index.html`;

const DoomApp = ({ onClose }) => {
  const [reloadVersion, setReloadVersion] = useState(0);
  const iframeSrc = useMemo(() => DOOM_LOCAL_PATH, []);

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
          DOOM.EXE
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
            height: '100%',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.12)',
            background: '#000'
          }}
        >
          <iframe
            key={reloadVersion}
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
    </div>
  );
};

export default DoomApp;
