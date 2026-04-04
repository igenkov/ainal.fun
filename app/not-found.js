export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.5rem',
      background: '#05050f',
      fontFamily: 'Orbitron, sans-serif',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <p style={{ fontSize: '4rem', fontWeight: 900, color: '#00ffff', textShadow: '0 0 20px rgba(0,255,255,0.5)', margin: 0 }}>404</p>
      <p style={{ fontSize: '1rem', color: 'rgba(224,240,255,0.6)', margin: 0 }}>This page doesn&apos;t exist.</p>
      <a href="/" style={{ fontSize: '0.75rem', color: '#ff00ff', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase', textShadow: '0 0 8px rgba(255,0,255,0.4)' }}>
        Go back
      </a>
    </div>
  )
}
