import { useState, useEffect, useRef } from 'react';
import './Hero.css';

const DOODLES = [
  { emoji: '⭐', top: '10%', left: '5%', delay: '0s' },
  { emoji: '💛', top: '20%', left: '85%', delay: '1s' },
  { emoji: '✏️', top: '60%', left: '8%', delay: '2s' },
  { emoji: '🎨', top: '75%', left: '90%', delay: '0.5s' },
  { emoji: '📖', top: '15%', left: '45%', delay: '3s' },
  { emoji: '🌟', top: '80%', left: '50%', delay: '1.5s' },
  { emoji: '💜', top: '40%', left: '92%', delay: '2.5s' },
  { emoji: '🖍️', top: '35%', left: '3%', delay: '1.2s' },
  { emoji: '🎵', top: '85%', left: '20%', delay: '0.8s' },
  { emoji: '🦋', top: '25%', left: '70%', delay: '3.5s' },
  { emoji: '✨', top: '50%', left: '15%', delay: '2.2s' },
  { emoji: '🌈', top: '65%', left: '75%', delay: '1.8s' },
];

const POLAROIDS = [
  { top: '8%', left: '3%', rotation: '-8deg', bg: 'linear-gradient(135deg, var(--pastel-coral), var(--pastel-yellow))' },
  { top: '15%', left: '78%', rotation: '5deg', bg: 'linear-gradient(135deg, var(--pastel-mint), var(--pastel-sky))' },
  { top: '55%', left: '2%', rotation: '12deg', bg: 'linear-gradient(135deg, var(--pastel-lavender), var(--pastel-coral))' },
  { top: '60%', left: '82%', rotation: '-6deg', bg: 'linear-gradient(135deg, var(--pastel-yellow), var(--pastel-mint))' },
  { top: '30%', left: '88%', rotation: '10deg', bg: 'linear-gradient(135deg, var(--pastel-sky), var(--pastel-lavender))' },
  { top: '70%', left: '10%', rotation: '-4deg', bg: 'linear-gradient(135deg, var(--pastel-coral), var(--pastel-mint))' },
];

const CONFETTI_COLORS = ['var(--yellow)', 'var(--coral)', 'var(--mint)', 'var(--lavender)', 'var(--sky)'];

const SUBTITLE_TEXT = "2023 – 2026 · 69 Legends";

const COUNTERS = [
  { target: 69, label: 'Students', suffix: '' },
  { target: 10, label: 'Staff', suffix: '' },
  { target: 3, label: 'Years', suffix: '' },
  { target: null, label: 'Memories', suffix: '∞' },
];

export default function Hero() {
  const [subtitle, setSubtitle] = useState('');
  const [counterValues, setCounterValues] = useState(COUNTERS.map(() => 0));
  const [counterVisible, setCounterVisible] = useState(false);
  const counterRef = useRef(null);

  // Typing effect for subtitle
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= SUBTITLE_TEXT.length) {
        setSubtitle(SUBTITLE_TEXT.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // IntersectionObserver for counters
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counterVisible) {
          setCounterVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, [counterVisible]);

  // Animate counter values
  useEffect(() => {
    if (!counterVisible) return;
    COUNTERS.forEach((counter, idx) => {
      if (counter.target === null) {
        setCounterValues(prev => {
          const next = [...prev];
          next[idx] = -1; // flag for infinity
          return next;
        });
        return;
      }
      let current = 0;
      const step = Math.ceil(counter.target / 40);
      const interval = setInterval(() => {
        current = Math.min(current + step, counter.target);
        setCounterValues(prev => {
          const next = [...prev];
          next[idx] = current;
          return next;
        });
        if (current >= counter.target) clearInterval(interval);
      }, 40);
    });
  }, [counterVisible]);

  // Generate confetti pieces
  const confettiPieces = Array.from({ length: 35 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    width: `${6 + Math.random() * 8}px`,
    height: `${6 + Math.random() * 8}px`,
    background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    animationDuration: `${4 + Math.random() * 6}s`,
    animationDelay: `${Math.random() * 5}s`,
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
    transform: `rotate(${Math.random() * 360}deg)`,
  }));

  return (
    <section className="hero" id="hero">
      {/* Background doodles */}
      <div className="hero-doodles">
        {DOODLES.map((d, i) => (
          <span
            key={i}
            className="hero-doodle"
            style={{
              top: d.top,
              left: d.left,
              animationDelay: d.delay,
              animationDuration: `${6 + i * 0.5}s`,
            }}
          >
            {d.emoji}
          </span>
        ))}
      </div>

      {/* Floating Polaroids */}
      <div className="hero-polaroids">
        {POLAROIDS.map((p, i) => (
          <div
            key={i}
            className="hero-polaroid"
            style={{
              top: p.top,
              left: p.left,
              '--rotation': p.rotation,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${10 + i * 2}s`,
            }}
          >
            <div
              className="hero-polaroid-inner"
              style={{ background: p.bg }}
            />
          </div>
        ))}
      </div>

      {/* Confetti */}
      <div className="hero-confetti">
        {confettiPieces.map((style, i) => (
          <div key={i} className="confetti-piece" style={style} />
        ))}
      </div>

      {/* Main content */}
      <div className="hero-content">
        <h1 className="hero-headline">
          <svg className="hero-headline-svg" viewBox="0 0 600 100" width="100%">
            <text x="50%" y="70" textAnchor="middle" fontSize="72">
              Our Batch 🎓
            </text>
          </svg>
        </h1>

        <p className="hero-subtitle">
          {subtitle}
          <span className="cursor" />
        </p>

        {/* Counters */}
        <div className="hero-counters" ref={counterRef}>
          {COUNTERS.map((counter, i) => (
            <div
              key={i}
              className={`hero-counter ${counterVisible ? 'bounce' : ''}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="hero-counter-number">
                {counterValues[i] === -1 ? '∞' : counterValues[i]}
              </div>
              <div className="hero-counter-label">{counter.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Wavy divider */}
      <div className="hero-divider">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path
            d="M0,30 C120,50 240,10 360,30 C480,50 600,10 720,30 C840,50 960,10 1080,30 C1200,50 1320,10 1440,30 L1440,60 L0,60 Z"
            fill="var(--bg)"
            stroke="var(--ink)"
            strokeWidth="2"
          />
        </svg>
      </div>
    </section>
  );
}
