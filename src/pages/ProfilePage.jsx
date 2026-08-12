import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Image, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './ProfilePage.module.css'

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth()
  const [form, setForm] = useState({
    name: user?.displayName || '',
    photoURL: user?.photoURL || ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateUserProfile(form.name, form.photoURL)
      toast.success('Profile updated successfully!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.sidebar}>
            <div className={styles.avatarWrap}>
              <img
                src={form.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name||'User')}&background=7c3aed&color=fff&size=120`}
                alt={form.name}
                className={styles.avatar}
                onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name||'User')}&background=7c3aed&color=fff&size=120` }}
              />
              <div className={styles.onlineDot} />
            </div>
            <h2 className={styles.profileName}>{user?.displayName}</h2>
            <p className={styles.profileEmail}>{user?.email}</p>
            <div className={styles.providerBadge}>
              {user?.providerData?.[0]?.providerId === 'google.com' ? '🌐 Google Account' : '📧 Email Account'}
            </div>
          </div>

          <div className={styles.formCard}>
            <h1 className={styles.title}>Profile Management</h1>
            <p style={{color:'var(--text-muted)',marginBottom:'2rem'}}>Update your public profile information</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{position:'relative'}}>
                  <User size={16} style={{position:'absolute',left:'0.85rem',top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)'}} />
                  <input id="profile-name" name="name" className="form-control" style={{paddingLeft:'2.5rem'}}
                    value={form.name} onChange={handleChange} placeholder="Your full name" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{position:'relative'}}>
                  <Mail size={16} style={{position:'absolute',left:'0.85rem',top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)'}} />
                  <input className="form-control" style={{paddingLeft:'2.5rem',opacity:0.7}}
                    value={user?.email} disabled />
                </div>
                <p style={{fontSize:'0.75rem',color:'var(--text-muted)',marginTop:'0.3rem'}}>Email cannot be changed</p>
              </div>
              <div className="form-group">
                <label className="form-label">Photo URL</label>
                <div style={{position:'relative'}}>
                  <Image size={16} style={{position:'absolute',left:'0.85rem',top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)'}} />
                  <input id="profile-photo" name="photoURL" type="url" className="form-control" style={{paddingLeft:'2.5rem'}}
                    value={form.photoURL} onChange={handleChange} placeholder="https://example.com/photo.jpg" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="save-profile-btn">
                <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
