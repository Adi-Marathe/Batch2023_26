import { IoLogoInstagram, IoLogoYoutube, IoLogoGithub, IoLogoTwitter } from 'react-icons/io5';
import './Footer.css';

const CHALK_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 6}s`,
  animationDuration: `${4 + Math.random() * 4}s`,
}));

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top-line" />

      <div className="footer-chalk-dust">
        {CHALK_PARTICLES.map((style, i) => (
          <div key={i} className="chalk-particle" style={style} />
        ))}
      </div>

      <div className="footer-inner">
        {/* Left: Brand */}
        <div className="footer-brand">
          <h3 className="footer-chalk-title">Batch 2023–2026 🎓</h3>
          <p className="footer-tagline">69 legends. 20 mentors. Infinite memories.</p>
        </div>

        {/* Center: Socials */}
        <div className="footer-socials">
          <a href="#" className="footer-social-link" aria-label="Instagram"><IoLogoInstagram /></a>
          <a href="#" className="footer-social-link" aria-label="YouTube"><IoLogoYoutube /></a>
          <a href="#" className="footer-social-link" aria-label="GitHub"><IoLogoGithub /></a>
          <a href="#" className="footer-social-link" aria-label="Twitter"><IoLogoTwitter /></a>
        </div>

        {/* Right: Credits */}
        <div className="footer-credits">
          <p className="footer-made-with">
            Made with <span className="heart">❤️</span> by the squad
          </p>
          <p className="footer-year">© 2023–2026 · All memories reserved</p>
        </div>
      </div>
    </footer>
  );
}
