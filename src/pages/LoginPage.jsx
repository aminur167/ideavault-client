import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, Lightbulb } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './AuthPage.module.css'

const firebaseMessage = (error, action) => {
  const messages = {
    'auth/unauthorized-domain': 'Firebase has not authorized this domain. Add localhost under Authentication > Settings > Authorized domains.',
    'auth/operation-not-allowed': 'Enable Google under Firebase Authentication > Sign-in method.',
    'auth/popup-closed-by-user': 'Google sign-in window was closed before completion.',
    'auth/cancelled-popup-request': 'A Google sign-in window is already open.',
    'auth/network-request-failed': 'Network error. Check your internet connection and try again.',
    'auth/user-not-found': 'No account exists for this email.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/too-many-requests': 'Too many requests. Please wait a few minutes.',
  }
  return messages[error.code] || `${action} failed: ${error.code || 'unknown error'}`
}

const LoginPage = () => {
  const { login, googleLogin, resetPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault(); setLoading(true)
    try { await login(form.email.trim(), form.password); toast.success('Welcome back!'); navigate(from, { replace: true }) }
    catch (error) { toast.error(error.code === 'auth/invalid-credential' ? 'Invalid email or password.' : firebaseMessage(error, 'Sign in')) }
    finally { setLoading(false) }
  }
  const handleGoogle = async () => {
    setGoogleLoading(true)
    try { await googleLogin(); toast.success('Welcome!'); navigate(from, { replace: true }) }
    catch (error) { toast.error(firebaseMessage(error, 'Google sign-in')) }
    finally { setGoogleLoading(false) }
  }
  const handleForgotPassword = async () => {
    const email = form.email.trim()
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return toast.error('Enter a valid email address first.')
    try { await resetPassword(email); toast.success('Password reset email sent. Check inbox and spam.') }
    catch (error) { toast.error(firebaseMessage(error, 'Password reset')) }
  }

  return <div className={styles.page}><div className={styles.bg} /><div className={styles.card}>
    <div className={styles.header}><div className={styles.logoIcon}><Lightbulb size={22} fill="currentColor" /></div><h1 className={styles.title}>Welcome Back</h1><p className={styles.subtitle}>Sign in to continue to IdeaVault</p></div>
    <button type="button" onClick={handleGoogle} className={styles.googleBtn} id="google-login-btn" disabled={googleLoading}>
      <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>{googleLoading ? 'Opening Google…' : 'Continue with Google'}
    </button>
    <div className={styles.divider}><span>or</span></div>
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className="form-group"><label className="form-label">Email Address</label><div className={styles.inputWrap}><Mail size={16} className={styles.inputIcon} /><input id="login-email" name="email" type="email" className={`form-control ${styles.inputPadded}`} placeholder="you@example.com" value={form.email} onChange={handleChange} required /></div></div>
      <div className="form-group"><label className="form-label">Password</label><div className={styles.inputWrap}><Lock size={16} className={styles.inputIcon} /><input id="login-password" name="password" type={showPass ? 'text' : 'password'} className={`form-control ${styles.inputPadded}`} placeholder="Your password" value={form.password} onChange={handleChange} required /><button type="button" className={styles.eyeBtn} onClick={() => setShowPass((visible) => !visible)}>{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button></div><button type="button" className={styles.forgotLink} onClick={handleForgotPassword}>Forgot Password?</button></div>
      <button type="submit" className="btn btn-primary w-full" disabled={loading} id="login-submit-btn">{loading ? 'Signing in…' : 'Sign In'}</button>
    </form>
    <p className={styles.switchText}>Don't have an account? <Link to="/register" className={styles.switchLink}>Create one</Link></p>
  </div></div>
}
export default LoginPage
