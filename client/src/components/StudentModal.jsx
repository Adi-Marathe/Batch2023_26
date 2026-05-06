import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './StudentModal.css';

const PASTEL_COLORS = [
  'var(--pastel-yellow)',
  'var(--pastel-coral)',
  'var(--pastel-mint)',
  'var(--pastel-lavender)',
  'var(--pastel-sky)',
];

const MODAL_DOODLES = [
  { emoji: '⭐', top: '5%', left: '5%', delay: '0s' },
  { emoji: '🖍️', top: '85%', right: '8%', delay: '1s' },
  { emoji: '💛', top: '10%', right: '15%', delay: '2s' },
  { emoji: '✏️', bottom: '10%', left: '10%', delay: '0.5s' },
];

export default function StudentModal({ student, onClose }) {
  const [typedFields, setTypedFields] = useState([]);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const bgColor = PASTEL_COLORS[student.id % PASTEL_COLORS.length];
  const initials = student.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  const fields = [
    { label: '✏️ Name:', value: student.name },
    { label: '📋 Roll No:', value: student.rollNo },
    { label: '🎂 DOB:', value: student.dob },
    { label: '📍 City:', value: student.city },
    { label: '💭 Quote:', value: `"${student.quote}"` },
    { label: '🎯 Dream:', value: student.dream },
  ];

  // Typewriter effect
  useEffect(() => {
    if (currentFieldIndex >= fields.length) {
      setShowCursor(false);
      return;
    }

    const field = fields[currentFieldIndex];
    const fullText = `${field.label} ${field.value}`;
    let charIndex = 0;

    const interval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setCurrentText(fullText.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(interval);
        setTypedFields(prev => [...prev, fullText]);
        setCurrentText('');
        setCurrentFieldIndex(prev => prev + 1);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [currentFieldIndex]);

  // Close on Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="student-modal-overlay"
        onClick={handleOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="student-modal"
          initial={{ scale: 0.7, opacity: 0, rotate: -3 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.7, opacity: 0, rotate: 3 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          {/* Floating doodles */}
          {MODAL_DOODLES.map((d, i) => (
            <span
              key={i}
              className="student-modal-doodle"
              style={{ ...d }}
            >
              {d.emoji}
            </span>
          ))}

          <button className="student-modal-close" onClick={onClose}>✕</button>

          {/* Left: Polaroid photo */}
          <div className="student-modal-left">
            <div className="student-modal-polaroid">
              <div className="student-modal-photo" style={{ background: bgColor }}>
                {student.photo ? (
                  <img src={student.photo} alt={student.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span className="student-modal-photo-initials">{initials}</span>
                )}
              </div>
            </div>
            <p className="student-modal-photo-name">{student.name}</p>
          </div>

          {/* Right: Typewriter info */}
          <div className="student-modal-right">
            {typedFields.map((text, i) => (
              <div key={i} className="student-modal-field">
                {text}
              </div>
            ))}
            {currentFieldIndex < fields.length && (
              <div className="student-modal-field">
                {currentText}
                {showCursor && <span className="typewriter-cursor" />}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
