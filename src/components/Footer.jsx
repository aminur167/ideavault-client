import { Link } from 'react-router-dom'
import { Lightbulb, Mail, Heart, Globe, Share2 } from 'lucide-react'
import styles from './Footer.module.css'

const Footer = () => {
  const year = new Date().getFullYear()

  const platformLinks = [
    { to: '/ideas', label: 'Explore Ideas' },
    { to: '/add-idea', label: 'Share Idea' },
    { to: '/my-ideas', label: 'My Ideas' },
    { to: '/my-interactions', label: 'My Interactions' },
  ]

  const categories = ['Tech', 'Health', 'AI', 'Education', 'Finance', 'Environment']

  return (
    <footer className={styles.footer}>
      <div className={styles.glow} />
      <div className="container">
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <Lightbulb size={20} fill="currentColor" />
              </div>
              <span>Idea<span className={styles.logoAccent}>Vault</span></span>
            </Link>
            <p className={styles.brandDesc}>
              The platform where innovative startup ideas come to life. Share, explore, and validate your next big thing with a global community.
            </p>
            <div className={styles.socials}>
              <a href="https://x.com" target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="X (Twitter)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className={styles.colTitle}>Platform</h4>
            <ul className={styles.linkList}>
              {platformLinks.map(l => (
                <li key={l.to}><Link to={l.to} className={styles.footerLink}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className={styles.colTitle}>Categories</h4>
            <ul className={styles.linkList}>
              {categories.map(cat => (
                <li key={cat}>
                  <Link to={`/ideas?category=${cat}`} className={styles.footerLink}>{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={styles.colTitle}>Contact</h4>
            <div className={styles.contactItem}>
              <Mail size={15} />
              <a href="mailto:hello@ideavault.io" className={styles.footerLink}>hello@ideavault.io</a>
            </div>
            <p className={styles.contactText}>Have an idea or feedback? We'd love to hear from you.</p>
            <Link to="/add-idea" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              Share Your Idea
            </Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {year} IdeaVault. All rights reserved.
          </p>
          <p className={styles.madeWith}>
            Made with <Heart size={13} fill="var(--danger)" stroke="none" /> for innovators worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
