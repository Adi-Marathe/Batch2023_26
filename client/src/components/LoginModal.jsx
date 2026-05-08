import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { IoCloseOutline } from 'react-icons/io5';
import './LoginModal.css';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!enrollmentNo || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentNo, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEnrollmentNo', enrollmentNo);
        toast.success(data.message);
        onLoginSuccess(enrollmentNo);
        onClose();
        setEnrollmentNo('');
        setPassword('');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Connection error. Is the server running?');
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
          >
            <button className="login-modal-close" onClick={onClose}>
              <IoCloseOutline />
            </button>
            
            <div className="login-modal-header">
              <h2>Unlock Memories</h2>
              <p>Squad members only. Enter your credentials.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Enrollment No</label>
                <input
                  type="text"
                  value={enrollmentNo}
                  onChange={(e) => setEnrollmentNo(e.target.value)}
                  placeholder="e.g. 23511690910"
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              
              <button 
                type="submit" 
                className={`login-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Unlocking...' : 'Unlock Squad Access'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
