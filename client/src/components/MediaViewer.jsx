import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MEMORIES } from '../data/memories';
import { toast } from 'react-hot-toast';
import './MediaViewer.css';

export default function MediaViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find current index based on URL
  const currentIndex = MEMORIES.findIndex((m) => m.id === parseInt(id, 10));
  const idx = currentIndex !== -1 ? currentIndex : 0;
  
  const vidRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [zoom, setZoom] = useState(1);
  const isLoggedIn = !!localStorage.getItem('token');

  const item = MEMORIES[idx];
  const isVid = item?.type === 'video';

  // Reset on slide change
  useEffect(() => {
    setZoom(1);
    setPlaying(false);
  }, [idx]);

  // Keys
  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  });

  const closeViewer = () => {
    navigate('/#memories'); // Navigate back to the flashbacks section on home page
  };

  const prev = () => {
    const newIdx = (idx - 1 + MEMORIES.length) % MEMORIES.length;
    navigate(`/flashback/${MEMORIES[newIdx].id}`);
  };
  
  const next = () => {
    const newIdx = (idx + 1) % MEMORIES.length;
    navigate(`/flashback/${MEMORIES[newIdx].id}`);
  };
  
  const goToThumb = (i) => {
    navigate(`/flashback/${MEMORIES[i].id}`);
  };

  const togglePlay = () => {
    if (!vidRef.current) return;
    playing ? vidRef.current.pause() : vidRef.current.play();
    setPlaying(!playing);
  };

  const download = async () => {
    if (!item.media) return;
    if (!isLoggedIn) {
      toast('Login to save this memory! 📸', { icon: '🔒' });
      return;
    }
    
    try {
      toast.loading('Downloading memory...', { id: 'dl' });
      const r = await fetch(item.media);
      const b = await r.blob();
      const u = URL.createObjectURL(b);
      const a = document.createElement('a');
      a.href = u;
      a.download = item.title.replace(/[^a-z0-9]/gi, '_') + (isVid ? '.mp4' : '.png');
      a.click();
      URL.revokeObjectURL(u);
      toast.success('Memory saved successfully! 🎉', { id: 'dl' });
    } catch { 
      window.open(item.media, '_blank'); 
      toast.success('Opened media in new tab! 🎉', { id: 'dl' });
    }
  };

  return (
    <div className="mv-overlay">
      {/* TOP BAR */}
      <div className="mv-topbar">
        <button className="mv-back" onClick={closeViewer}>
          ← Back to Flashbacks
        </button>
        <span className="mv-title">{item.title}</span>
        <div className="mv-actions">
          {item.media && !isVid && (
            <>
              <button className="mv-act" onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}>−</button>
              <span className="mv-zoom-val" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</span>
              <button className="mv-act" onClick={() => setZoom(z => Math.min(z + 0.25, 4))}>+</button>
            </>
          )}
          {item.media && isVid && (
            <>
              <button className="mv-act" onClick={togglePlay}>{playing ? '⏸' : '▶'}</button>
              <button className="mv-act" onClick={() => { if(vidRef.current) { vidRef.current.muted = !muted; setMuted(!muted); } }}>
                {muted ? '🔇' : '🔊'}
              </button>
            </>
          )}
          {item.media && <button className="mv-act mv-dl" onClick={download}>⬇ Download</button>}
          <span className="mv-counter">{idx + 1}/{MEMORIES.length}</span>
        </div>
      </div>

      {/* MEDIA AREA */}
      <div className="mv-body">
        <button className="mv-arrow mv-arrow-l" onClick={prev}>‹</button>

        <div 
          className="mv-stage" 
          onContextMenu={(e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              toast.error('Inspect/Save disabled for guests!');
            }
          }}
          onDragStart={(e) => {
            if (!isLoggedIn) e.preventDefault();
          }}
        >
          {item.media && !isVid && (
            <img
              src={item.media}
              alt={item.title}
              className="mv-img"
              style={{ 
                transform: `scale(${zoom})`, 
                pointerEvents: isLoggedIn ? 'auto' : 'none',
                userSelect: 'none'
              }}
              draggable={false}
            />
          )}
          {item.media && isVid && (
            <video
              ref={vidRef}
              src={item.media}
              className="mv-vid"
              controls
              controlsList={isLoggedIn ? "" : "nodownload"}
              autoPlay
              onClick={togglePlay}
              onEnded={() => setPlaying(false)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              style={{
                pointerEvents: isLoggedIn ? 'auto' : 'none'
              }}
            />
          )}
          {!item.media && (
            <div className="mv-empty">
              <span style={{ fontSize: '4rem' }}>📷</span>
              <span>Photo coming soon</span>
              <span style={{ opacity: 0.5 }}>{item.title}</span>
            </div>
          )}
        </div>

        <button className="mv-arrow mv-arrow-r" onClick={next}>›</button>
      </div>

      {/* THUMBNAILS */}
      <div className="mv-thumbs">
        {MEMORIES.map((m, i) => (
          <button
            key={m.id}
            className={'mv-th' + (i === idx ? ' mv-th-active' : '')}
            onClick={() => goToThumb(i)}
          >
            {m.media && m.type === 'video' ? (
              <video src={m.media} muted playsInline />
            ) : m.media ? (
              <img src={m.media} alt="" />
            ) : (
              <span>📷</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
