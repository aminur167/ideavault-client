import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../api/axiosInstance'
import IdeaCard from '../components/IdeaCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { Search, Filter, Calendar, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './IdeasPage.module.css'

const CATEGORIES = ['All', 'Tech', 'Health', 'AI', 'Education', 'Finance', 'Environment', 'Food', 'Travel', 'Entertainment', 'Other']

const IdeasPage = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)
  const [userBookmarks, setUserBookmarks] = useState([])

  // Debounced search query
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, category, startDate, endDate])

  // Sync URL query params
  useEffect(() => {
    const params = {}
    if (debouncedSearch) params.search = debouncedSearch
    if (category !== 'All') params.category = category
    setSearchParams(params)
  }, [debouncedSearch, category, setSearchParams])

  // Fetch ideas from server
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['ideas', debouncedSearch, category, startDate, endDate, page],
    queryFn: async () => {
      const res = await axiosInstance.get('/ideas', {
        params: { search: debouncedSearch, category, startDate, endDate, page, limit: 9 }
      })
      return res.data
    }
  })

  // Fetch bookmarks if logged in
  useEffect(() => {
    if (user) {
      axiosInstance.get('/interactions/bookmarks')
        .then(r => setUserBookmarks(r.data.map(i => i._id)))
        .catch(() => {})
    }
  }, [user])

  const handleBookmarkToggle = async (ideaId) => {
    if (!user) {
      toast.error('Please login to bookmark ideas')
      return
    }
    try {
      const res = await axiosInstance.post(`/ideas/${ideaId}/bookmark`)
      if (res.data.bookmarked) {
        setUserBookmarks(prev => [...prev, ideaId])
        toast.success('Idea bookmarked!')
      } else {
        setUserBookmarks(prev => prev.filter(id => id !== ideaId))
        toast.success('Bookmark removed')
      }
    } catch {
      toast.error('Failed to update bookmark')
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setCategory('All')
    setStartDate('')
    setEndDate('')
    setPage(1)
  }

  const hasActiveFilters = searchTerm || category !== 'All' || startDate || endDate

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <h1 className="section-title">Explore Startup Ideas</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto' }}>
            Discover innovative concepts, filter by category, and validate ideas from global creators.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className={styles.filterCard}>
          <div className={styles.searchWrap}>
            <Search size={18} className={styles.searchIcon} />
            <input
              id="search-ideas-input"
              type="text"
              className={`form-control ${styles.searchInput}`}
              placeholder="Search by idea title..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className={styles.clearSearch} onClick={() => setSearchTerm('')}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className={styles.filtersRow}>
            {/* Category Dropdown */}
            <div className={styles.filterGroup}>
              <Filter size={15} className={styles.filterIcon} />
              <select
                id="category-filter-select"
                className={`form-control ${styles.selectControl}`}
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className={styles.dateGroup}>
              <div className={styles.filterGroup}>
                <Calendar size={15} className={styles.filterIcon} />
                <input
                  type="date"
                  className={`form-control ${styles.dateControl}`}
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  placeholder="From date"
                />
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>to</span>
              <div className={styles.filterGroup}>
                <input
                  type="date"
                  className={`form-control ${styles.dateControl}`}
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  placeholder="To date"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                <X size={14} /> Clear Filters
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className={styles.chipsRow}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.chip} ${category === cat ? styles.chipActive : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className={styles.resultsMeta}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{data?.ideas?.length || 0}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{data?.total || 0}</strong> ideas
          </p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <LoadingSpinner />
        ) : data?.ideas?.length > 0 ? (
          <div className="grid-3">
            {data.ideas.map(idea => (
              <IdeaCard
                key={idea._id}
                idea={idea}
                showBookmark={true}
                isBookmarked={userBookmarks.includes(idea._id)}
                onBookmark={handleBookmarkToggle}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No ideas found</h3>
            <p>Try adjusting your search query or filters to find what you're looking for.</p>
            {hasActiveFilters && (
              <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={clearFilters}>
                Reset All Filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {data?.totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className="btn btn-ghost btn-sm"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <span className={styles.pageInfo}>
              Page {page} of {data.totalPages}
            </span>

            <button
              className="btn btn-ghost btn-sm"
              disabled={page >= data.totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default IdeasPage
