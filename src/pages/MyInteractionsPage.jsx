import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../api/axiosInstance'
import IdeaCard from '../components/IdeaCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { MessageSquare, Bookmark, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './MyInteractionsPage.module.css'

const MyInteractionsPage = () => {
  const [activeTab, setActiveTab] = useState('comments') // 'comments' | 'bookmarks'

  // Fetch commented ideas
  const { data: commentedData = [], isLoading: commentedLoading } = useQuery({
    queryKey: ['my-commented-ideas'],
    queryFn: () => axiosInstance.get('/interactions/mine').then(r => r.data)
  })

  // Fetch bookmarked ideas
  const { data: bookmarkedData = [], isLoading: bookmarkedLoading } = useQuery({
    queryKey: ['my-bookmarked-ideas'],
    queryFn: () => axiosInstance.get('/interactions/bookmarks').then(r => r.data)
  })

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <h1 className="section-title">My Interactions</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto' }}>
            Track the startup ideas you've engaged with through comments, discussions, and bookmarks.
          </p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'comments' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('comments')}
            id="tab-commented-ideas"
          >
            <MessageSquare size={16} /> Commented Ideas ({commentedData.length})
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'bookmarks' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('bookmarks')}
            id="tab-bookmarked-ideas"
          >
            <Bookmark size={16} /> Bookmarked Ideas ({bookmarkedData.length})
          </button>
        </div>

        {/* Tab Content: Commented Ideas */}
        {activeTab === 'comments' && (
          <div>
            {commentedLoading ? (
              <LoadingSpinner />
            ) : commentedData.length > 0 ? (
              <div className={styles.interactionsList}>
                {commentedData.map(({ idea, userComments }) => (
                  <div key={idea._id} className={styles.interactionCard}>
                    <div className={styles.ideaPreview}>
                      <div className={styles.ideaInfo}>
                        <span className="badge">{idea.category}</span>
                        <h3 className={styles.ideaTitle}>
                          <Link to={`/ideas/${idea._id}`}>{idea.title}</Link>
                        </h3>
                        <p className={styles.ideaDesc}>{idea.shortDescription}</p>
                        <p className={styles.authorBy}>By {idea.authorName}</p>
                      </div>

                      <Link to={`/ideas/${idea._id}`} className="btn btn-outline btn-sm">
                        View Details <ArrowRight size={14} />
                      </Link>
                    </div>

                    <div className={styles.commentsBox}>
                      <h4 className={styles.commentsBoxTitle}>Your Comments ({userComments.length})</h4>
                      <div className={styles.userCommentsList}>
                        {userComments.map(c => (
                          <div key={c._id} className={styles.commentItem}>
                            <p className={styles.commentText}>{c.text}</p>
                            <span className={styles.commentDate}>
                              {new Date(c.createdAt).toLocaleDateString()} at {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">💬</div>
                <h3>No comment interactions yet</h3>
                <p>Explore startup ideas and share your feedback with creators to see your activity here.</p>
                <Link to="/ideas" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Explore Ideas
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Bookmarked Ideas */}
        {activeTab === 'bookmarks' && (
          <div>
            {bookmarkedLoading ? (
              <LoadingSpinner />
            ) : bookmarkedData.length > 0 ? (
              <div className="grid-3">
                {bookmarkedData.map(idea => (
                  <IdeaCard key={idea._id} idea={idea} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🔖</div>
                <h3>No bookmarked ideas yet</h3>
                <p>Bookmark interesting startup concepts while browsing to save them for later.</p>
                <Link to="/ideas" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Explore Ideas
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyInteractionsPage
