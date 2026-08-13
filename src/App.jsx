import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivateRoute from './routes/PrivateRoute'
import LoadingSpinner from './components/LoadingSpinner'
const HomePage = lazy(() => import('./pages/HomePage'))
const IdeasPage = lazy(() => import('./pages/IdeasPage'))
const IdeaDetailsPage = lazy(() => import('./pages/IdeaDetailsPage'))
const AddIdeaPage = lazy(() => import('./pages/AddIdeaPage'))
const MyIdeasPage = lazy(() => import('./pages/MyIdeasPage'))
const MyInteractionsPage = lazy(() => import('./pages/MyInteractionsPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const pageTitles = {
  '/': 'IdeaVault – Startup Idea Sharing Platform',
  '/ideas': 'Explore Ideas – IdeaVault',
  '/add-idea': 'Share Your Idea – IdeaVault',
  '/my-ideas': 'My Ideas – IdeaVault',
  '/my-interactions': 'My Interactions – IdeaVault',
  '/profile': 'Profile – IdeaVault',
  '/login': 'Login – IdeaVault',
  '/register': 'Register – IdeaVault',
}

function App() {
  const location = useLocation()

  useEffect(() => {
    const title = pageTitles[location.pathname] || 'IdeaVault'
    document.title = title
  }, [location.pathname])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/ideas/:id" element={<PrivateRoute><IdeaDetailsPage /></PrivateRoute>} />
          <Route path="/add-idea" element={<PrivateRoute><AddIdeaPage /></PrivateRoute>} />
          <Route path="/my-ideas" element={<PrivateRoute><MyIdeasPage /></PrivateRoute>} />
          <Route path="/my-interactions" element={<PrivateRoute><MyInteractionsPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App
