import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoHomeOutline, IoPeopleOutline, IoSchoolOutline, IoCameraOutline, IoLogInOutline, IoLogOutOutline } from 'react-icons/io5';
import LoginModal from './LoginModal';
import { toast } from 'react-hot-toast';
import students from '../data/students';
import './Navbar.css';

const NAV_ITEMS = [
  { label: 'Home', icon: <IoHomeOutline />, href: '/', section: '#hero' },
  { label: 'Squad', icon: <IoPeopleOutline />, href: '/', section: '#students' },
  { label: 'Mentors', icon: <IoSchoolOutline />, href: '/', section: '#staff' },
  { label: 'Memories', icon: <IoCameraOutline />, href: '/', section: '#memories' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Check if logged in
    const token = localStorage.getItem('token');
    const enrollmentNo = localStorage.getItem('userEnrollmentNo');
    if (token && enrollmentNo) {
      setIsLoggedIn(true);
      const user = students.find(s => s.enrollmentNo === enrollmentNo);
      if (user) setLoggedInUser(user);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = (e, item) => {
    e.preventDefault();
    setMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector(item.section);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(item.section);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEnrollmentNo');
    setIsLoggedIn(false);
    setLoggedInUser(null);
    setProfileMenuOpen(false);
    toast.success('Logged out successfully');
  };

  const handleLoginSuccess = (enrollmentNo) => {
    setIsLoggedIn(true);
    const user = students.find(s => s.enrollmentNo === enrollmentNo);
    if (user) setLoggedInUser(user);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <IoSchoolOutline className="logo-icon" />
          <span>Batch 2023–26</span>
        </div>

        <div
          className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span /><span /><span />
        </div>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.section}
              className="navbar-link"
              href={item.section}
              onClick={(e) => handleLinkClick(e, item)}
            >
              <span className="navbar-link-icon">{item.icon}</span>
              {item.label}
            </a>
          ))}
          
          {isLoggedIn && loggedInUser ? (
            <div className="navbar-profile-container" ref={menuRef}>
              <div 
                className="navbar-profile-btn" 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                {loggedInUser.photo ? (
                  <img src={loggedInUser.photo} alt={loggedInUser.name} className="navbar-pfp" />
                ) : (
                  <div className="navbar-pfp-placeholder">
                    {loggedInUser.name.charAt(0)}
                  </div>
                )}
              </div>
              
              {profileMenuOpen && (
                <div className="navbar-profile-dropdown">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{loggedInUser.name}</p>
                    <p className="dropdown-roll">Roll No: {loggedInUser.rollNo}</p>
                  </div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <IoLogOutOutline /> Exit Squad
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="navbar-login-btn" onClick={() => { setMenuOpen(false); setLoginModalOpen(true); }}>
              <IoLogInOutline /> Unlock
            </button>
          )}
        </div>
      </nav>

      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </>
  );
}
