import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#e8ff47',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0a0a0a',
          fontSize: 24,
          fontWeight: 900,
          fontFamily: 'system-ui',
          letterSpacing: '-0.06em',
        }}
      >
        M
      </div>
    ),
    { ...size }
  );
}
