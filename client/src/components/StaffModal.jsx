import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './StaffModal.css';

const MODAL_DOODLES = [
  { emoji: '🌟', top: '5%', left: '5%', delay: '0s' },
  { emoji: '📚', top: '85%', right: '8%', delay: '1s' },
  { emoji: '⭐', top: '10%', right: '12%', delay: '2s' },
  { emoji: '🎓', bottom: '10%', left: '10%', delay: '0.5s' },
];

export default function StaffModal({ staff, onClose }) {
  const [typedFields, setTypedFields] = useState([]);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const initials = staff.name.split(' ').filter(n => n.length > 2).map(n => n[0]).join('').slice(0, 2);

  const fields = [
    { label: '👨‍🏫 Name:', value: staff.name },
    { label: '🏅 Designation:', value: staff.designation },
    { label: '📚 Subject:', value: staff.subject },
    { label: '⚡ Known For:', value: staff.knownFor },
    { label: '💬 Best Advice:', value: `"${staff.advice}"` },
  ];

  // Typewriter
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
    }, 25);

    return () => clearInterval(interval);
  }, [currentFieldIndex]);

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
        className="staff-modal-overlay"
        onClick={handleOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="staff-modal"
          initial={{ scale: 0.7, opacity: 0, rotate: 3 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.7, opacity: 0, rotate: -3 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          {MODAL_DOODLES.map((d, i) => (
            <span key={i} className="staff-modal-doodle" style={{ ...d }}>
              {d.emoji}
            </span>
          ))}

          <button className="staff-modal-close" onClick={onClose}>✕</button>

          <div className="staff-modal-left">
            <div className="staff-modal-polaroid">
              <div className="staff-modal-photo">
                {staff.photo ? (
                  <img src={staff.photo} alt={staff.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span className="staff-modal-photo-initials">{initials}</span>
                )}
              </div>
            </div>
            <p className="staff-modal-photo-name">{staff.name}</p>
          </div>

          <div className="staff-modal-right">
            {typedFields.map((text, i) => (
              <div key={i} className="staff-modal-field">{text}</div>
            ))}
            {currentFieldIndex < fields.length && (
              <div className="staff-modal-field">
                {currentText}
                {showCursor && <span className="staff-typewriter-cursor" />}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
