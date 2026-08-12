import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivateRoute from './routes/PrivateRoute'
import HomePage from './pages/HomePage'
import IdeasPage from './pages/IdeasPage'
import IdeaDetailsPage from './pages/IdeaDetailsPage'
import AddIdeaPage from './pages/AddIdeaPage'
import MyIdeasPage from './pages/MyIdeasPage'
import MyInteractionsPage from './pages/MyInteractionsPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'

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
      </main>
      <Footer />
    </div>
  )
}

export default App
