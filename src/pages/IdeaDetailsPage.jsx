import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../api/axiosInstance'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import {
  Calendar, MessageSquare, Tag, Bookmark, Edit, Trash2, Send,
  ArrowLeft, Target, AlertTriangle, Lightbulb, DollarSign, Clock
} from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './IdeaDetailsPage.module.css'

const IdeaDetailsPage = () => {
  const { id } = useParams()
  const { user, ensureServerToken } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [commentText, setCommentText] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editText, setEditText] = useState('')
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Fetch Idea Details
  const { data: idea, isLoading: ideaLoading, error } = useQuery({
    queryKey: ['idea', id],
    queryFn: () => axiosInstance.get(`/ideas/${id}`).then(r => r.data),
    onSuccess: (data) => {
      if (user && data.bookmarks?.includes(user.email)) {
        setIsBookmarked(true)
      }
    }
  })

  // Fetch Comments
  const { data: comments = [], isLoading: commentsLoading, refetch: refetchComments } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => axiosInstance.get(`/comments/${id}`).then(r => r.data)
  })

  // Add Comment Mutation
  const addCommentMutation = useMutation({
    mutationFn: async (text) => {
      await ensureServerToken()
      return axiosInstance.post('/comments', { ideaId: id, text })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['comments', id] })
      await queryClient.invalidateQueries({ queryKey: ['idea', id] })
      await refetchComments()
      setCommentText('')
      toast.success('Comment posted!')
    },
    onError: (error) => toast.error(error.response?.data?.message || error.message || 'Failed to post comment')
  })

  // Edit Comment Mutation
  const editCommentMutation = useMutation({
    mutationFn: async ({ commentId, text }) => {
      await ensureServerToken()
      return axiosInstance.put(`/comments/${commentId}`, { text })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['comments', id] })
      await refetchComments()
      setEditingCommentId(null)
      setEditText('')
      toast.success('Comment updated!')
    },
    onError: (error) => toast.error(error.response?.data?.message || error.message || 'Failed to update comment')
  })

  // Delete Comment Mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      await ensureServerToken()
      return axiosInstance.delete(`/comments/${commentId}`)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['comments', id] })
      await queryClient.invalidateQueries({ queryKey: ['idea', id] })
      await refetchComments()
      toast.success('Comment deleted!')
    },
    onError: (error) => toast.error(error.response?.data?.message || error.message || 'Failed to delete comment')
  })

  // Toggle Bookmark
  const handleBookmarkToggle = async () => {
    try {
      const res = await axiosInstance.post(`/ideas/${id}/bookmark`)
      setIsBookmarked(res.data.bookmarked)
      toast.success(res.data.bookmarked ? 'Bookmarked!' : 'Bookmark removed')
    } catch {
      toast.error('Failed to update bookmark')
    }
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    addCommentMutation.mutate(commentText.trim())
  }

  const handleEditSubmit = (commentId) => {
    if (!editText.trim()) return
    editCommentMutation.mutate({ commentId, text: editText.trim() })
  }

  if (ideaLoading) return <LoadingSpinner fullPage />
  if (error || !idea) return (
    <div className="page-wrapper container text-center" style={{ paddingTop: '8rem' }}>
      <h2>Idea not found</h2>
      <Link to="/ideas" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Ideas</Link>
    </div>
  )

  const formattedDate = new Date(idea.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className="container">
        {/* Back Link */}
        <button onClick={() => navigate(-1)} className={`btn btn-ghost btn-sm ${styles.backBtn}`}>
          <ArrowLeft size={16} /> Back
        </button>

        <div className={styles.grid}>
          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Header Card */}
            <div className={styles.headerCard}>
              <div className={styles.topMeta}>
                <span className="badge">{idea.category}</span>
                <button
                  onClick={handleBookmarkToggle}
                  className={`${styles.bookmarkBtn} ${isBookmarked ? styles.bookmarked : ''}`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark this idea'}
                  id="toggle-bookmark-btn"
                >
                  <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
              </div>

              <h1 className={styles.title}>{idea.title}</h1>
              <p className={styles.shortDesc}>{idea.shortDescription}</p>

              {/* Author bar */}
              <div className={styles.authorRow}>
                <img
                  src={idea.authorPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(idea.authorName)}&background=7c3aed&color=fff`}
                  alt={idea.authorName}
                  className={styles.authorAvatar}
                />
                <div>
                  <h4 className={styles.authorName}>{idea.authorName}</h4>
                  <p className={styles.authorEmail}>{idea.authorEmail}</p>
                </div>
                <div className={styles.dateBadge}>
                  <Calendar size={14} /> {formattedDate}
                </div>
              </div>
            </div>

            {/* Banner Image */}
            {idea.imageURL && (
              <div className={styles.imageWrap}>
                <img src={idea.imageURL} alt={idea.title} className={styles.bannerImg} onError={e=>e.target.style.display='none'} />
              </div>
            )}

            {/* Detailed Description */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionHeading}><Lightbulb size={20} /> Detailed Overview</h2>
              <div className={styles.prose}>
                <p>{idea.detailedDescription}</p>
              </div>
            </div>

            {/* Problem & Solution */}
            <div className={styles.twoColGrid}>
              <div className={`${styles.sectionCard} ${styles.problemCard}`}>
                <h3 className={styles.sectionHeadingSmall}><AlertTriangle size={18} style={{ color: 'var(--warning)' }} /> Problem Statement</h3>
                <p className={styles.cardText}>{idea.problemStatement}</p>
              </div>

              <div className={`${styles.sectionCard} ${styles.solutionCard}`}>
                <h3 className={styles.sectionHeadingSmall}><Lightbulb size={18} style={{ color: 'var(--success)' }} /> Proposed Solution</h3>
                <p className={styles.cardText}>{idea.proposedSolution}</p>
              </div>
            </div>

            {/* Target Audience & Budget */}
            <div className={styles.twoColGrid}>
              <div className={styles.sectionCard}>
                <h3 className={styles.sectionHeadingSmall}><Target size={18} style={{ color: 'var(--accent)' }} /> Target Audience</h3>
                <p className={styles.cardText}>{idea.targetAudience}</p>
              </div>

              {idea.estimatedBudget && (
                <div className={styles.sectionCard}>
                  <h3 className={styles.sectionHeadingSmall}><DollarSign size={18} style={{ color: 'var(--primary-light)' }} /> Estimated Budget</h3>
                  <p className={styles.cardText}>{idea.estimatedBudget}</p>
                </div>
              )}
            </div>

            {/* Tags */}
            {idea.tags?.length > 0 && (
              <div className={styles.tagsRow}>
                <Tag size={16} style={{ color: 'var(--text-muted)' }} />
                {idea.tags.map(t => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            )}

            {/* COMMENT SYSTEM */}
            <div className={styles.commentSection}>
              <div className={styles.commentHeader}>
                <h2 className={styles.commentTitle}>
                  <MessageSquare size={22} /> Community Discussion ({comments.length})
                </h2>
              </div>

              {/* Add Comment Form */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                  <div className={styles.userCommentBar}>
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName||'User')}&background=7c3aed&color=fff`}
                      alt={user.displayName}
                      className={styles.commentAvatar}
                    />
                    <div style={{ flex: 1 }}>
                      <textarea
                        id="new-comment-textarea"
                        className="form-control"
                        placeholder="Add your feedback or discussion thoughts..."
                        rows={3}
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        required
                      />
                      <div className={styles.formFooter}>
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm"
                          disabled={addCommentMutation.isLoading || !commentText.trim()}
                          id="submit-comment-btn"
                        >
                          <Send size={14} /> {addCommentMutation.isLoading ? 'Posting...' : 'Post Comment'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className={styles.loginPrompt}>
                  <p>Log in to participate in the idea discussion!</p>
                  <Link to="/login" className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>Login to Comment</Link>
                </div>
              )}

              {/* Comments List */}
              <div className={styles.commentsList}>
                {commentsLoading ? (
                  <LoadingSpinner />
                ) : comments.length > 0 ? (
                  comments.map(c => {
                    const isOwner = user?.email?.toLowerCase() === c.authorEmail?.toLowerCase()
                    const isEditing = editingCommentId === c._id

                    return (
                      <div key={c._id} className={styles.commentCard}>
                        <img
                          src={c.authorPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.authorName)}&background=7c3aed&color=fff`}
                          alt={c.authorName}
                          className={styles.commentAvatar}
                        />

                        <div className={styles.commentBody}>
                          <div className={styles.commentMeta}>
                            <div>
                              <span className={styles.commentAuthorName}>{c.authorName}</span>
                              <span className={styles.commentTime}>
                                <Clock size={12} /> {new Date(c.createdAt).toLocaleDateString()} at {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            {isOwner && !isEditing && (
                              <div className={styles.commentActions}>
                                <button
                                  className={styles.actionBtn}
                                  onClick={() => {
                                    setEditingCommentId(c._id)
                                    setEditText(c.text)
                                  }}
                                  title="Edit comment"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  className={`${styles.actionBtn} ${styles.deleteAction}`}
                                  onClick={() => deleteCommentMutation.mutate(c._id)}
                                  title="Delete comment"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </div>

                          {isEditing ? (
                            <div className={styles.editWrap}>
                              <textarea
                                className="form-control"
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                rows={2}
                              />
                              <div className={styles.editButtons}>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleEditSubmit(c._id)}
                                  disabled={editCommentMutation.isLoading}
                                >
                                  Save
                                </button>
                                <button
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => setEditingCommentId(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className={styles.commentText}>{c.text}</p>
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className={styles.noComments}>
                    <MessageSquare size={32} style={{ opacity: 0.4 }} />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IdeaDetailsPage
