import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../api/axiosInstance'
import LoadingSpinner from '../components/LoadingSpinner'
import { Edit, Trash2, Eye, Plus, AlertTriangle, Lightbulb, X, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './MyIdeasPage.module.css'

const CATEGORIES = ['Tech','Health','AI','Education','Finance','Environment','Food','Travel','Entertainment','Other']

const MyIdeasPage = () => {
  const queryClient = useQueryClient()
  const [updateIdea, setUpdateIdea] = useState(null) // Idea object to update in modal
  const [deleteIdeaId, setDeleteIdeaId] = useState(null) // Idea ID to delete
  const [tagInput, setTagInput] = useState('')

  // Fetch My Ideas
  const { data: ideas = [], isLoading } = useQuery({
    queryKey: ['my-ideas'],
    queryFn: () => axiosInstance.get('/ideas/my').then(r => r.data)
  })

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: (updatedData) => axiosInstance.put(`/ideas/${updatedData._id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-ideas'])
      setUpdateIdea(null)
      toast.success('Idea updated successfully!')
    },
    onError: () => toast.error('Failed to update idea')
  })

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/ideas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-ideas'])
      setDeleteIdeaId(null)
      toast.success('Idea deleted successfully!')
    },
    onError: () => toast.error('Failed to delete idea')
  })

  const handleUpdateChange = (e) => {
    setUpdateIdea(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAddTag = () => {
    const t = tagInput.trim()
    if (t && !updateIdea.tags?.includes(t)) {
      setUpdateIdea(p => ({ ...p, tags: [...(p.tags || []), t] }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag) => {
    setUpdateIdea(p => ({ ...p, tags: p.tags.filter(t => t !== tag) }))
  }

  const handleUpdateSubmit = (e) => {
    e.preventDefault()
    updateMutation.mutate(updateIdea)
  }

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className="section-title" style={{ textAlign: 'left', margin: 0 }}>My Ideas</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Manage, edit, or delete startup ideas you've submitted to the platform.
            </p>
          </div>
          <Link to="/add-idea" className="btn btn-primary">
            <Plus size={16} /> Share New Idea
          </Link>
        </div>

        {/* Ideas Table / Grid */}
        {isLoading ? (
          <LoadingSpinner />
        ) : ideas.length > 0 ? (
          <div className={styles.tableCard}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Idea</th>
                    <th>Category</th>
                    <th>Comments</th>
                    <th>Date Posted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ideas.map(idea => (
                    <tr key={idea._id}>
                      <td>
                        <div className={styles.ideaTitleCell}>
                          {idea.imageURL && (
                            <img src={idea.imageURL} alt="" className={styles.thumb} onError={e=>e.target.style.display='none'} />
                          )}
                          <div>
                            <h4 className={styles.ideaTitle}>{idea.title}</h4>
                            <p className={styles.ideaDesc}>{idea.shortDescription}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge">{idea.category}</span>
                      </td>
                      <td>
                        <span className={styles.statCount}>💬 {idea.commentCount || 0}</span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <Link to={`/ideas/${idea._id}`} className={styles.actionBtn} title="View Details">
                            <Eye size={16} />
                          </Link>
                          <button
                            className={styles.actionBtn}
                            onClick={() => setUpdateIdea({ ...idea })}
                            title="Edit Idea"
                            id={`edit-my-idea-${idea._id}`}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => setDeleteIdeaId(idea._id)}
                            title="Delete Idea"
                            id={`delete-my-idea-${idea._id}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">💡</div>
            <h3>You haven't posted any ideas yet</h3>
            <p>Share your innovation with the community and get valuable feedback!</p>
            <Link to="/add-idea" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <Plus size={16} /> Submit Your First Idea
            </Link>
          </div>
        )}

        {/* UPDATE MODAL */}
        {updateIdea && (
          <div className="modal-overlay" onClick={() => setUpdateIdea(null)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
              <div className="flex-between mb-2">
                <h2 className="modal-title" style={{ margin: 0 }}>Update Startup Idea</h2>
                <button onClick={() => setUpdateIdea(null)} className={styles.closeModal}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className={styles.modalForm}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    name="title"
                    className="form-control"
                    value={updateIdea.title}
                    onChange={handleUpdateChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Short Description</label>
                  <input
                    name="shortDescription"
                    className="form-control"
                    value={updateIdea.shortDescription}
                    onChange={handleUpdateChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Description</label>
                  <textarea
                    name="detailedDescription"
                    className="form-control"
                    rows={4}
                    value={updateIdea.detailedDescription}
                    onChange={handleUpdateChange}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      className="form-control"
                      value={updateIdea.category}
                      onChange={handleUpdateChange}
                    >
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Estimated Budget</label>
                    <input
                      name="estimatedBudget"
                      className="form-control"
                      value={updateIdea.estimatedBudget || ''}
                      onChange={handleUpdateChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Audience</label>
                  <input
                    name="targetAudience"
                    className="form-control"
                    value={updateIdea.targetAudience}
                    onChange={handleUpdateChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Problem Statement</label>
                  <textarea
                    name="problemStatement"
                    className="form-control"
                    rows={3}
                    value={updateIdea.problemStatement}
                    onChange={handleUpdateChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Proposed Solution</label>
                  <textarea
                    name="proposedSolution"
                    className="form-control"
                    rows={3}
                    value={updateIdea.proposedSolution}
                    onChange={handleUpdateChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    name="imageURL"
                    className="form-control"
                    value={updateIdea.imageURL || ''}
                    onChange={handleUpdateChange}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setUpdateIdea(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={updateMutation.isLoading} id="save-update-modal-btn">
                    {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteIdeaId && (
          <div className="modal-overlay" onClick={() => setDeleteIdeaId(null)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--danger)', margin: '0 auto 1rem'
              }}>
                <AlertTriangle size={28} />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Delete Idea?</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Are you sure you want to delete this idea? This action cannot be undone and will delete all associated comments.
              </p>
              <div className="modal-actions" style={{ justifyContent: 'center' }}>
                <button className="btn btn-ghost" onClick={() => setDeleteIdeaId(null)}>
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteMutation.mutate(deleteIdeaId)}
                  disabled={deleteMutation.isLoading}
                  id="confirm-delete-idea-btn"
                >
                  {deleteMutation.isLoading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyIdeasPage
