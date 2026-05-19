import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          fontSize: 132,
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
