import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MEMORIES } from '../data/memories';
import { toast } from 'react-hot-toast';
import './MediaViewer.css';

// Thumbnail — videos shown as play-icon div, NOT a <video> element (huge bandwidth saving)
const ThumbItem = memo(function ThumbItem({ m, i, idx, goToThumb }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '50px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleClick = useCallback(() => goToThumb(i), [goToThumb, i]);

  return (
    <button
      ref={ref}
      className={'mv-th' + (i === idx ? ' mv-th-active' : '')}
      onClick={handleClick}
    >
      {inView ? (
        m.type === 'video' ? (
          <div className="mv-th-video">▶</div>
        ) : m.media ? (
          <img src={m.media} alt="" loading="lazy" decoding="async" />
        ) : (
          <span>📷</span>
        )
      ) : (
        <span style={{ opacity: 0.2 }}>📷</span>
      )}
    </button>
  );
});

export default function MediaViewer() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ── All hooks must be called unconditionally ──
  const idx = useMemo(() => {
    const found = MEMORIES.findIndex((m) => m.id === parseInt(id, 10));
    return found !== -1 ? found : 0;
  }, [id]);

  const vidRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [zoom, setZoom] = useState(1);

  const item = MEMORIES[idx];
  const isVid = item?.type === 'video';

  // Reset state when media changes
  useEffect(() => {
    setZoom(1);
    setPlaying(false);
  }, [idx]);

  const closeViewer = useCallback(() => navigate('/#memories'), [navigate]);

  const prev = useCallback(() => {
    const newIdx = (idx - 1 + MEMORIES.length) % MEMORIES.length;
    navigate(`/flashback/${MEMORIES[newIdx].id}`);
  }, [idx, navigate]);

  const next = useCallback(() => {
    const newIdx = (idx + 1) % MEMORIES.length;
    navigate(`/flashback/${MEMORIES[newIdx].id}`);
  }, [idx, navigate]);

  const goToThumb = useCallback((i) => {
    navigate(`/flashback/${MEMORIES[i].id}`);
  }, [navigate]);

  // Keyboard navigation — dep array prevents re-attaching on every render
  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [closeViewer, prev, next]);

  const togglePlay = useCallback(() => {
    if (!vidRef.current) return;
    playing ? vidRef.current.pause() : vidRef.current.play();
    setPlaying((p) => !p);
  }, [playing]);

  const toggleMute = useCallback(() => {
    if (!vidRef.current) return;
    vidRef.current.muted = !muted;
    setMuted((m) => !m);
  }, [muted]);



  // ── Empty state (after all hooks) ──
  if (MEMORIES.length === 0) {
    return (
      <div className="mv-overlay">
        <div className="mv-topbar">
          <button className="mv-back" onClick={() => navigate('/#memories')}>← Back to Home</button>
        </div>
        <div className="mv-body" style={{ color: 'white', flexDirection: 'column', gap: '1rem' }}>
          <h3>No memories found</h3>
          <p>Start by adding new fresh things! ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mv-overlay">
      {/* TOP BAR */}
      <div className="mv-topbar">
        <button className="mv-back" onClick={closeViewer}>← Back to Flashbacks</button>
        <span className="mv-title">{item.title}</span>
        <div className="mv-actions">
          {item.media && !isVid && (
            <>
              <button className="mv-act" onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}>−</button>
              <span className="mv-zoom-val" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</span>
              <button className="mv-act" onClick={() => setZoom((z) => Math.min(z + 0.25, 4))}>+</button>
            </>
          )}
          {item.media && isVid && (
            <>
              <button className="mv-act" onClick={togglePlay}>{playing ? '⏸' : '▶'}</button>
              <button className="mv-act" onClick={toggleMute}>{muted ? '🔇' : '🔊'}</button>
            </>
          )}

          <span className="mv-counter">{idx + 1}/{MEMORIES.length}</span>
        </div>
      </div>

      {/* MEDIA AREA */}
      <div className="mv-body">
        <button className="mv-arrow mv-arrow-l" onClick={prev}>‹</button>

        <div
          className="mv-stage"
          onContextMenu={(e) => {
            e.preventDefault();
            toast.error('Saving & Inspect are disabled!');
          }}
          onDragStart={(e) => e.preventDefault()}
        >
          {item.media && !isVid && (
            <img
              src={item.media}
              alt={item.title}
              className="mv-img"
              style={{ transform: `scale(${zoom})`, pointerEvents: 'auto', userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
              draggable={false}
            />
          )}
          {item.media && isVid && (
            <video
              ref={vidRef}
              src={item.media}
              className="mv-vid"
              controls
              controlsList="nodownload"
              autoPlay
              onClick={togglePlay}
              onEnded={() => setPlaying(false)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              style={{ pointerEvents: 'auto', WebkitTouchCallout: 'none' }}
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

      {/* THUMBNAIL STRIP */}
      <div className="mv-thumbs">
        {MEMORIES.map((m, i) => (
          <ThumbItem key={m.id} m={m} i={i} idx={idx} goToThumb={goToThumb} />
        ))}
      </div>
    </div>
  );
}
