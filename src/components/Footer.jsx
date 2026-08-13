import { Link } from 'react-router-dom'
import { ArrowUpRight, Heart, Lightbulb, Mail, ShieldCheck } from 'lucide-react'
import styles from './Footer.module.css'

const Footer = () => {
  const year = new Date().getFullYear()
  const platformLinks = [
    { to: '/ideas', label: 'Explore ideas' }, { to: '/add-idea', label: 'Share an idea' },
    { to: '/my-ideas', label: 'My workspace' }, { to: '/my-interactions', label: 'Saved & activity' },
  ]
  const categories = ['Tech', 'Health', 'AI', 'Education', 'Finance', 'Environment']

  return (
    <footer className={styles.footer}>
      <div className={styles.glow} />
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoIcon}><Lightbulb size={20} fill="currentColor" /></span>
              <span>Idea<span className={styles.logoAccent}>Vault</span></span>
            </Link>
            <p className={styles.brandDesc}>A focused home for ambitious builders to share sharp ideas, learn from feedback, and move from concept to conviction.</p>
            <p className={styles.trustLine}><ShieldCheck size={16} /> Built for thoughtful collaboration</p>
            <div className={styles.socials} aria-label="Founder profiles">
              <a href="https://www.instagram.com/aminur_167/?hl=en" target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="Aminur on Instagram">ig</a>
              <a href="https://www.linkedin.com/in/aminur167/" target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="Aminur on LinkedIn">in</a>
              <a href="https://github.com/aminur167" target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="Aminur on GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.8 8.21 11.39.6.11.82-.26.82-.57 0-.28-.01-1.23-.02-2.24-3.02.56-3.8-.74-4.04-1.41-.14-.35-.72-1.41-1.23-1.7-.42-.22-1.02-.78-.02-.8.95-.02 1.63.88 1.85 1.23 1.08 1.82 2.81 1.31 3.5.99.1-.78.42-1.31.76-1.61-2.67-.3-5.46-1.33-5.46-5.92 0-1.31.47-2.39 1.23-3.23-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.3-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.23 0 4.6-2.81 5.62-5.48 5.92.44.38.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.3 0 .32.22.69.82.57A12.02 12.02 0 0024 12C24 5.37 18.63 0 12 0z" /></svg>
              </a>
              <a href="https://www.facebook.com/aminur.islam.868339" target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="Aminur on Facebook">f</a>
            </div>
          </div>
          <div>
            <h4 className={styles.colTitle}>Platform</h4>
            <ul className={styles.linkList}>{platformLinks.map((link) => <li key={link.to}><Link to={link.to} className={styles.footerLink}>{link.label}</Link></li>)}</ul>
          </div>
          <div>
            <h4 className={styles.colTitle}>Explore</h4>
            <ul className={styles.linkList}>{categories.map((category) => <li key={category}><Link to={`/ideas?category=${category}`} className={styles.footerLink}>{category}</Link></li>)}</ul>
          </div>
          <div>
            <h4 className={styles.colTitle}>Start a conversation</h4>
            <div className={styles.contactItem}><Mail size={15} /><a href="mailto:hello@ideavault.io" className={styles.footerLink}>hello@ideavault.io</a></div>
            <p className={styles.contactText}>Have feedback or a partnership idea? The team would love to hear it.</p>
            <Link to="/add-idea" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Share an idea <ArrowUpRight size={14} /></Link>
          </div>
        </div>
        <div className={styles.bottom}>
          <p className={styles.copyright}>© {year} IdeaVault. All rights reserved.</p>
          <p className={styles.madeWith}>Made with <Heart size={13} fill="var(--danger)" stroke="none" /> for builders worldwide</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
