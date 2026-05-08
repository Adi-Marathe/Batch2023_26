import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { IoCloseOutline } from 'react-icons/io5';
import './LoginModal.css'; // Reusing LoginModal styles for the overlay and card

export default function EditProfileModal({ isOpen, onClose, student, profileData, onSaveSuccess }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    dob: '',
    city: '',
    coreMemory: '',
    currentStatus: '',
    dream: '',
    emojis: ''
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        dob: profileData?.dob || '',
        city: profileData?.city || student?.city || '',
        coreMemory: profileData?.coreMemory || '',
        currentStatus: profileData?.currentStatus || '',
        dream: profileData?.dream || student?.dream || '',
        emojis: profileData?.emojis || ''
      });
    }
  }, [isOpen, profileData, student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Emoji Validation
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

    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/students/${student.enrollmentNo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Profile updated successfully!');
        onSaveSuccess(data.profile);
        onClose();
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch (err) {
      toast.error('Connection error.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="login-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className="login-modal"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{ 
              maxWidth: '500px', 
              maxHeight: '90vh', 
              padding: 0, 
              overflow: 'hidden', 
              display: 'flex', 
              flexDirection: 'column' 
            }}
          >
            <button 
              className="login-modal-close" 
              onClick={onClose} 
              type="button" 
              style={{ zIndex: 10, top: '1rem', right: '1rem', background: 'var(--bg)' }}
            >
              <IoCloseOutline />
            </button>
            
            <div className="hide-scrollbar" style={{ overflowY: 'auto', padding: '2.5rem', flex: 1 }}>
              <div className="login-modal-header" style={{ marginBottom: '1.5rem' }}>
                <h2>Edit Profile</h2>
                <p>Update your Scrapbook details</p>
              </div>
              
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Date of Birth</label>
                  <input
                    type="text"
                    maxLength={20}
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    placeholder="e.g. 15 Dec 2004"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Hometown</label>
                  <input
                    type="text"
                    maxLength={30}
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="e.g. Mumbai"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Core Memory</label>
                  <textarea
                    maxLength={500}
                    rows={3}
                    value={formData.coreMemory}
                    onChange={(e) => setFormData({...formData, coreMemory: e.target.value})}
                    placeholder="Describe your favorite memory from these 3 years..."
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '2px solid var(--ink)', fontFamily: 'inherit', resize: 'vertical' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Current Status</label>
                  <textarea
                    maxLength={300}
                    rows={2}
                    value={formData.currentStatus}
                    onChange={(e) => setFormData({...formData, currentStatus: e.target.value})}
                    placeholder="What are you up to these days?"
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '2px solid var(--ink)', fontFamily: 'inherit', resize: 'vertical' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Dream</label>
                  <textarea
                    maxLength={300}
                    rows={2}
                    value={formData.dream}
                    onChange={(e) => setFormData({...formData, dream: e.target.value})}
                    placeholder="What's your ultimate goal?"
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '2px solid var(--ink)', fontFamily: 'inherit', resize: 'vertical' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>College Life in 3 Emojis</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={formData.emojis}
                    onChange={(e) => setFormData({...formData, emojis: e.target.value})}
                    placeholder="💻☕😴"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className={`login-btn ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
