import { useState } from 'react'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import GeneratedClips from './pages/GeneratedClips.jsx'
import Analytics from './pages/Analytics.jsx'
import Pricing from './pages/Pricing.jsx'
import Settings from './pages/Settings.jsx'
import Sidebar from './components/Sidebar.jsx'
import MobileNav from './components/MobileNav.jsx'

export default function App() {
  const [page, setPage] = useState('landing')
  const [clips, setClips] = useState([])

  if (page === 'landing' || page === 'pricing-landing') {
    return <Landing setPage={setPage} />
  }

  const pages = {
    dashboard: <Dashboard onClipsReady={(clips) => { setClips(clips); setPage('clips'); }} setPage={setPage} />,
    clips: <GeneratedClips clips={clips} />,
    analytics: <Analytics />,
    pricing: <Pricing setPage={setPage} />,
    settings: <Settings />,
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0d0d0d' }}>
      <Sidebar page={page} setPage={setPage} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <MobileNav page={page} setPage={setPage} />
        <main style={{ flex: 1, overflow: 'auto' }}>
          {pages[page] || pages.dashboard}
        </main>
      </div>
    </div>
  )
}
