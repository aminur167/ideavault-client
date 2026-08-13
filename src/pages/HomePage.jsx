import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../api/axiosInstance'
import IdeaCard from '../components/IdeaCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import { Rocket, TrendingUp, Users, MessageSquare, Lightbulb, ArrowRight, Zap, Globe, Shield, ChevronRight } from 'lucide-react'
import heroCollaboration from '../assets/hero-collaboration.jpg'
import heroFeedback from '../assets/hero-feedback.jpg'
import heroCommunity from '../assets/hero-community.jpg'
import styles from './HomePage.module.css'

const SLIDES = [
  {
    tag: 'Innovation Hub',
    title: 'Turn Your Ideas Into Reality',
    subtitle: 'Share your startup vision with a global community of innovators, get feedback, and validate your concept before building.',
    cta: 'Explore Ideas',
    href: '/ideas',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
    image: heroCollaboration,
  },
  {
    tag: 'Community Driven',
    title: 'Collaborate With Founders Worldwide',
    subtitle: 'Connect with entrepreneurs, get expert feedback on your ideas, and discover the next unicorn startup before it launches.',
    cta: 'Share Your Idea',
    href: '/add-idea',
    gradient: 'linear-gradient(135deg, #059669 0%, #0891b2 100%)',
    image: heroFeedback,
  },
  {
    tag: 'Validate & Grow',
    title: 'Ideas That Change The World Start Here',
    subtitle: 'From AI to healthcare, education to sustainability — find trending ideas, engage in discussions, and be part of tomorrow\'s success stories.',
    cta: 'Get Started',
    href: '/register',
    gradient: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
    image: heroCommunity,
  },
]

const CATEGORIES = [
  { name: 'Tech', icon: '💻', color: '#7c3aed', count: '120+' },
  { name: 'AI', icon: '🤖', color: '#06b6d4', count: '85+' },
  { name: 'Health', icon: '🏥', color: '#10b981', count: '60+' },
  { name: 'Education', icon: '📚', color: '#f59e0b', count: '45+' },
  { name: 'Finance', icon: '💰', color: '#3b82f6', count: '38+' },
  { name: 'Environment', icon: '🌿', color: '#22c55e', count: '32+' },
]

const HOW_IT_WORKS = [
  { step: '01', icon: <Lightbulb size={28} />, title: 'Share Your Idea', desc: 'Submit your startup concept with details, problem statement, and proposed solution.' },
  { step: '02', icon: <MessageSquare size={28} />, title: 'Get Feedback', desc: 'Community members comment, discuss, and help refine your concept.' },
  { step: '03', icon: <Rocket size={28} />, title: 'Validate & Launch', desc: 'Use community insights to validate your idea and build with confidence.' },
]

const HomePage = () => {
  const { data: trending = [], isLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: () => axiosInstance.get('/ideas/trending').then(r => r.data),
  })
  const { data: stats } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: () => axiosInstance.get('/stats').then(r => r.data),
  })
  const platformStats = [
    { value: stats?.ideaCount ?? '—', label: 'Ideas Shared', icon: <Lightbulb size={22} /> },
    { value: stats?.creatorCount ?? '—', label: 'Community Members', icon: <Users size={22} /> },
    { value: stats?.commentCount ?? '—', label: 'Comments & Feedback', icon: <MessageSquare size={22} /> },
  ]

  return (
    <div className={styles.page}>
      {/* ===== HERO BANNER ===== */}
      <section className={styles.hero}>
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className={styles.swiper}
        >
          {SLIDES.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className={styles.slide}>
                <div className={styles.slideBg} style={{ background: slide.gradient }} />
                <div className={styles.slideOverlay} />
                <div className={styles.slideImg} style={{ backgroundImage: `url(${slide.image})` }} />
                <div className="container">
                  <div className={styles.slideContent}>
                    <span className={styles.slideTag}>{slide.tag}</span>
                    <h1 className={styles.slideTitle}>{slide.title}</h1>
                    <p className={styles.slideSubtitle}>{slide.subtitle}</p>
                    <div className={styles.slideCtas}>
                      <Link to={slide.href} className={`btn btn-primary btn-lg ${styles.heroCta}`}>
                        {slide.cta} <ArrowRight size={18} />
                      </Link>
                      <Link to="/ideas" className={`btn btn-ghost btn-lg`}>
                        Browse Ideas
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className={styles.statsBar}>
        <div className="container">
          <div className={styles.statsGrid}>
            {platformStats.map((s, i) => (
              <div key={i} className={styles.statItem}>
                <div className={styles.statIcon}>{s.icon}</div>
                <div>
                  <div className={styles.statValue}>{s.value}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRENDING IDEAS ===== */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <div className={styles.sectionBadge}><TrendingUp size={14} /> Trending Now</div>
              <h2 className="section-title" style={{ textAlign: 'left', margin: 0 }}>Hot Ideas This Week</h2>
            </div>
            <Link to="/ideas" className="btn btn-outline">
              View All Ideas <ChevronRight size={16} />
            </Link>
          </div>
          {isLoading ? <LoadingSpinner /> : (
            <div className="grid-3">
              {trending.map(idea => <IdeaCard key={idea._id} idea={idea} />)}
            </div>
          )}
          {!isLoading && trending.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">💡</div>
              <h3>No ideas yet</h3>
              <p>Be the first to share your startup idea!</p>
              <Link to="/add-idea" className="btn btn-primary" style={{ marginTop: '1rem' }}>Share First Idea</Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className={`section ${styles.howSection}`}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className={styles.sectionBadge} style={{ margin: '0 auto 1rem' }}><Zap size={14} /> Simple Process</div>
            <h2 className="section-title">How IdeaVault Works</h2>
            <p className="section-subtitle" style={{ margin: 0 }}>Three simple steps to share your vision and connect with the community</p>
          </div>
          <div className={styles.stepsGrid}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className={styles.stepCard}>
                <div className={styles.stepNumber}>{step.step}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && <div className={styles.stepArrow}><ArrowRight size={20} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className={styles.sectionBadge} style={{ margin: '0 auto 1rem' }}><Globe size={14} /> All Sectors</div>
            <h2 className="section-title">Explore by Category</h2>
            <p className="section-subtitle" style={{ margin: 0 }}>From cutting-edge tech to sustainable solutions — ideas across every industry</p>
          </div>
          <div className={styles.categoriesGrid}>
            {CATEGORIES.map((cat, i) => (
              <Link key={i} to={`/ideas?category=${cat.name}`} className={styles.catCard}
                style={{ '--cat-color': cat.color }}>
                <span className={styles.catEmoji}>{cat.icon}</span>
                <h3 className={styles.catName}>{cat.name}</h3>
                <span className={styles.catCount}>{cat.count} ideas</span>
                <div className={styles.catGlow} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <div className={styles.ctaGlow} />
            <Shield size={40} className={styles.ctaIcon} />
            <h2 className={styles.ctaTitle}>Ready to Share Your Big Idea?</h2>
            <p className={styles.ctaSubtitle}>
              Join thousands of innovators who are already sharing, validating, and refining their startup ideas on IdeaVault.
            </p>
            <div className={styles.ctaBtns}>
              <Link to="/register" className="btn btn-primary btn-lg">Get Started Free <ArrowRight size={18} /></Link>
              <Link to="/ideas" className="btn btn-ghost btn-lg">Explore Ideas</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
