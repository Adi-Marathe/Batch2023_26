import { useState, useEffect } from 'react';
import './Loader.css';

const TITLE = "Batch 2023–2026";

export default function Loader({ onFinish }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onFinish, 800);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`loader-overlay ${exiting ? 'exit' : ''}`}>
      <div className="loader-title">
        {TITLE.split('').map((char, i) => (
          <span
            key={i}
            className="loader-letter"
            style={{ animationDelay: `${i * 0.055}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>

      <p className="loader-subtitle">Flipping through the scrapbook...</p>

      <div className="loader-dots">
        <span className="loader-dot" />
        <span className="loader-dot" />
        <span className="loader-dot" />
        <span className="loader-dot" />
        <span className="loader-dot" />
      </div>
    </div>
  );
}
