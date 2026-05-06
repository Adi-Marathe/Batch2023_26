import { useState, useEffect, useRef } from 'react';
import { IoCloseOutline, IoAddOutline, IoRemoveOutline } from 'react-icons/io5';
import './Memories.css';

// Memory items — each has a title and an optional photo URL
// When photo is empty, it shows a placeholder with an "add photo" icon
const MEMORIES = [
  { id: 1,  title: 'First day of class ✨',        photo: '' },
  { id: 2,  title: 'Lab session madness 💻',        photo: '' },
  { id: 3,  title: 'Annual day vibes 🎭',           photo: '' },
  { id: 4,  title: 'Canteen chronicles 🍕',         photo: '' },
  { id: 5,  title: 'Project submission night 🌙',   photo: '' },
  { id: 6,  title: 'Sports day glory 🏆',           photo: '' },
  { id: 7,  title: 'Cultural fest 🎶',              photo: '' },
  { id: 8,  title: 'Library hangouts 📚',           photo: '' },
  { id: 9,  title: 'Farewell prep 🎓',              photo: '' },
  { id: 10, title: 'Random selfie time 📸',         photo: '' },
  { id: 11, title: 'Coding marathon 🖥️',           photo: '' },
  { id: 12, title: 'Group project chaos 🤝',        photo: '' },
  { id: 13, title: 'Teacher appreciation day 🌻',   photo: '' },
  { id: 14, title: 'Exam night cramming 📝',        photo: '' },
  { id: 15, title: 'Classroom laughs 😂',           photo: '' },
  { id: 16, title: 'Workshop vibes 🛠️',            photo: '' },
  { id: 17, title: 'Batch photo 📷',                photo: '' },
  { id: 18, title: 'Last day feels 🥺',             photo: '' },
  { id: 19, title: 'Award ceremony 🏅',             photo: '' },
  { id: 20, title: 'Best friends forever 💜',       photo: '' },
];

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

export default function Memories() {
  const [lightbox, setLightbox] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [bannerVisible, setBannerVisible] = useState(false);
  const bannerRef = useRef(null);

  // Duplicate for infinite scroll
  const row1 = [...MEMORIES.slice(0, 10), ...MEMORIES.slice(0, 10)];
  const row2 = [...MEMORIES.slice(10, 20), ...MEMORIES.slice(10, 20)];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setBannerVisible(true);
      },
      { threshold: 0.5 }
    );
    if (bannerRef.current) observer.observe(bannerRef.current);
    return () => observer.disconnect();
  }, []);

  const openLightbox = (memory) => {
    setZoom(1);
    setLightbox(memory);
  };

  const closeLightbox = () => {
    setLightbox(null);
    setZoom(1);
  };

  const zoomIn = (e) => { e.stopPropagation(); setZoom(z => Math.min(z + 0.5, 4)); };
  const zoomOut = (e) => { e.stopPropagation(); setZoom(z => Math.max(z - 0.5, 0.5)); };

  // Confetti for banner
  const bannerConfetti = Array.from({ length: 30 }, (_, i) => ({
    width: `${6 + Math.random() * 8}px`,
    height: `${6 + Math.random() * 8}px`,
    background: ['var(--yellow)', 'var(--coral)', 'var(--mint)', 'var(--lavender)', 'var(--sky)'][i % 5],
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    '--tx': `${(Math.random() - 0.5) * 200}px`,
    '--ty': `${(Math.random() - 0.5) * 200}px`,
    animationDelay: `${i * 0.05}s`,
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
  }));

  return (
    <section className="memories" id="memories">
      <div className="memories-header">
        <h2 className="memories-title">
          Flashbacks <span className="memories-filmstrip-icon">📸</span>
        </h2>
      </div>

      {/* Filmstrip rows */}
      <div className="filmstrip-container">
        <div className="filmstrip-row filmstrip-row-1">
          {row1.map((memory, i) => (
            <div
              key={`r1-${i}`}
              className="filmstrip-item"
              onClick={() => openLightbox(memory)}
            >
              {memory.photo ? (
                <img src={memory.photo} alt={memory.title} className="filmstrip-item-img" />
              ) : (
                <div className="filmstrip-item-placeholder" style={{ background: PASTEL_BG[i % 5] }}>
                  <span className="filmstrip-item-placeholder-icon">📷</span>
                  <span className="filmstrip-item-placeholder-text">{memory.title}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="filmstrip-row filmstrip-row-2">
          {row2.map((memory, i) => (
            <div
              key={`r2-${i}`}
              className="filmstrip-item"
              onClick={() => openLightbox(memory)}
            >
              {memory.photo ? (
                <img src={memory.photo} alt={memory.title} className="filmstrip-item-img" />
              ) : (
                <div className="filmstrip-item-placeholder" style={{ background: PASTEL_BG[(i + 2) % 5] }}>
                  <span className="filmstrip-item-placeholder-icon">📷</span>
                  <span className="filmstrip-item-placeholder-text">{memory.title}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox with zoom */}
      {lightbox && (
        <div className="memories-lightbox" onClick={closeLightbox}>
          <div className="memories-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}><IoCloseOutline /></button>
            <div className="lightbox-image-container">
              {lightbox.photo ? (
                <img
                  src={lightbox.photo}
                  alt={lightbox.title}
                  className="lightbox-image"
                  style={{ transform: `scale(${zoom})` }}
                />
              ) : (
                <div
                  className="lightbox-placeholder"
                  style={{ transform: `scale(${zoom})` }}
                >
                  <span className="lightbox-placeholder-icon">📷</span>
                  <span className="lightbox-placeholder-text">Photo coming soon!</span>
                </div>
              )}
            </div>
            <div className="lightbox-bottom">
              <p className="lightbox-title">{lightbox.title}</p>
              <div className="lightbox-zoom-controls">
                <button className="lightbox-zoom-btn" onClick={zoomOut}><IoRemoveOutline /></button>
                <span className="lightbox-zoom-level">{Math.round(zoom * 100)}%</span>
                <button className="lightbox-zoom-btn" onClick={zoomIn}><IoAddOutline /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Wall */}
      <div className="message-wall">
        <h3 className="message-wall-title">💌 Message Wall</h3>
        <div className="sticky-notes-grid">
          {STICKY_MESSAGES.map((note, i) => {
            const rotation = ((i * 7) % 11) - 5;
            const hasWashi = i % 3 === 0;
            return (
              <div
                key={i}
                className="sticky-note"
                style={{
                  background: note.color,
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                {hasWashi && (
                  <div
                    className="sticky-note-tape"
                    style={{ background: WASHI_COLORS[i % WASHI_COLORS.length] }}
                  />
                )}
                <p className="sticky-note-message">{note.message}</p>
                <p className="sticky-note-author">{note.author}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* End banner */}
      <div className="memories-banner" ref={bannerRef}>
        <div className="memories-banner-text">
          It's been real. 🖤
          {bannerVisible && (
            <div className="memories-banner-confetti">
              {bannerConfetti.map((style, i) => (
                <div key={i} className="banner-confetti-piece" style={style} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
