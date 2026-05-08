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

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
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
