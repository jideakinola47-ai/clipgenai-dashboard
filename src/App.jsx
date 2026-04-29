import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import MobileNav from './components/MobileNav.jsx'
import Dashboard from './pages/Dashboard.jsx'
import GeneratedClips from './pages/GeneratedClips.jsx'
import Projects from './pages/Projects.jsx'
import Analytics from './pages/Analytics.jsx'
import Settings from './pages/Settings.jsx'
import Pricing from './pages/Pricing.jsx'
import Landing from './pages/Landing.jsx'

export default function App() {
  const [page, setPage] = useState('landing')
  const [clips, setClips] = useState([])
  const [dark, setDark] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (page === 'landing') return <Landing setPage={setPage} dark={dark} />

  const pages = {
    dashboard: <Dashboard setClips={setClips} setPage={setPage} dark={dark} />,
    clips: <GeneratedClips clips={clips} dark={dark} />,
    projects: <Projects dark={dark} />,
    analytics: <Analytics dark={dark} />,
    settings: <Settings dark={dark} />,
    pricing: <Pricing dark={dark} setPage={setPage} />,
  }

  const bg = dark ? '#0f0f0f' : '#f8f7f5'
  const sidebarBg = dark ? '#1a1a1a' : '#fff'
  const border = dark ? '#2a2a2a' : '#e8e5e0'

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: bg }}>
      {/* Desktop sidebar */}
      <div style={{ display: 'none' }} className="desktop-sidebar-hidden">
        {/* handled below with media query workaround */}
      </div>
      <Sidebar
        page={page} setPage={setPage}
        dark={dark} setDark={setDark}
        sidebarBg={sidebarBg} border={border}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main style={{
        flex: 1, overflow: 'auto', background: bg,
        color: dark ? '#e8e8e8' : '#1a1a1a',
        display: 'flex', flexDirection: 'column',
      }}>
        <MobileNav
          page={page} setPage={setPage}
          dark={dark} setDark={setDark}
          border={border} bg={sidebarBg}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <div style={{ flex: 1, overflow: 'auto' }}>
          {pages[page] || pages.dashboard}
        </div>
      </main>
    </div>
  )
}
