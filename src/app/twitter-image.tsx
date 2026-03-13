import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'PREVYA - Prévisions professionnelles pour PME'
export const size = { width: 1200, height: 600 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FAFAF9',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Decoration subtile haut gauche */}
        <div style={{
          position: 'absolute',
          top: 40,
          left: 60,
          width: 80,
          height: 80,
          background: '#B45309',
          opacity: 0.15,
          borderRadius: 16,
          transform: 'rotate(45deg)',
          display: 'flex',
        }} />

        {/* Logo + nom */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24,
        }}>
          <div style={{
            width: 56,
            height: 56,
            background: '#B45309',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            fontWeight: 800,
            color: 'white',
          }}>
            L
          </div>
          <span style={{
            fontSize: 48,
            fontWeight: 800,
            color: '#141414',
            letterSpacing: '-0.02em',
          }}>
            PREVYA
          </span>
        </div>

        {/* Titre principal */}
        <div style={{
          fontSize: 36,
          fontWeight: 600,
          color: '#141414',
          textAlign: 'center',
          maxWidth: 800,
          lineHeight: 1.3,
          display: 'flex',
        }}>
          Prévisions professionnelles pour PME
        </div>

        {/* Sous-titre */}
        <div style={{
          fontSize: 22,
          color: '#5C5C58',
          marginTop: 16,
          textAlign: 'center',
          display: 'flex',
        }}>
          Jusqu'à 24 modèles · Backtesting automatique · 5 minutes
        </div>

        {/* Badge CTA */}
        <div style={{
          marginTop: 36,
          padding: '12px 32px',
          background: 'rgba(180, 83, 9, 0.1)',
          border: '1px solid rgba(180, 83, 9, 0.3)',
          borderRadius: 12,
          fontSize: 18,
          fontWeight: 600,
          color: '#B45309',
          display: 'flex',
        }}>
          Essai gratuit 3 mois
        </div>

        {/* URL bas de page */}
        <div style={{
          position: 'absolute',
          bottom: 36,
          fontSize: 16,
          color: '#8A8A82',
          display: 'flex',
        }}>
          lumeniq.fr
        </div>
      </div>
    ),
    { ...size }
  )
}
