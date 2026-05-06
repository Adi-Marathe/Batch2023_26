import { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Students from './components/Students';
import Staff from './components/Staff';
import Memories from './components/Memories';
import Footer from './components/Footer';
import StudentProfile from './components/StudentProfile';
import StaffProfile from './components/StaffProfile';
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

  const handleLoaderFinish = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <div className="app">
      {loading && <Loader onFinish={handleLoaderFinish} />}

      {!loading && (
        <div className="app-content">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/student/:id" element={<StudentProfile />} />
            <Route path="/staff/:id" element={<StaffProfile />} />
          </Routes>
        </div>
      )}
    </div>
  );
}
