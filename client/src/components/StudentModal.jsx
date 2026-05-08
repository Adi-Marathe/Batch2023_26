import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
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
  
  // Custom Profile Data
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [authTrigger, setAuthTrigger] = useState(0);

  useEffect(() => {
    const handleAuth = () => setAuthTrigger(prev => prev + 1);
    window.addEventListener('authChange', handleAuth);
    return () => window.removeEventListener('authChange', handleAuth);
  }, []);
  
  const loggedInUserEnrollmentNo = localStorage.getItem('userEnrollmentNo');
  const canEdit = loggedInUserEnrollmentNo === student.enrollmentNo;

  const [formData, setFormData] = useState({
    dob: '',
    city: '',
    coreMemory: '',
    currentStatus: '',
    dream: student.dream || '',
    emojis: ''
  });

  const bgColor = PASTEL_COLORS[student.id % PASTEL_COLORS.length];
  const initials = student.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  // Fetch profile
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/students/${student.enrollmentNo}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setProfileData(data);
          setFormData({
            dob: data.dob || '',
            city: data.city || student.city || '',
            coreMemory: data.coreMemory || '',
            currentStatus: data.currentStatus || '',
            dream: data.dream || student.dream || '',
            emojis: data.emojis || ''
          });
        }
      })
      .catch(err => console.error(err));
  }, [student.enrollmentNo]);

  // Derived fields to display
  const fields = [
    { label: '✏️ Name:', value: student.name },
    { label: '📋 Roll No:', value: student.rollNo },
    { label: '🎂 DOB:', value: profileData?.dob || 'Still calculating their age 🧮' },
    { label: '📍 Hometown:', value: profileData?.city || student.city || 'Lost in the wilderness 🏕️' },
    { label: '✨ Core Memory:', value: profileData?.coreMemory || 'Awaiting student\'s entry... ✨' },
    { label: '🚀 Status:', value: profileData?.currentStatus || 'Awaiting update... 🚀' },
    { label: '🎯 Dream:', value: profileData?.dream || student.dream || 'Awaiting update... 🎯' },
    { label: '🤪 3 Emojis:', value: profileData?.emojis || 'Awaiting update... 🤪' }
  ];

  // Typewriter effect
  useEffect(() => {
    if (isEditing) return;
    
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
  }, [currentFieldIndex, isEditing, fields]);

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

  const handleSave = async (e) => {
    e.preventDefault();

    if (formData.emojis) {
      if (/[a-zA-Z0-9]/.test(formData.emojis)) {
        toast.error('Only emojis allowed! No text. 🛑');
        return;
      }
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
      const segments = Array.from(segmenter.segment(formData.emojis.trim()));
      if (segments.length !== 3) {
        toast.error('Please enter EXACTLY 3 emojis! 🥺');
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/students/${student.enrollmentNo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setProfileData(data.profile);
        toast.success('Profile updated!');
        setIsEditing(false);
        setTypedFields([]);
        setCurrentFieldIndex(0);
        setCurrentText('');
        setShowCursor(true);
      } else {
        toast.error('Failed to update');
      }
    } catch (err) {
      toast.error('Connection error');
    } finally {
      setSaving(false);
    }
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
          {MODAL_DOODLES.map((d, i) => (
            <span key={i} className="student-modal-doodle" style={{ ...d }}>
              {d.emoji}
            </span>
          ))}

          <button className="student-modal-close" onClick={onClose}>✕</button>

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
            {canEdit && !isEditing && (
              <button className="student-modal-edit-btn" onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </button>
            )}
          </div>

          <div className="student-modal-right">
            {isEditing ? (
              <form className="student-modal-edit-form" onSubmit={handleSave}>
                <h3>Update Your Profile</h3>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="text" maxLength={20} placeholder="e.g. 15 Dec 2004" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Hometown</label>
                  <input type="text" maxLength={30} placeholder="e.g. Mumbai" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Core Memory</label>
                  <textarea 
                    maxLength={500} 
                    rows={3}
                    placeholder="Best moment..." 
                    value={formData.coreMemory} 
                    onChange={e => setFormData({...formData, coreMemory: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>Current Status</label>
                  <textarea 
                    maxLength={300} 
                    rows={2}
                    placeholder="e.g. Learning React" 
                    value={formData.currentStatus} 
                    onChange={e => setFormData({...formData, currentStatus: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>Dream</label>
                  <textarea 
                    maxLength={300} 
                    rows={2}
                    placeholder="Your dream..." 
                    value={formData.dream} 
                    onChange={e => setFormData({...formData, dream: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>College Life in 3 Emojis</label>
                  <input type="text" maxLength={10} placeholder="💻☕😴" value={formData.emojis} onChange={e => setFormData({...formData, emojis: e.target.value})} />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            ) : (
              <>
                {typedFields.map((text, i) => (
                  <div key={i} className="student-modal-field">{text}</div>
                ))}
                {currentFieldIndex < fields.length && (
                  <div className="student-modal-field">
                    {currentText}
                    {showCursor && <span className="typewriter-cursor" />}
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
