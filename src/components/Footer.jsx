import { Link } from 'react-router-dom'
import { Lightbulb, Mail, Github, Twitter, Linkedin, Instagram, Heart } from 'lucide-react'
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
                <Github size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="Instagram">
                <Instagram size={16} />
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
