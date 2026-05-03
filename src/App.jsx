import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import GeneratedClips from './pages/GeneratedClips.jsx'
import Analytics from './pages/Analytics.jsx'
import Pricing from './pages/Pricing.jsx'
import Settings from './pages/Settings.jsx'
import Signup from './pages/Signup.jsx'
import Signin from './pages/Signin.jsx'
import Sidebar from './components/Sidebar.jsx'
import MobileNav from './components/MobileNav.jsx'
import { useState, useEffect } from 'react'

// Protected Route wrapper
function ProtectedRoute() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: '#0d0d0d'
      }}>
        <div style={{ color: '#fff' }}>Loading...</div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/signin" replace />
  }
  
  return <Outlet />
}

// Layout component for authenticated pages
// Layout component for authenticated pages
function AppLayout() {
  const { user } = useAuth()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Only show Sidebar on desktop */}
      {!isMobile && <Sidebar />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Only show MobileNav on mobile */}
        {isMobile && <MobileNav />}
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider> {/* Add LanguageProvider here */}
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/pricing-landing" element={<Landing />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              
              {/* Protected routes - uncomment the ProtectedRoute wrapper */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/clips" element={<GeneratedClips />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>
              
              {/* Redirect any unknown routes */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}