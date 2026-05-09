import { useState, useCallback, useEffect, useRef } from 'react';
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
  const shieldTimer = useRef(null);
  const shieldRef = useRef(null);

  useEffect(() => {
    // ── Shield Helpers (Direct DOM — bypasses React render cycle) ──
    // React setState takes ~16ms to re-render. Win+Shift+S captures BEFORE that.
    // Direct DOM manipulation is synchronous and instant.
    const showShield = () => {
      if (shieldRef.current) shieldRef.current.classList.add('active');
    };

    const hideShield = () => {
      if (shieldRef.current) shieldRef.current.classList.remove('active');
    };

    // Timed shield: show for N ms then auto-hide
    const flashShield = (ms = 2000) => {
      showShield();
      clearTimeout(shieldTimer.current);
      shieldTimer.current = setTimeout(hideShield, ms);
    };

    // On page load / refresh, make sure shield starts hidden
    hideShield();

    // ═══════════════════════════════════════════
    //  1. RIGHT-CLICK PROTECTION (all platforms)
    // ═══════════════════════════════════════════
    const onContextMenu = (e) => e.preventDefault();

    // ═══════════════════════════════════════════
    //  2. KEYBOARD PROTECTION (Windows / Mac)
    // ═══════════════════════════════════════════
    const onKeyDown = (e) => {
      const key = e.key?.toUpperCase();

      // PrintScreen (Windows)
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        e.stopPropagation();
        try { navigator.clipboard.writeText(''); } catch (_) {}
        flashShield(2000);
        return;
      }

      // F12 — DevTools
      if (e.key === 'F12') { e.preventDefault(); return; }

      // Ctrl/Cmd + Shift + I/J/C — DevTools
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I','J','C'].includes(key)) {
        e.preventDefault(); return;
      }

      // Ctrl/Cmd + U/S/P — View Source, Save, Print
      if ((e.ctrlKey || e.metaKey) && ['U','S','P'].includes(key)) {
        e.preventDefault(); return;
      }

      // Win+Shift+S — Windows Snipping Tool
      if (e.metaKey && e.shiftKey && key === 'S') {
        e.preventDefault();
        flashShield(2000);
        return;
      }

      // Win+G — Xbox Game Bar (Windows)
      if (e.metaKey && key === 'G') {
        e.preventDefault();
        flashShield(2000);
        return;
      }

      // Win+Alt+PrintScreen — Xbox Game Bar screenshot
      if (e.metaKey && e.altKey && e.key === 'PrintScreen') {
        e.preventDefault();
        try { navigator.clipboard.writeText(''); } catch (_) {}
        flashShield(2000);
        return;
      }

      // Cmd+Shift+3/4/5 — macOS screenshots
      if (e.metaKey && e.shiftKey && ['3','4','5'].includes(e.key)) {
        e.preventDefault();
        flashShield(2000);
        return;
      }
    };

    // PrintScreen key-up fallback — clear clipboard
    const onKeyUp = (e) => {
      if (e.key === 'PrintScreen') {
        try { navigator.clipboard.writeText(''); } catch (_) {}
        flashShield(2000);
      }
    };

    // ═══════════════════════════════════════════
    //  3. VISIBILITY CHANGE (all platforms)
    //  Fires on: tab switch, app switcher, 
    //  Vol+Power screenshot (Android/Nothing Phone),
    //  Side+Volume (iPhone), power button lock
    // ═══════════════════════════════════════════
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        showShield();
      } else {
        hideShield();
      }
    };

    // ═══════════════════════════════════════════
    //  4. WINDOW BLUR/FOCUS (Windows + Mac)
    //  Fires on: Snipping Tool, Alt+Tab, 
    //  Game Bar overlay, Spotlight search
    // ═══════════════════════════════════════════
    const onBlur = () => {
      // On mobile, scrolling can fire blur. Only show shield if page is truly not visible.
      setTimeout(() => {
        if (document.visibilityState === 'hidden') showShield();
      }, 100);
    };
    const onFocus = () => hideShield();

    // ═══════════════════════════════════════════
    //  5. PAGE HIDE/SHOW (iOS Safari specific)
    //  More reliable than visibilitychange on
    //  older Safari versions and PWAs
    // ═══════════════════════════════════════════
    const onPageHide = () => showShield();
    const onPageShow = (e) => {
      // Always hide shield when page becomes visible again (refresh / bfcache restore)
      hideShield();
    };

    // ═══════════════════════════════════════════
    //  6. MULTI-FINGER TOUCH (Nothing Phone, 
    //  Xiaomi, OnePlus, Samsung — 3-finger swipe)
    // ═══════════════════════════════════════════
    let multiTouchActive = false;
    const onTouchStart = (e) => {
      if (e.touches.length >= 3) {
        multiTouchActive = true;
        showShield();
      }
    };

    const onTouchEnd = () => {
      if (multiTouchActive) {
        clearTimeout(shieldTimer.current);
        shieldTimer.current = setTimeout(() => {
          multiTouchActive = false;
          hideShield();
        }, 2500);
      }
    };

    // ═══════════════════════════════════════════
    //  7. TOUCH CANCEL (iOS specific)
    //  Fires when iOS system gesture takes over,
    //  e.g. screenshot, Control Center swipe,
    //  AssistiveTouch screenshot action
    // ═══════════════════════════════════════════
    const onTouchCancel = () => {
      flashShield(2500);
    };

    // ═══════════════════════════════════════════
    //  8. RESIZE DETECTION (iOS screenshot thumbnail)
    //  When iOS takes a screenshot, the thumbnail
    //  preview shrinks the viewport briefly.
    //  Also catches Android split-screen attempts.
    // ═══════════════════════════════════════════
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const widthDelta = Math.abs(w - lastWidth);
      const heightDelta = Math.abs(h - lastHeight);
      // Only trigger if WIDTH actually changed — ignore height-only changes
      // Mobile browsers change height when address bar hides/shows during scroll
      if (widthDelta > 0 && widthDelta < 80 && heightDelta < 80) {
        flashShield(2000);
      }
      lastWidth = w;
      lastHeight = h;
    };

    // ═══════════════════════════════════════════
    //  9. PREVENT IMAGE/VIDEO DRAG (all platforms)
    // ═══════════════════════════════════════════
    const onDragStart = (e) => {
      if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
        e.preventDefault();
      }
    };

    // ═══════════════════════════════════════════
    //  ATTACH ALL LISTENERS
    // ═══════════════════════════════════════════
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('keydown', onKeyDown, { capture: true });
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('visibilitychange', onVisibilityChange);
    document.addEventListener('dragstart', onDragStart);
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('touchcancel', onTouchCancel, { passive: true });
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('resize', onResize);

    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('keydown', onKeyDown, { capture: true });
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('dragstart', onDragStart);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchCancel);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('resize', onResize);
      clearTimeout(shieldTimer.current);
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

      {/* Security Shield — Direct DOM via ref for instant response */}
      <div ref={shieldRef} className="security-shield">
        <div className="security-shield-icon">🛡️</div>
        <h2>Content Protected</h2>
        <p>Screenshots are disabled to protect student privacy.</p>
      </div>

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
