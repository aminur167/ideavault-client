import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

const NotFoundPage = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', padding: '6rem 1rem 3rem', flexDirection: 'column'
  }}>
    <div style={{ position: 'relative', marginBottom: '2rem' }}>
      <div style={{
        fontSize: 'clamp(6rem, 20vw, 12rem)', fontWeight: 900,
        fontFamily: 'var(--font-heading)',
        background: 'var(--gradient-primary)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        lineHeight: 1, opacity: 0.3
      }}>404</div>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Search size={60} style={{ color: 'var(--primary-light)', opacity: 0.6 }} />
      </div>
    </div>
    <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
      Page Not Found
    </h1>
    <p style={{ color: 'var(--text-muted)', maxWidth: 420, marginBottom: '2.5rem', lineHeight: 1.7 }}>
      The page you're looking for doesn't exist or has been moved. Let's get you back to exploring ideas.
    </p>
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Link to="/" className="btn btn-primary btn-lg"><Home size={18} /> Go Home</Link>
      <Link to="/ideas" className="btn btn-outline btn-lg"><Search size={18} /> Explore Ideas</Link>
    </div>
  </div>
)

export default NotFoundPage
