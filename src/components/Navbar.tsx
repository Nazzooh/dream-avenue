import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, Phone, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoImage from '../assets/b9e63ce206aa68d0d57227942230badde2fa6a6b.png';
import { usePublicPreferences } from '@/context/PublicPreferences';

export function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = usePublicPreferences();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setIsMobileMenuOpen(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: '#facilities', label: 'Spaces' },
    { href: '#packages', label: 'Packages' },
    { href: '#events', label: 'Occasions' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#faq', label: 'FAQ' },
    { href: '#location', label: 'Location' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <>
      <nav 
        className={isScrolled ? 'navbar scrolled' : 'navbar'}
        style={{
          background: isScrolled ? 'var(--hall-nav-solid)' : 'var(--hall-nav)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--hall-border)',
          transition: 'all 0.3s ease',
        }}
      >
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div className="navbar-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
            {/* Logo */}
            <a 
              href="#home" 
              className="navbar-logo" 
              style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', flexShrink: 0 }}
              onClick={(e) => handleNavClick(e, '#home')}
            >
              <img 
                src={logoImage}
                style={{ width: '42px', height: '42px', objectFit: 'contain' }}
                alt="Dream Avenue Event Hall Logo" 
              />
              <div className="navbar-logo-text" style={{ display: 'flex', flexDirection: 'column' }}>
                <div 
                  className="navbar-logo-title" 
                  style={{ 
                    fontFamily: "'Playfair Display', Georgia, serif", 
                    fontSize: '1.35rem', 
                    fontWeight: 700, 
                    color: 'var(--hall-ink)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1
                  }}
                >
                  Dream Avenue
                </div>
                <div 
                  className="navbar-logo-subtitle" 
                  style={{ 
                    fontSize: '0.6875rem', 
                    fontWeight: 600, 
                    color: 'var(--hall-olive)', 
                    letterSpacing: '2px', 
                    textTransform: 'uppercase',
                    marginTop: '2px'
                  }}
                >
                  EVENT HALL
                </div>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="navbar-menu" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(14px, 2vw, 24px)', flexShrink: 0 }}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="navbar-link"
                  style={{
                    color: 'var(--hall-ink-secondary)',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--hall-olive)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--hall-ink-secondary)')}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="navbar-preferences" aria-label="Appearance settings">
              <button type="button" className="navbar-preference-button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} appearance`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} appearance`}>
                {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
              </button>
            </div>

            <a className="navbar-phone-shortcut" href="tel:+918606206096" aria-label="Call Dream Avenue">
              <Phone size={18} />
            </a>

            {/* Desktop CTA Button */}
            <button
              onClick={() => navigate('/booking')}
              className="btn-editorial-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                background: 'var(--hall-olive)',
                color: '#FFFFFF',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(83, 117, 23, 0.25)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--hall-olive-dark)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--hall-olive)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Calendar size={16} />
              <span>Reserve Hall</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="navbar-mobile-toggle"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--hall-ink)',
                cursor: 'pointer',
                display: 'none',
              }}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="navbar-mobile-menu"
              style={{
                background: 'var(--hall-nav-solid)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--hall-border)',
                padding: '104px 28px 32px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                position: 'fixed',
                inset: 0,
                zIndex: 90,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    style={{
                      fontSize: '1.0625rem',
                      fontWeight: 500,
                      color: 'var(--hall-ink)',
                      textDecoration: 'none',
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(232, 227, 218, 0.4)',
                    }}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="navbar-mobile-preferences">
                  <button type="button" onClick={toggleTheme}><span>{theme === 'light' ? 'Dark appearance' : 'Light appearance'}</span>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
                </div>
                
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/booking');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '14px',
                    background: 'var(--hall-olive)',
                    color: '#FFFFFF',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '8px',
                    boxShadow: '0 4px 16px rgba(83, 117, 23, 0.3)',
                  }}
                >
                  <Calendar size={18} />
                  <span>Reserve Hall</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
