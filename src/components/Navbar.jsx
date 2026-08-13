import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon, Menu, X, Lightbulb, Plus, BookOpen, MessageSquare, LogOut, User, ChevronDown } from 'lucide-react'
import styles from './Navbar.module.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    await logout()
    setDropdownOpen(false)
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/ideas', label: 'Ideas' },
    ...(user ? [
      { to: '/add-idea', label: 'Add Idea', icon: <Plus size={15} /> },
      { to: '/my-ideas', label: 'My Ideas', icon: <Lightbulb size={15} /> },
      { to: '/my-interactions', label: 'My Interactions', icon: <MessageSquare size={15} /> },
    ] : []),
  ]

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navInner}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Lightbulb size={20} fill="currentColor" />
          </div>
          <span>Idea<span className={styles.logoAccent}>Vault</span></span>
        </Link>

        {/* Desktop Nav */}
        <ul className={styles.navLinks}>
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                {link.icon ? link.icon : null}
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Controls */}
        <div className={styles.controls}>
          <button onClick={toggleTheme} className={styles.themeBtn} aria-label="Toggle theme" id="theme-toggle-btn">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className={styles.userDropdown} ref={dropdownRef}>
              <button className={styles.userBtn} onClick={() => setDropdownOpen(p => !p)} id="user-dropdown-btn">
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=7c3aed&color=fff`}
                  alt={user.displayName}
                  className={styles.userAvatar}
                />
                <span className={styles.userName}>{user.displayName?.split(' ')[0]}</span>
                <ChevronDown size={14} className={dropdownOpen ? styles.chevronOpen : ''} />
              </button>
              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=7c3aed&color=fff`}
                      alt={user.displayName}
                      className={styles.dropdownAvatar}
                    />
                    <div>
                      <p className={styles.dropdownName}>{user.displayName}</p>
                      <p className={styles.dropdownEmail}>{user.email}</p>
                    </div>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <Link to="/profile" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <User size={15} /> Profile Management
                  </Link>
                  <Link to="/my-ideas" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <BookOpen size={15} /> My Ideas
                  </Link>
                  <Link to="/my-interactions" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <MessageSquare size={15} /> My Interactions
                  </Link>
                  <div className={styles.dropdownDivider} />
                  <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout} id="logout-btn">
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authBtns}>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button className={styles.hamburger} onClick={() => setMenuOpen(p => !p)} aria-label="Menu" id="mobile-menu-btn">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.active : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
          {!user ? (
            <div style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 0' }}>
              <Link to="/login" className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm w-full" style={{ justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          ) : (
            <button className={`${styles.mobileLink}`} onClick={handleLogout} style={{ color: 'var(--danger)', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
              <LogOut size={15} /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
