import { Link } from 'react-router-dom'
import { Calendar, MessageSquare, User, Tag, ArrowRight, Bookmark } from 'lucide-react'
import styles from './IdeaCard.module.css'

const CATEGORY_COLORS = {
  Tech: '#7c3aed', Health: '#10b981', AI: '#06b6d4',
  Education: '#f59e0b', Finance: '#3b82f6', Environment: '#22c55e',
  Food: '#f97316', Travel: '#ec4899', Entertainment: '#8b5cf6', Other: '#94a3b8'
}

const IdeaCard = ({ idea, showBookmark = false, isBookmarked = false, onBookmark }) => {
  const {
    _id, title, shortDescription, category, tags = [],
    authorName, authorPhoto, commentCount = 0, createdAt, imageURL, bookmarks = []
  } = idea

  const categoryColor = CATEGORY_COLORS[category] || '#94a3b8'
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const avatarUrl = authorPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=7c3aed&color=fff&size=32`

  return (
    <div className={styles.card}>
      {/* Image */}
      {imageURL && (
        <div className={styles.imageWrap}>
          <img src={imageURL} alt={title} className={styles.image} loading="lazy"
            onError={e => { e.target.style.display = 'none' }} />
          <div className={styles.categoryBadge} style={{ background: `${categoryColor}22`, color: categoryColor, borderColor: `${categoryColor}44` }}>
            {category}
          </div>
        </div>
      )}

      <div className={styles.body}>
        {/* Category (no image case) */}
        {!imageURL && (
          <div className={styles.categoryTop}>
            <span className={styles.categoryBadgeInline} style={{ background: `${categoryColor}22`, color: categoryColor, borderColor: `${categoryColor}44` }}>
              {category}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className={styles.title}>{title}</h3>

        {/* Description */}
        <p className={styles.desc}>{shortDescription}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag"><Tag size={10} />{tag}</span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className={styles.meta}>
          <div className={styles.author}>
            <img src={avatarUrl} alt={authorName} className={styles.avatar} />
            <span className={styles.authorName}>{authorName}</span>
          </div>
          <div className={styles.stats}>
            <span className={styles.stat}><MessageSquare size={13} />{commentCount}</span>
            <span className={styles.stat}><Calendar size={13} />{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className={styles.footer}>
        <Link to={`/ideas/${_id}`} className={`btn btn-primary btn-sm ${styles.viewBtn}`} id={`view-idea-${_id}`}>
          View Details <ArrowRight size={14} />
        </Link>
        {showBookmark && onBookmark && (
          <button
            onClick={() => onBookmark(_id)}
            className={`${styles.bookmarkBtn} ${isBookmarked ? styles.bookmarked : ''}`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            id={`bookmark-${_id}`}
          >
            <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
    </div>
  )
}

export default IdeaCard
