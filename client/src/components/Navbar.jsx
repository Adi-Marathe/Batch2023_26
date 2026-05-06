import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoHomeOutline, IoPeopleOutline, IoSchoolOutline, IoCameraOutline } from 'react-icons/io5';
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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, item) => {
    e.preventDefault();
    setMenuOpen(false);

    // If we're on a profile page, navigate home first then scroll
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

  return (
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
      </div>
    </nav>
  );
}
