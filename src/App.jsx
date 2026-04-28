import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import GeneratedClips from './pages/GeneratedClips.jsx'
import Projects from './pages/Projects.jsx'
import Analytics from './pages/Analytics.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [clips, setClips] = useState([])

  const pages = {
    dashboard: <Dashboard setClips={setClips} setPage={setPage} />,
    clips: <GeneratedClips clips={clips} />,
    projects: <Projects />,
    analytics: <Analytics />,
    settings: <Settings />,
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar page={page} setPage={setPage} />
      <main style={{ flex: 1, overflow: 'auto', background: '#f8f7f5' }}>
        {pages[page] || pages.dashboard}
      </main>
    </div>
  )
}
