import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoImage from '../assets/b9e63ce206aa68d0d57227942230badde2fa6a6b.png';

export function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'The Hall' },
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
          background: isScrolled ? 'rgba(250, 248, 245, 0.96)' : 'rgba(250, 248, 245, 0.88)',
          backdropFilter: 'blur(16px)',
          borderBottom: isScrolled ? '1px solid #E8E3DA' : '1px solid rgba(232, 227, 218, 0.6)',
          transition: 'all 0.3s ease',
        }}
      >
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div className="navbar-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
            {/* Logo */}
            <a 
              href="#home" 
              className="navbar-logo" 
              style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}
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
                    color: '#1B221B',
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
                    color: '#537517', 
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
            <div className="navbar-menu" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="navbar-link"
                  style={{
                    color: '#485247',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#537517')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#485247')}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA Button */}
            <button
              onClick={() => navigate('/booking')}
              className="btn-editorial-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                background: '#537517',
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
                e.currentTarget.style.background = '#3E5811';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#537517';
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
                color: '#1B221B',
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
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="navbar-mobile-menu"
              style={{
                background: 'rgba(250, 248, 245, 0.98)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid #E8E3DA',
                padding: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
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
                      color: '#1B221B',
                      textDecoration: 'none',
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(232, 227, 218, 0.4)',
                    }}
                  >
                    {link.label}
                  </a>
                ))}
                
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
                    background: '#537517',
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