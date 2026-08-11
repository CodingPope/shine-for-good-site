import { ImageResponse } from 'next/og'

export const alt = 'Shine for Good — St. Pete & Tampa Bay Cleaning'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
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
          background: '#FAF6EE',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background:
              'radial-gradient(circle at 85% 15%, rgba(175,192,203,0.5), transparent 55%), radial-gradient(circle at 10% 90%, rgba(201,210,198,0.5), transparent 55%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 30,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: '#A98A57',
          }}
        >
          <div style={{ width: 60, height: 1, background: '#A98A57' }} />
          <div style={{ display: 'flex' }}>Where every clean makes a difference</div>
          <div style={{ width: 60, height: 1, background: '#A98A57' }} />
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 128,
            color: '#3B4230',
            marginTop: 28,
            fontWeight: 600,
          }}
        >
          Shine for Good
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 34,
            color: '#54594F',
            marginTop: 20,
          }}
        >
          St. Petersburg &amp; Tampa Bay House Cleaning
        </div>
      </div>
    ),
    { ...size }
  )
}
