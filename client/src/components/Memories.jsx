import { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './Memories.css';
import { MEMORIES } from '../data/memories';
import students from '../data/students';

const PASTEL_BG = [
  'var(--pastel-yellow)', 'var(--pastel-coral)', 'var(--pastel-mint)',
  'var(--pastel-lavender)', 'var(--pastel-sky)',
];

const WASHI_COLORS = ['var(--yellow)', 'var(--coral)', 'var(--mint)', 'var(--lavender)', 'var(--sky)'];
const NOTE_COLORS = ["#FFE066", "#FFD6D6", "#D6FFF0", "#EDD6FF", "#D6F0FF", "#FFE8D6"];

// ── Memoized Filmstrip Item ──
// Videos show a static thumbnail (NO autoPlay) to save bandwidth.
// Images use native lazy loading via the browser.
const FilmstripItem = memo(({ m, openViewer, bg }) => {
  const [isInView, setIsInView] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '100px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleClick = useCallback(() => openViewer(m.id), [openViewer, m.id]);

  return (
    <div ref={itemRef} className="filmstrip-item" onClick={handleClick}>
      {!isInView ? (
        <div className="filmstrip-item-placeholder" style={{ background: bg }}>
          <span className="filmstrip-item-placeholder-icon">📷</span>
          <span className="filmstrip-item-placeholder-text">{m.title}</span>
        </div>
      ) : m.type === 'video' ? (
        // preload="none" = no download until in-view; autoPlay only when visible
        <video
          src={m.media}
          className="filmstrip-item-img"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        />
      ) : m.media ? (
        <img
          src={m.media}
          alt={m.title}
          className="filmstrip-item-img"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="filmstrip-item-placeholder" style={{ background: bg }}>
          <span className="filmstrip-item-placeholder-icon">📷</span>
          <span className="filmstrip-item-placeholder-text">{m.title}</span>
        </div>
      )}
    </div>
  );
});
FilmstripItem.displayName = 'FilmstripItem';

export default function Memories() {
  const navigate = useNavigate();
  const [bannerVisible, setBannerVisible] = useState(false);
  const bannerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUserEnrollmentNo = localStorage.getItem('userEnrollmentNo');
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch all messages on mount (visible to everyone, including guests)
  useEffect(() => {
    fetch(`${API_URL}/api/wall`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch(err => console.error('Failed to fetch wall messages:', err));
  }, [API_URL]);

  const handleStickIt = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const enrollmentNo = localStorage.getItem('userEnrollmentNo');

    if (!token || !enrollmentNo) {
      toast.error('Only logged in users can stick messages!');
      return;
    }

    if (!newMessageText.trim()) return;

    const user = students.find(s => s.enrollmentNo === enrollmentNo);
    let authorName = 'Unknown';
    if (user && user.name) {
      const nameParts = user.name.split(' ').filter(Boolean);
      authorName = nameParts.length > 1 
        ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}` 
        : nameParts[0] || 'Unknown';
    }

    const randomColor = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/wall`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: newMessageText,
          authorName,
          color: randomColor,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessages(prev => [data.data, ...prev]);
        setNewMessageText('');
        toast.success('Message stuck to the wall!');
      } else {
        toast.error(data.message || 'Failed to post message');
      }
    } catch (err) {
      toast.error('Something went wrong. Try again!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/wall/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessages(prev => prev.filter(msg => msg._id !== id));
        toast.success('Message removed from the wall!');
      } else {
        toast.error(data.message || 'Failed to delete message');
      }
    } catch (err) {
      toast.error('Something went wrong. Try again!');
    }
  };

  // Memoize rows so they aren't recomputed every render
  const [row1, row2] = useMemo(() => {
    const half = Math.ceil(MEMORIES.length / 2);
    return [
      [...MEMORIES.slice(0, half), ...MEMORIES.slice(0, half)],
      [...MEMORIES.slice(half), ...MEMORIES.slice(half)],
    ];
  }, []);

  // Memoize confetti so random values are stable across renders
  const confetti = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      width: `${6 + Math.random() * 8}px`,
      height: `${6 + Math.random() * 8}px`,
      background: ['var(--yellow)', 'var(--coral)', 'var(--mint)', 'var(--lavender)', 'var(--sky)'][i % 5],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      '--tx': `${(Math.random() - 0.5) * 200}px`,
      '--ty': `${(Math.random() - 0.5) * 200}px`,
      animationDelay: `${i * 0.05}s`,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
    }))
  , []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setBannerVisible(true); },
      { threshold: 0.5 }
    );
    if (bannerRef.current) obs.observe(bannerRef.current);
    return () => obs.disconnect();
  }, []);

  // Stable callback reference so FilmstripItems don't re-render unnecessarily
  const openViewer = useCallback((memoryId) => {
    navigate(`/flashback/${memoryId}`);
  }, [navigate]);

  return (
    <>
      <section className="memories" id="memories">
        <div className="memories-header">
          <h2 className="memories-title">
            Flashbacks <span className="memories-filmstrip-icon">📸</span>
          </h2>
        </div>

        <div className="filmstrip-container">
          <div className="filmstrip-row filmstrip-row-1">
            {row1.map((m, i) => (
              <FilmstripItem
                key={`r1-${i}-${m.id}`}
                m={m}
                openViewer={openViewer}
                bg={PASTEL_BG[i % PASTEL_BG.length]}
              />
            ))}
          </div>
          <div className="filmstrip-row filmstrip-row-2">
            {row2.map((m, i) => (
              <FilmstripItem
                key={`r2-${i}-${m.id}`}
                m={m}
                openViewer={openViewer}
                bg={PASTEL_BG[(i + 2) % PASTEL_BG.length]}
              />
            ))}
          </div>
        </div>

        {/* Message Wall */}
        <div className="message-wall">
          <h3 className="message-wall-title">💌 Message Wall</h3>
          
          <div className="sticky-notes-grid">
            {messages.map((note, i) => (
              <div key={note._id || i} className="sticky-note" style={{ background: note.color, transform: `rotate(${((i * 7) % 11) - 5}deg)` }}>
                {i % 3 === 0 && <div className="sticky-note-tape" style={{ background: WASHI_COLORS[i % WASHI_COLORS.length] }} />}
                
                {note.enrollmentNo === currentUserEnrollmentNo && (
                  <button 
                    className="delete-note-btn" 
                    onClick={() => handleDeleteMessage(note._id)}
                    title="Remove your message"
                  >
                    ×
                  </button>
                )}
                
                <p className="sticky-note-message">{note.message}</p>
                <p className="sticky-note-author">— {note.authorName}</p>
              </div>
            ))}
          </div>

          <form className="message-wall-form" onSubmit={handleStickIt}>
            <div className="message-wall-input-header">
              {newMessageText.length} / 300 characters
            </div>
            <textarea
              className="message-wall-input"
              placeholder="Write a memory or message..."
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              rows={3}
              maxLength={300}
              required
            />
            <button type="submit" className="message-wall-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sticking...' : 'Stick it'}
            </button>
          </form>
        </div>

        <div className="memories-banner" ref={bannerRef}>
          <div className="memories-banner-text">
            It's been real. 🖤
            {bannerVisible && (
              <div className="memories-banner-confetti">
                {confetti.map((s, i) => <div key={i} className="banner-confetti-piece" style={s} />)}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
