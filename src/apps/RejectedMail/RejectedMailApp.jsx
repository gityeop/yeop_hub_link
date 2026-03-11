import React from 'react';
import { ExternalLink } from 'lucide-react';

const REJECTED_MAIL_VIDEO_URL = 'https://www.youtube.com/embed/_g6q35SS8eA?autoplay=1&mute=1&rel=0&playsinline=1';
const REJECTED_MAIL_VIDEO_PAGE_URL = 'https://www.youtube.com/watch?v=_g6q35SS8eA';

const RejectedMailApp = ({ onClose }) => {
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
      onPointerDown={(event) => event.stopPropagation()}
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
            onPointerDown={(event) => event.stopPropagation()}
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

        <div style={{ fontWeight: '600', color: '#333' }}>채용불합격 이메일 해석기</div>

        <a
          data-no-drag
          href={REJECTED_MAIL_VIDEO_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#1D4ED8',
            fontSize: '12px',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          <ExternalLink size={12} />
          Open on YouTube
        </a>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          background: '#fff'
        }}
      >
        <aside
          style={{
            borderRight: '1px solid #EFEFEF',
            background: 'linear-gradient(180deg, #FFF7F7 0%, #FFFFFF 68%)',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '6px 10px',
              borderRadius: '999px',
              background: '#FEE2E2',
              color: '#B91C1C',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}
          >
            Side Project Archive
          </div>

          <div>
            <h1
              style={{
                margin: '0 0 10px',
                fontSize: '28px',
                lineHeight: 1.12,
                color: '#111827'
              }}
            >
              채용불합격
              <br />
              이메일 해석기
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                lineHeight: 1.6,
                color: '#6B7280'
              }}
            >
              취업 준비를 하며 받았던 불합격 이메일에는 늘 비슷한 표현이 반복됐습니다.
              같은 말을 부드럽게 돌려서 전해도 아쉬운 마음까지 가벼워지지는 않더라고요.
              그래서 그런 문장들을 조금 더 솔직하고 유머 있게 바라보는 작은 프로젝트를 만들었습니다.
            </p>
            <p
              style={{
                margin: '10px 0 0',
                fontSize: '13px',
                lineHeight: 1.6,
                color: '#6B7280'
              }}
            >
              완곡한 문장을 조금 더 솔직하고 유머 있게 바라보는, 작고 장난스러운
              해석기라고 봐주시면 됩니다.
            </p>
          </div>

        </aside>

        <div
          style={{
            minWidth: 0,
            minHeight: 0,
            padding: '20px',
            background: '#F8FAFC'
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '18px',
              overflow: 'hidden',
              border: '1px solid #E5E7EB',
              background: '#000',
              boxShadow: '0 14px 36px rgba(15, 23, 42, 0.08)'
            }}
          >
            <iframe
              src={REJECTED_MAIL_VIDEO_URL}
              title="채용불합격 이메일 해석기 데모 영상"
              loading="eager"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block'
              }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default RejectedMailApp;
