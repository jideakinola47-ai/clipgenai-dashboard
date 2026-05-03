// GeneratedClips.jsx
import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

const API_BASE_URL = 'https://web-production-189e9.up.railway.app';

function Score({ score }) {
  const { isDark } = useTheme()
  const s = parseFloat(score) * 10 || 0
  const color = s >= 85 ? '#22c55e' : s >= 70 ? '#f59e0b' : '#f87171'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, height: 4, background: isDark ? '#333' : '#e8e5e0', borderRadius: 2 }}>
        <div style={{ width: `${s}%`, height: '100%', background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 28 }}>{score}</span>
    </div>
  )
}

function FullscreenPlayer({ clip, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.95)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }} onClick={onClose}>
      <video
        src={clip.clip_url}
        controls
        autoPlay
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          borderRadius: 8,
        }}
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: 'rgba(0,0,0,0.7)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 40,
          height: 40,
          fontSize: 20,
          cursor: 'pointer',
        }}
      >
        ✕
      </button>
    </div>
  );
}

function VideoRow({ video, clips, onOpenCarousel }) {
  const { isDark } = useTheme();
  const [showAll, setShowAll] = useState(false);
  const displayClips = showAll ? clips : clips.slice(0, 4);
  
  const theme = {
    text: isDark ? '#fff' : '#0a0a0a',
    textMuted: isDark ? '#888' : '#666',
    border: isDark ? '#1f1f1f' : '#e8e5e0',
    cardBg: isDark ? '#111' : '#ffffff',
  }

  return (
    <div style={{ 
      marginBottom: 32,
      background: theme.cardBg,
      borderRadius: 16,
      border: `1px solid ${theme.border}`,
      overflow: 'hidden',
    }}>
      {/* Video Header */}
      <div style={{ 
        padding: '16px 20px',
        borderBottom: `1px solid ${theme.border}`,
        background: isDark ? '#0a0a0a' : '#fafaf8',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.text, margin: 0, marginBottom: 4 }}>
              🎬 {video.title || `Video ${video.id}`}
            </h3>
            <p style={{ fontSize: 12, color: theme.textMuted, margin: 0 }}>
              {clips.length} clips generated • {new Date(video.uploaded_at).toLocaleDateString()}
            </p>
          </div>
          {clips.length > 4 && (
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                background: 'transparent',
                border: `1px solid ${theme.border}`,
                color: theme.textMuted,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = isDark ? '#1a1a1a' : '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
            >
              {showAll ? 'Show Less ↑' : `Show All (${clips.length}) ↓`}
            </button>
          )}
        </div>
      </div>
      
      {/* Clips Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: 12,
        padding: '16px',
      }}>
        {displayClips.map((clip, index) => (
          <div
            key={clip.id || index}
            onClick={() => onOpenCarousel(clips, index)}
            style={{
              background: isDark ? '#1a1a1a' : '#f5f5f5',
              borderRadius: 12,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Thumbnail */}
            <div style={{
              position: 'relative',
              aspectRatio: '9/16',
              background: isDark ? '#0d0d0d' : '#e8e5e0',
              overflow: 'hidden',
            }}>
              <video
                src={clip.clip_url}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                muted
              />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(91,76,245,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 16,
              }}>▶</div>
              {clip.clip_duration && (
                <div style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 4,
                }}>
                  {Math.round(clip.clip_duration / 1000)}s
                </div>
              )}
            </div>
            
            {/* Clip Info */}
            <div style={{ padding: '10px' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: theme.text, marginBottom: 6, lineHeight: 1.3 }}>
                {clip.title || `Clip ${index + 1}`}
              </div>
              {clip.viral_score && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 9, color: theme.textMuted, marginBottom: 2, letterSpacing: '0.5px' }}>VIRAL SCORE</div>
                  <Score score={parseFloat(clip.viral_score)} />
                </div>
              )}
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <a
                  href={clip.clip_url}
                  download
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    flex: 1,
                    padding: '5px',
                    borderRadius: 6,
                    background: 'linear-gradient(135deg, #5b4cf5, #8b5cf6)',
                    color: '#fff',
                    fontSize: 10,
                    textAlign: 'center',
                    textDecoration: 'none',
                  }}
                >
                  Download
                </a>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoCarousel({ clips, currentClipIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(currentClipIndex);
  const [fullscreenClip, setFullscreenClip] = useState(null);
  const { isDark } = useTheme();

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % clips.length);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + clips.length) % clips.length);
  };

  const currentClip = clips[currentIndex];

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isDark ? '#0d0d0d' : '#f8f7f5',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: `1px solid ${isDark ? '#1f1f1f' : '#e8e5e0'}`,
        }}>
          <h3 style={{ margin: 0, color: isDark ? '#fff' : '#0a0a0a' }}>
            Clip {currentIndex + 1} of {clips.length}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: isDark ? '#fff' : '#0a0a0a',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <button
            onClick={prevSlide}
            style={{
              position: 'absolute',
              left: 20,
              background: 'rgba(0,0,0,0.5)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 50,
              height: 50,
              fontSize: 24,
              cursor: 'pointer',
              zIndex: 1,
            }}
          >
            ←
          </button>

          <div style={{ textAlign: 'center', maxWidth: '80%' }}>
            <video
              src={currentClip.clip_url}
              controls
              autoPlay
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                borderRadius: 8,
              }}
            />
            <div style={{ marginTop: 20, padding: '0 20px' }}>
              <h4 style={{ color: isDark ? '#fff' : '#0a0a0a', marginBottom: 10 }}>
                {currentClip.title || `Clip ${currentIndex + 1}`}
              </h4>
              {currentClip.transcript && (
                <p style={{ color: isDark ? '#888' : '#666', fontSize: 14 }}>
                  "{currentClip.transcript}"
                </p>
              )}
              {currentClip.viral_score && (
                <div style={{ marginTop: 10 }}>
                  <Score score={parseFloat(currentClip.viral_score)} />
                </div>
              )}
              <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button
                  onClick={() => setFullscreenClip(currentClip)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #5b4cf5, #8b5cf6)',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Full Screen
                </button>
                <a
                  href={currentClip.clip_url}
                  download
                  style={{
                    padding: '10px 20px',
                    borderRadius: 8,
                    background: isDark ? '#1a1a1a' : '#f0f0f0',
                    color: isDark ? '#fff' : '#0a0a0a',
                    textDecoration: 'none',
                    border: `1px solid ${isDark ? '#1f1f1f' : '#e8e5e0'}`,
                  }}
                >
                  Download
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={nextSlide}
            style={{
              position: 'absolute',
              right: 20,
              background: 'rgba(0,0,0,0.5)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 50,
              height: 50,
              fontSize: 24,
              cursor: 'pointer',
              zIndex: 1,
            }}
          >
            →
          </button>
        </div>

        <div style={{
          padding: '16px',
          borderTop: `1px solid ${isDark ? '#1f1f1f' : '#e8e5e0'}`,
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
        }}>
          {clips.map((clip, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: 60,
                height: 106,
                background: isDark ? '#1a1a1a' : '#f0f0f0',
                borderRadius: 6,
                cursor: 'pointer',
                border: idx === currentIndex ? '2px solid #5b4cf5' : 'none',
                overflow: 'hidden',
              }}
            >
              <video
                src={clip.clip_url}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                muted
              />
            </div>
          ))}
        </div>
      </div>
      {fullscreenClip && (
        <FullscreenPlayer clip={fullscreenClip} onClose={() => setFullscreenClip(null)} />
      )}
    </>
  );
}

export default function GeneratedClips() {
  const { isDark } = useTheme();
  const { getAuthHeader, isAuthenticated } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCarousel, setShowCarousel] = useState(false);
  const [currentVideoClips, setCurrentVideoClips] = useState([]);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  
  const theme = {
    bg: isDark ? '#0d0d0d' : '#f8f7f5',
    text: isDark ? '#fff' : '#0a0a0a',
    textMuted: isDark ? '#888' : '#666',
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchVideosAndClips();
    }
  }, [isAuthenticated]);

  const fetchVideosAndClips = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/my-videos`, {
        headers: getAuthHeader(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      
      const data = await response.json();
      console.log('Fetched videos:', data);
      
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openCarousel = (clips, startIndex) => {
    setCurrentVideoClips(clips);
    setCurrentClipIndex(startIndex);
    setShowCarousel(true);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px 24px', background: theme.bg, minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: theme.text }}>Loading your clips...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px 24px', background: theme.bg, minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: '#f87171' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Error loading clips</div>
          <div style={{ fontSize: 13 }}>{error}</div>
          <button
            onClick={fetchVideosAndClips}
            style={{
              marginTop: 16,
              padding: '8px 16px',
              borderRadius: 8,
              background: '#5b4cf5',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div style={{ padding: '40px 24px', background: theme.bg, minHeight: '100vh' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 8 }}>My Clips</h1>
        <p style={{ color: theme.textMuted, fontSize: 13.5, marginBottom: 40 }}>Your AI-generated clips will appear here.</p>
        <div style={{ border: `2px dashed ${isDark ? '#333' : '#e8e5e0'}`, borderRadius: 14, padding: '60px 24px', textAlign: 'center', color: theme.textMuted }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✂</div>
          <div style={{ fontSize: 15, fontWeight: 500, color: theme.textMuted }}>No clips yet</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Upload a video from the Dashboard to generate clips</div>
        </div>
      </div>
    );
  }

  const totalClips = videos.reduce((total, v) => total + v.clips.length, 0);

  return (
    <>
      <div style={{ padding: '24px', background: theme.bg, minHeight: '100vh' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 4 }}>My Clips</h1>
          <p style={{ color: theme.textMuted, fontSize: 13.5 }}>
            {totalClips} clips across {videos.length} video{videos.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {videos.map((video) => (
          <VideoRow
            key={video.id}
            video={video}
            clips={video.clips}
            onOpenCarousel={openCarousel}
          />
        ))}
      </div>
      
      {showCarousel && (
        <VideoCarousel
          clips={currentVideoClips}
          currentClipIndex={currentClipIndex}
          onClose={() => setShowCarousel(false)}
        />
      )}
    </>
  );
}