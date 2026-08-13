import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axiosInstance from '../api/axiosInstance'
import { Lightbulb, Tag, X } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './AddIdeaPage.module.css'

const CATEGORIES = ['Tech', 'Health', 'AI', 'Education', 'Finance', 'Environment', 'Food', 'Travel', 'Entertainment', 'Other']

const AddIdeaPage = () => {
  const { user, ensureServerToken } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [form, setForm] = useState({
    title: '', shortDescription: '', detailedDescription: '', category: 'Tech', tags: [], imageURL: '',
    estimatedBudget: '', targetAudience: '', problemStatement: '', proposedSolution: '',
  })

  const handleChange = (event) => setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }))
  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !form.tags.includes(tag) && form.tags.length < 5) {
      setForm((previous) => ({ ...previous, tags: [...previous.tags, tag] }))
      setTagInput('')
    }
  }
  const removeTag = (tag) => setForm((previous) => ({ ...previous, tags: previous.tags.filter((item) => item !== tag) }))
  const handleTagKey = (event) => { if (event.key === 'Enter') { event.preventDefault(); addTag() } }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await ensureServerToken()
      await axiosInstance.post('/ideas', form)
      toast.success('Idea shared successfully!')
      navigate('/my-ideas')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not submit idea. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.iconWrap}><Lightbulb size={28} fill="currentColor" /></div>
          <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>Share Your Idea</h1>
          <p style={{ color: 'var(--text-muted)' }}>Fill in the details to submit your startup idea</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.col}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Basic Information</h2>
                <div className="form-group"><label className="form-label">Idea Title *</label><input name="title" className="form-control" placeholder="e.g. AI-powered meal planner" value={form.title} onChange={handleChange} required id="idea-title" /></div>
                <div className="form-group"><label className="form-label">Short Description *</label><input name="shortDescription" className="form-control" placeholder="One sentence summary" value={form.shortDescription} onChange={handleChange} required id="idea-short-desc" /></div>
                <div className="form-group"><label className="form-label">Detailed Description *</label><textarea name="detailedDescription" className="form-control" rows={5} placeholder="Describe your idea in detail..." value={form.detailedDescription} onChange={handleChange} required id="idea-detailed-desc" /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group"><label className="form-label">Category *</label><select name="category" className="form-control" value={form.category} onChange={handleChange} id="idea-category">{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></div>
                  <div className="form-group"><label className="form-label">Estimated Budget</label><input name="estimatedBudget" className="form-control" placeholder="e.g. $50,000" value={form.estimatedBudget} onChange={handleChange} id="idea-budget" /></div>
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input name="imageURL" type="url" className="form-control" placeholder="https://example.com/image.jpg" value={form.imageURL} onChange={handleChange} id="idea-image" />
                  {form.imageURL && <div className={styles.imagePreview}><img src={form.imageURL} alt="Idea preview" onError={(event) => { event.currentTarget.style.display = 'none' }} /></div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Tags <span style={{ color: 'var(--text-muted)' }}>(up to 5)</span></label>
                  <div className={styles.tagInputWrap}>
                    <input className="form-control" placeholder="Type tag and press Enter" value={tagInput} onChange={(event) => setTagInput(event.target.value)} onKeyDown={handleTagKey} id="idea-tag-input" />
                    <button type="button" className="btn btn-outline btn-sm" onClick={addTag}><Tag size={14} /> Add</button>
                  </div>
                  {form.tags.length > 0 && <div className={styles.tags}>{form.tags.map((tag) => <span key={tag} className="tag">{tag}<button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', display: 'flex' }} aria-label={`Remove ${tag}`}><X size={11} /></button></span>)}</div>}
                </div>
              </div>
            </div>

            <div className={styles.col}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Startup Details</h2>
                <div className="form-group"><label className="form-label">Target Audience *</label><input name="targetAudience" className="form-control" placeholder="Who is this for?" value={form.targetAudience} onChange={handleChange} required id="idea-audience" /></div>
                <div className="form-group"><label className="form-label">Problem Statement *</label><textarea name="problemStatement" className="form-control" rows={4} placeholder="What problem does this solve?" value={form.problemStatement} onChange={handleChange} required id="idea-problem" /></div>
                <div className="form-group"><label className="form-label">Proposed Solution *</label><textarea name="proposedSolution" className="form-control" rows={4} placeholder="How will you solve it?" value={form.proposedSolution} onChange={handleChange} required id="idea-solution" /></div>
                <div className={styles.authorCard}>
                  <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=7c3aed&color=fff`} alt="" className={styles.authorAvatar} />
                  <div><p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.displayName}</p><p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{user?.email}</p><p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>Submitting as this user</p></div>
                </div>
                <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading} id="submit-idea-btn">{loading ? 'Submitting...' : 'Submit Idea'}</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddIdeaPage
