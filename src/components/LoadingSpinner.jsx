const LoadingSpinner = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--bg-primary)'
      }}>
        <SpinnerInner />
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
      <SpinnerInner />
    </div>
  )
}

const SpinnerInner = () => (
  <div style={{ textAlign: 'center' }}>
    <div style={{
      width: '52px', height: '52px',
      border: '3px solid rgba(124, 58, 237, 0.15)',
      borderTop: '3px solid #7c3aed',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      margin: '0 auto 1rem',
    }} />
    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

export default LoadingSpinner
