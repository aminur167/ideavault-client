import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, Image, Lightbulb } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './AuthPage.module.css'

const RegisterPage = () => {
  const { register, googleLogin } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', photoURL: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const validate = () => {
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return false }
    if (!/[A-Z]/.test(form.password)) { toast.error('Password must include an uppercase letter'); return false }
    if (!/[a-z]/.test(form.password)) { toast.error('Password must include a lowercase letter'); return false }
    return true
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.photoURL)
      toast.success('Account created! Welcome to IdeaVault 🚀')
      navigate('/')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') toast.error('Email already in use')
      else toast.error('Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await googleLogin()
      toast.success('Welcome to IdeaVault! 🚀')
      navigate('/')
    } catch {
      toast.error('Google sign-up failed')
    }
  }

  const getPasswordStrength = () => {
    const { password } = form
    if (!password) return null
    let score = 0
    if (password.length >= 6) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (score <= 2) return { label: 'Weak', color: 'var(--danger)', width: '30%' }
    if (score <= 3) return { label: 'Fair', color: 'var(--warning)', width: '60%' }
    return { label: 'Strong', color: 'var(--success)', width: '100%' }
  }
  const strength = getPasswordStrength()

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoIcon}><Lightbulb size={22} fill="currentColor" /></div>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join the IdeaVault community</p>
        </div>

        <button type="button" onClick={handleGoogle} className={styles.googleBtn} id="google-register-btn">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div className={styles.divider}><span>or</span></div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className={styles.inputWrap}>
              <User size={16} className={styles.inputIcon} />
              <input id="reg-name" name="name" type="text" className={`form-control ${styles.inputPadded}`}
                placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className={styles.inputWrap}>
              <Mail size={16} className={styles.inputIcon} />
              <input id="reg-email" name="email" type="email" className={`form-control ${styles.inputPadded}`}
                placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Photo URL <span style={{color:'var(--text-muted)'}}>(optional)</span></label>
            <div className={styles.inputWrap}>
              <Image size={16} className={styles.inputIcon} />
              <input id="reg-photo" name="photoURL" type="url" className={`form-control ${styles.inputPadded}`}
                placeholder="https://example.com/photo.jpg" value={form.photoURL} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className={styles.inputWrap}>
              <Lock size={16} className={styles.inputIcon} />
              <input id="reg-password" name="password" type={showPass ? 'text' : 'password'}
                className={`form-control ${styles.inputPadded}`}
                placeholder="Min 6 chars, upper & lower" value={form.password} onChange={handleChange} required />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(p => !p)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {strength && (
              <div className={styles.strengthWrap}>
                <div className={styles.strengthBar}>
                  <div style={{ width: strength.width, background: strength.color, height: '100%', borderRadius: 'inherit', transition: 'all 0.3s' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: strength.color }}>{strength.label}</span>
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading} id="register-submit-btn">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account? <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
