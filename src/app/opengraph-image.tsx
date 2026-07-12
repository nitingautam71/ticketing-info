import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#070c18',
          backgroundImage: 'radial-gradient(circle at 25% 20%, #0d3b2e 0%, #070c18 55%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: '#101827',
              border: '2px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              color: '#fbbf24',
            }}
          >
            ✈
          </div>
          <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, color: '#ffffff' }}>
            Ticketing-<span style={{ color: '#fbbf24' }}>info</span>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: 28, fontSize: 30, color: '#d4d4d8', textAlign: 'center' }}>
          Flight Tickets · Train Tickets · Tour Packages · Visa Assistance
        </div>
      </div>
    ),
    { ...size }
  );
}
