import { useRef, useState } from 'react'
import { Camera, CheckCircle2, ImagePlus, Mail, Save, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './ProfilePage.module.css'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const avatarFallback = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=7c3aed&color=fff&size=240`

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth()
  const inputRef = useRef(null)
  const [name, setName] = useState(user?.displayName || '')
  const [photoFile, setPhotoFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(user?.photoURL || '')
  const [loading, setLoading] = useState(false)
  const choosePhoto = () => inputRef.current?.click()
  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('Please choose an image file.')
    if (file.size > MAX_FILE_SIZE) return toast.error('Please use an image smaller than 5 MB.')
    setPhotoFile(file); setPreviewUrl(URL.createObjectURL(file))
  }
  const uploadPhoto = async () => {
    if (!photoFile) return user?.photoURL || ''
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    if (!cloudName || !uploadPreset) throw new Error('Image uploads are not configured')
    const payload = new FormData()
    payload.append('file', photoFile)
    payload.append('upload_preset', uploadPreset)
    payload.append('folder', `ideavault/profile-photos/${user.uid}`)
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: payload })
    const data = await response.json()
    if (!response.ok || !data.secure_url) throw new Error(data.error?.message || 'Image upload failed')
    return data.secure_url
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!name.trim()) return toast.error('Please enter your name.')
    setLoading(true)
    try { const photoURL = await uploadPhoto(); await updateUserProfile(name.trim(), photoURL); setPhotoFile(null); setPreviewUrl(photoURL); toast.success('Your profile has been updated.') }
    catch (error) { toast.error(`Could not update profile: ${error.message || error.code || 'unknown error'}`) }
    finally { setLoading(false) }
  }
  const providerName = user?.providerData?.[0]?.providerId === 'google.com' ? 'Google account' : 'Email account'
  const currentPhoto = previewUrl || avatarFallback(name)
  return <div className={`page-wrapper ${styles.page}`}><div className="container"><div className={styles.pageIntro}><p className={styles.eyebrow}>YOUR WORKSPACE</p><h1>Profile & presence</h1><p>Keep your public identity clear, current, and recognisable to the IdeaVault community.</p></div><div className={styles.wrapper}>
    <aside className={styles.sidebar}><div className={styles.avatarWrap}><img src={currentPhoto} alt={name || 'Profile'} className={styles.avatar} onError={(event) => { event.currentTarget.src = avatarFallback(name) }} /><span className={styles.onlineDot} /></div><h2 className={styles.profileName}>{name || 'Your name'}</h2><p className={styles.profileEmail}>{user?.email}</p><span className={styles.providerBadge}><ShieldCheck size={14} /> {providerName}</span><div className={styles.sideDivider} /><p className={styles.sideCopy}>Your photo and name appear next to the ideas and feedback you share.</p></aside>
    <section className={styles.formCard}><div className={styles.cardHeader}><div><p className={styles.eyebrow}>PUBLIC PROFILE</p><h2>Personal details</h2><p>Choose a profile photo from your device and control how your name appears.</p></div><CheckCircle2 size={22} className={styles.headerIcon} /></div><form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.photoSection}><img src={currentPhoto} alt="Profile preview" className={styles.photoPreview} onError={(event) => { event.currentTarget.src = avatarFallback(name) }} /><div><h3>Profile photo</h3><p>JPG, PNG or WebP. Up to 5 MB.</p><input ref={inputRef} id="profile-photo-file" type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhotoChange} className={styles.fileInput} /><button type="button" onClick={choosePhoto} className="btn btn-outline btn-sm"><ImagePlus size={15} /> Choose photo</button>{photoFile && <span className={styles.selectedFile}><Camera size={14} /> {photoFile.name}</span>}</div></div>
      <div className="form-group"><label className="form-label" htmlFor="profile-name">Full name</label><div className={styles.inputWrap}><User size={17} /><input id="profile-name" className="form-control" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" maxLength="80" required /></div></div>
      <div className="form-group"><label className="form-label" htmlFor="profile-email">Email address</label><div className={styles.inputWrap}><Mail size={17} /><input id="profile-email" className="form-control" value={user?.email || ''} disabled /></div><p className={styles.helpText}>Your email is managed securely through Firebase and cannot be changed here.</p></div>
      <div className={styles.formFooter}><p>Changes apply to your profile, existing ideas, and comments.</p><button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="save-profile-btn"><Save size={18} /> {loading ? 'Saving changes…' : 'Save changes'}</button></div>
    </form></section></div></div></div>
}
export default ProfilePage
