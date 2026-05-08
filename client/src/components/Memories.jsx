import { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Memories.css';
import { MEMORIES } from '../data/memories';

const PASTEL_BG = [
  'var(--pastel-yellow)', 'var(--pastel-coral)', 'var(--pastel-mint)',
  'var(--pastel-lavender)', 'var(--pastel-sky)',
];

const STICKY_MESSAGES = [
  { message: "3 years went by like 3 seconds. Will miss every chai break and every debug session. ☕", author: "— Aarav", color: "#FFE066" },
  { message: "Remember that time the server crashed right before the demo? We fixed it in 2 minutes. Legends. 💪", author: "— Ananya", color: "#FFD6D6" },
  { message: "To the best batch ever — you made even 8 AM lectures worth waking up for. Almost.", author: "— Arjun", color: "#D6FFF0" },
  { message: "This batch taught me that code is better when written together. 💻❤️", author: "— Diya", color: "#EDD6FF" },
  { message: "I'll carry these memories in my cache — they'll never be cleared. 🧠", author: "— Ethan", color: "#D6F0FF" },
  { message: "From 'Hello World' to 'Goodbye College' — what a journey. 🚀", author: "— Fatima", color: "#FFE8D6" },
  { message: "The WiFi was slow, but the friendships were fast. Miss you all already.", author: "— Gautam", color: "#FFE066" },
  { message: "Best debugging partners anyone could ask for. You're all 200 OK in my book. ✅", author: "— Harsh", color: "#D6FFF0" },
  { message: "Every error was a lesson, every success was a celebration. Here's to us! 🥂", author: "— Isha", color: "#FFD6D6" },
  { message: "Keep pushing commits, keep pushing forward. The world isn't ready for us. 🌍", author: "— Jay", color: "#EDD6FF" },
  { message: "No amount of git revert can undo these memories. And I wouldn't want to. 🖤", author: "— Kavya", color: "#D6F0FF" },
  { message: "To the staff who believed in us before we believed in ourselves — thank you. 🙏", author: "— Lakshya", color: "#FFE8D6" },
];

const WASHI_COLORS = ['var(--yellow)', 'var(--coral)', 'var(--mint)', 'var(--lavender)', 'var(--sky)'];

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
        // Static video card — no <video> element = no network request in filmstrip
        <div className="filmstrip-video-thumb">
          <span className="filmstrip-video-icon">▶</span>
          <span className="filmstrip-video-label">{m.title}</span>
        </div>
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
            {STICKY_MESSAGES.map((note, i) => (
              <div key={i} className="sticky-note" style={{ background: note.color, transform: `rotate(${((i * 7) % 11) - 5}deg)` }}>
                {i % 3 === 0 && <div className="sticky-note-tape" style={{ background: WASHI_COLORS[i % WASHI_COLORS.length] }} />}
                <p className="sticky-note-message">{note.message}</p>
                <p className="sticky-note-author">{note.author}</p>
              </div>
            ))}
          </div>
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
