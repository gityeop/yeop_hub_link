import React from 'react';

const FlowClipApp = ({ onClose }) => {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f9f9f9'
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <div
            data-no-drag
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onClose}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#FF5F56',
              cursor: 'pointer'
            }}
          />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27C93F' }} />
        </div>
        <div style={{ fontWeight: '600', color: '#333' }}>FlowClip Demo</div>
        <div style={{ width: '40px' }} />
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          position: 'relative'
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            borderRight: '1px solid #eee'
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '460px' }}>
            <p
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#333',
                marginBottom: '18px',
                lineHeight: '1.08'
              }}
            >
              Clipboard history,
              <br />
              now in flow.
            </p>
            <p style={{ color: '#7A7A7A', fontSize: '14px', lineHeight: '1.5' }}>
              FlowClip maintains Maccy's lightness while adding sequential pasting, so you can queue and paste copied items in order without breaking flow.
            </p>
          </div>
        </div>

        <div
          style={{
            width: '420px',
            backgroundColor: '#fafafa',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            borderLeft: '1px solid #eaeaea',
            minHeight: 0,
            overflowY: 'auto'
          }}
        >
          <h3
            style={{
              margin: '0',
              fontSize: '14px',
              color: '#555',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Product Preview
          </h3>

          <div
            style={{
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Basic Clipboard
            </div>
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
              <img
                src="/flowclip-demo/maccy_demo.gif"
                alt="Basic clipboard demo"
                style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#6B7280', lineHeight: '1.45' }}>
              Quickly access copied items, preview content, and paste without leaving your context.
            </div>
          </div>

          <div
            style={{
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Queue Clipboard
            </div>
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
              <img
                src="/flowclip-demo/product_demo.gif"
                alt="Queue clipboard demo"
                style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#6B7280', lineHeight: '1.45' }}>
              Build a paste queue and dispatch snippets in sequence for repetitive workflows.
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '12px',
          backgroundColor: '#f1f1f1',
          borderTop: '1px solid #e0e0e0',
          textAlign: 'center',
          fontSize: '12px',
          color: '#666'
        }}
      >
        Visit{' '}
        <a href="https://gityeop.github.io/FlowClip/" target="_blank" rel="noopener noreferrer" style={{ color: '#007AFF', textDecoration: 'none' }}>
          gityeop.github.io/FlowClip
        </a>{' '}
        for more.
      </div>
    </div>
  );
};

export default FlowClipApp;
