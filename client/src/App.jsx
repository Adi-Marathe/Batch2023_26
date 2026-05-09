import { useState, useCallback, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Students from './components/Students';
import Staff from './components/Staff';
import Memories from './components/Memories';
import Footer from './components/Footer';
import StudentProfile from './components/StudentProfile';
import StaffProfile from './components/StaffProfile';
import MediaViewer from './components/MediaViewer';
import './App.css';

function HomePage() {
  return (
    <>
      <Hero />
      <Students />
      <Staff />
      <Memories />
      <Footer />
    </>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isSecurityActive, setIsSecurityActive] = useState(false);


  // Anti-inspect and right-click protection
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    
    const handleKeyDown = (e) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U') ||
        (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || // Mac
        (e.metaKey && e.key === 'U') // Mac
      ) {
        e.preventDefault();
      }
    };

    const activateSecurity = () => {
      setIsSecurityActive(true);
      document.body.classList.add('blur-mode');
      // Instant blackout for ultra security
      const content = document.querySelector('.app-content');
      if (content) content.style.visibility = 'hidden';
    };
    
    const deactivateSecurity = () => {
      setIsSecurityActive(false);
      document.body.classList.remove('blur-mode');
      const content = document.querySelector('.app-content');
      if (content) content.style.visibility = 'visible';
    };
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        activateSecurity();
      } else {
        deactivateSecurity();
      }
    };

    const handleBlur = () => {
      activateSecurity();
    };
    
    const handleFocus = () => {
      deactivateSecurity();
    };

    const handleMouseLeave = () => {
      activateSecurity();
    };
    
    const handleMouseEnter = () => {
      deactivateSecurity();
    };

    // Attempt to clear clipboard on PrintScreen
    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText(''); 
        activateSecurity();
        setTimeout(deactivateSecurity, 2000);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleLoaderFinish = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <Toaster 
        position="top-right" 
        containerStyle={{ zIndex: 999999 }}
      />
      <div className="app">
        {loading && <Loader onFinish={handleLoaderFinish} />}

        <div className={`security-overlay ${isSecurityActive ? 'active' : ''}`}>
          <div className="security-logo">🔒</div>
          <div className="security-text">
            <h2>Security Shield Active</h2>
            <p>Screenshot protection enabled to protect privacy.</p>
          </div>
        </div>

        {!loading && (
          <div className="app-content">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/student/:id" element={<StudentProfile />} />
              <Route path="/staff/:id" element={<StaffProfile />} />
              <Route path="/flashback/:id" element={<MediaViewer />} />
            </Routes>
          </div>
        )}
      </div>
    </>
  );
}
