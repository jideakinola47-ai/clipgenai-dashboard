import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

const API_BASE_URL = 'https://web-production-189e9.up.railway.app';

export default function Analytics() {
  const { isDark } = useTheme()
  const { getAuthHeader } = useAuth()
  const [stats, setStats] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const theme = {
    bg: isDark ? '#0d0d0d' : '#f8f7f5',
    cardBg: isDark ? '#111' : '#ffffff',
    border: isDark ? '#1f1f1f' : '#e8e5e0',
    text: isDark ? '#fff' : '#0a0a0a',
    textMuted: isDark ? '#888' : '#666',
    accent: '#5b4cf5',
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch user stats
      const statsResponse = await fetch(`${API_BASE_URL}/stats`, {
        headers: getAuthHeader(),
      })
      
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch stats')
      }
      
      const statsData = await statsResponse.json()
      setStats(statsData)

      // Fetch all videos with their clips
      const videosResponse = await fetch(`${API_BASE_URL}/my-videos`, {
        headers: getAuthHeader(),
      })
      
      if (!videosResponse.ok) {
        throw new Error('Failed to fetch videos')
      }
      
      const videosData = await videosResponse.json()
      setVideos(videosData.videos || [])
      
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '24px', background: theme.bg, minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: theme.text }}>Loading analytics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '24px', background: theme.bg, minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: '#f87171' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Error loading analytics</div>
          <div style={{ fontSize: 13 }}>{error}</div>
          <button
            onClick={fetchAnalytics}
            style={{
              marginTop: 16,
              padding: '8px 16px',
              borderRadius: 8,
              background: theme.accent,
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const totalClips = stats?.usage?.total_clips_generated || 0
  const totalVideos = stats?.usage?.total_videos_uploaded || 0
  const videosThisMonth = stats?.usage?.videos_this_month || 0
  const monthlyLimit = stats?.usage?.monthly_limit || 10
  const remainingQuota = stats?.usage?.remaining_quota || 0

  // Calculate clips per video (real data)
  const avgClipsPerVideo = totalVideos > 0 ? (totalClips / totalVideos).toFixed(1) : 0

  // Prepare data for clips per video chart
  const clipsPerVideoData = videos.map(video => ({
    id: video.id,
    title: video.title || `Video ${video.id}`,
    clipsCount: video.clips?.length || 0,
    date: new Date(video.uploaded_at).toLocaleDateString(),
  })).sort((a, b) => b.clipsCount - a.clipsCount)

  const maxClipsPerVideo = Math.max(...clipsPerVideoData.map(v => v.clipsCount), 1)

  // Prepare monthly data from actual video upload dates
  const monthlyData = {}
  videos.forEach(video => {
    const date = new Date(video.uploaded_at)
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' })
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { videos: 0, clips: 0 }
    }
    monthlyData[monthYear].videos++
    monthlyData[monthYear].clips += video.clips?.length || 0
  })

  const months = Object.keys(monthlyData).slice(-6)
  const monthlyVideos = months.map(m => monthlyData[m].videos)
  const monthlyClips = months.map(m => monthlyData[m].clips)
  const maxMonthlyValue = Math.max(...[...monthlyVideos, ...monthlyClips], 1)

  // Get top performing clips (highest viral score)
  const allClips = videos.flatMap(video => 
    (video.clips || []).map(clip => ({
      ...clip,
      videoTitle: video.title || `Video ${video.id}`,
    }))
  ).sort((a, b) => (parseFloat(b.viral_score) || 0) - (parseFloat(a.viral_score) || 0))

  const topClips = allClips.slice(0, 5)

  return (
    <div style={{ padding: '24px', background: theme.bg, minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 4 }}>Analytics</h1>
        <p style={{ color: theme.textMuted, fontSize: 13.5 }}>
          Real performance metrics from your clips
        </p>
      </div>

      {/* Stats Cards - Only using real API data */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
        <div style={{ 
          background: theme.cardBg, 
          border: `1px solid ${theme.border}`, 
          borderRadius: 12, 
          padding: '20px',
          borderTop: '2px solid #5b4cf5',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: theme.text, marginBottom: 4 }}>{totalClips}</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: theme.textMuted, marginBottom: 2 }}>Total Clips Generated</div>
          <div style={{ fontSize: 11.5, color: theme.textMuted }}>From {totalVideos} videos</div>
        </div>

        <div style={{ 
          background: theme.cardBg, 
          border: `1px solid ${theme.border}`, 
          borderRadius: 12, 
          padding: '20px',
          borderTop: '2px solid #22c55e',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: theme.text, marginBottom: 4 }}>{videosThisMonth}</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: theme.textMuted, marginBottom: 2 }}>Videos This Month</div>
          <div style={{ fontSize: 11.5, color: theme.textMuted }}>Limit: {monthlyLimit}</div>
        </div>

        <div style={{ 
          background: theme.cardBg, 
          border: `1px solid ${theme.border}`, 
          borderRadius: 12, 
          padding: '20px',
          borderTop: '2px solid #f59e0b',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: theme.text, marginBottom: 4 }}>{avgClipsPerVideo}</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: theme.textMuted, marginBottom: 2 }}>Avg Clips Per Video</div>
          <div style={{ fontSize: 11.5, color: theme.textMuted }}>Across all your videos</div>
        </div>

        <div style={{ 
          background: theme.cardBg, 
          border: `1px solid ${theme.border}`, 
          borderRadius: 12, 
          padding: '20px',
          borderTop: '2px solid #ec4899',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: theme.text, marginBottom: 4 }}>{remainingQuota}</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: theme.textMuted, marginBottom: 2 }}>Remaining Quota</div>
          <div style={{ fontSize: 11.5, color: theme.textMuted }}>Videos left this month</div>
        </div>
      </div>

      {/* Monthly Activity Chart - Real data from upload dates */}
      {months.length > 0 && (
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 14, padding: '24px', marginBottom: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 600, color: theme.text, fontSize: 15, marginBottom: 4 }}>Monthly Activity</div>
            <div style={{ fontSize: 12, color: theme.textMuted }}>
              Videos uploaded and clips generated over time
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 250, marginBottom: 16 }}>
            {months.map((month, i) => (
              <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: '100%', display: 'flex', gap: 4, alignItems: 'flex-end', height: 180 }}>
                  {/* Videos bar */}
                  <div style={{ 
                    flex: 1,
                    height: `${(monthlyVideos[i] / maxMonthlyValue) * 100}%`,
                    background: '#5b4cf5',
                    borderRadius: '4px 4px 0 0',
                    position: 'relative',
                    minHeight: monthlyVideos[i] > 0 ? '4px' : '0',
                  }}>
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: 10,
                      color: theme.textMuted,
                      marginBottom: 4,
                      whiteSpace: 'nowrap',
                    }}>
                      {monthlyVideos[i]}
                    </div>
                  </div>
                  {/* Clips bar */}
                  <div style={{ 
                    flex: 1,
                    height: `${(monthlyClips[i] / maxMonthlyValue) * 100}%`,
                    background: '#a855f7',
                    borderRadius: '4px 4px 0 0',
                    position: 'relative',
                    minHeight: monthlyClips[i] > 0 ? '4px' : '0',
                  }}>
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: 10,
                      color: theme.textMuted,
                      marginBottom: 4,
                      whiteSpace: 'nowrap',
                    }}>
                      {monthlyClips[i]}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: theme.textMuted, textAlign: 'center' }}>{month}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, paddingTop: 16, borderTop: `1px solid ${theme.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, background: '#5b4cf5', borderRadius: 2 }} />
              <span style={{ fontSize: 12, color: theme.textMuted }}>Videos Uploaded</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, background: '#a855f7', borderRadius: 2 }} />
              <span style={{ fontSize: 12, color: theme.textMuted }}>Clips Generated</span>
            </div>
          </div>
        </div>
      )}

      {/* Clips Per Video Chart - Real data */}
      {clipsPerVideoData.length > 0 && (
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 14, padding: '24px', marginBottom: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 600, color: theme.text, fontSize: 15, marginBottom: 4 }}>Clips Per Video</div>
            <div style={{ fontSize: 12, color: theme.textMuted }}>
              How many clips each video generated
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {clipsPerVideoData.slice(0, 10).map((video, i) => (
              <div key={video.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: theme.textMuted, flex: 1 }}>{video.title}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>{video.clipsCount} clips</span>
                </div>
                <div style={{ width: '100%', height: 6, background: theme.border, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${(video.clipsCount / maxClipsPerVideo) * 100}%`, 
                    height: '100%', 
                    background: `linear-gradient(90deg, ${theme.accent}, #a855f7)`,
                    borderRadius: 3,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Performing Clips - Using viral_score from API */}
      {topClips.length > 0 && (
        <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 14, padding: '24px' }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 600, color: theme.text, fontSize: 15, marginBottom: 4 }}>Top Performing Clips</div>
            <div style={{ fontSize: 12, color: theme.textMuted }}>
              Highest viral score clips from your videos
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {topClips.map((clip, i) => (
              <div key={clip.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  background: `linear-gradient(135deg, ${theme.accent}, #a855f7)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: theme.text, marginBottom: 2 }}>
                    {clip.title || `Clip ${clip.id}`}
                  </div>
                  <div style={{ fontSize: 11, color: theme.textMuted }}>
                    From: {clip.videoTitle}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#f59e0b' }}>
                    {clip.viral_score}
                  </div>
                  <div style={{ fontSize: 10, color: theme.textMuted }}>Viral Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalClips === 0 && (
        <div style={{ 
          marginTop: 24, 
          padding: '48px 24px', 
          background: theme.cardBg, 
          border: `2px dashed ${theme.border}`, 
          borderRadius: 14, 
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: theme.text, marginBottom: 8 }}>No Analytics Data Yet</div>
          <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 20 }}>
            Upload and process your first video to see analytics and performance metrics
          </div>
          <button
            onClick={() => window.location.href = '/dashboard'}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              background: `linear-gradient(135deg, ${theme.accent}, #8b5cf6)`,
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  )
}