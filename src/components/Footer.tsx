import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Cookie, Calendar, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { revokeConsent } from './CookieConsent';
import logoImage from '../assets/b9e63ce206aa68d0d57227942230badde2fa6a6b.png';
import { CONTACT_INFO } from '../src/constants/contact';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  // Secret admin access: Triple-click on copyright text
  const handleSecretAccess = (e: React.MouseEvent) => {
    if (e.detail === 3) {
      navigate('/admin/dashboard');
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
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
  };

  return (
    <footer 
      style={{
        background: '#151D15',
        color: '#FAF8F5',
        padding: '80px 24px 36px 24px',
        borderTop: '1px solid rgba(223, 202, 171, 0.2)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Footer Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '48px',
            alignItems: 'start',
            marginBottom: '64px',
          }}
        >
          {/* Brand Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <img
                src={logoImage}
                alt="Dream Avenue Event Hall Logo"
                style={{ width: '44px', height: '44px', objectFit: 'contain' }}
              />
              <div>
                <div 
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.35rem',
                    color: '#FAF8F5',
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  Dream Avenue
                </div>
                <div 
                  style={{
                    fontSize: '0.6875rem',
                    color: '#DFCAAB',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginTop: '2px',
                    fontWeight: 600,
                  }}
                >
                  EVENT HALL
                </div>
              </div>
            </div>
            <p style={{ color: 'rgba(250, 248, 245, 0.75)', fontSize: '0.9375rem', lineHeight: 1.65, margin: '0 0 24px 0' }}>
              Curating cherished memories for weddings, receptions, corporate summits, and milestone gatherings in Calicut.
            </p>

            <button
              onClick={() => navigate('/booking')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: '#537517',
                color: '#FFFFFF',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#3E5811')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#537517')}
            >
              <Calendar size={15} />
              <span>Reserve Hall Online</span>
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.125rem',
                color: '#FAF8F5',
                marginBottom: '20px',
                fontWeight: 600,
              }}
            >
              Quick Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'The Hall', href: '#home' },
                { label: 'Spaces & Facilities', href: '#facilities' },
                { label: 'Curated Packages', href: '#packages' },
                { label: 'Occasions & Calendar', href: '#events' },
                { label: 'Photo Gallery', href: '#gallery' },
                { label: 'Frequently Asked Questions', href: '#faq' },
                { label: 'Location & Map', href: '#location' },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  style={{
                    color: 'rgba(250, 248, 245, 0.7)',
                    fontSize: '0.9375rem',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    width: 'fit-content',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#DFCAAB')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(250, 248, 245, 0.7)')}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.125rem',
                color: '#FAF8F5',
                marginBottom: '20px',
                fontWeight: 600,
              }}
            >
              Direct Concierge
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'rgba(250, 248, 245, 0.75)', fontSize: '0.9375rem' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ color: '#DFCAAB', flexShrink: 0, marginTop: '3px' }} />
                <span>{CONTACT_INFO.address.street}, {CONTACT_INFO.address.area}, {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Phone size={18} style={{ color: '#DFCAAB', flexShrink: 0 }} />
                <a href={`tel:${CONTACT_INFO.phones.main}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {CONTACT_INFO.phones.main}
                </a>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <MessageCircle size={18} style={{ color: '#537517', flexShrink: 0 }} />
                <a 
                  href={CONTACT_INFO.links.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: '#EDF6DE', textDecoration: 'none', fontWeight: 600 }}
                >
                  WhatsApp: {CONTACT_INFO.phones.whatsapp}
                </a>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Mail size={18} style={{ color: '#DFCAAB', flexShrink: 0 }} />
                <a href={`mailto:${CONTACT_INFO.emails.primary}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {CONTACT_INFO.emails.primary}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div 
          style={{
            paddingTop: '28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '0.8125rem',
            color: 'rgba(250, 248, 245, 0.5)',
          }}
        >
          <p 
            onClick={handleSecretAccess}
            style={{ margin: 0, cursor: 'pointer', userSelect: 'none' }}
            title="Dream Avenue Event Hall"
          >
            &copy; {currentYear} Dream Avenue Event Hall. All rights reserved.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={revokeConsent}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'transparent',
                border: 'none',
                color: 'rgba(250, 248, 245, 0.6)',
                fontSize: '0.8125rem',
                cursor: 'pointer',
              }}
            >
              <Cookie size={14} />
              <span>Cookie Preferences</span>
            </button>

            <a 
              href="/terms" 
              style={{ color: 'rgba(250, 248, 245, 0.6)', textDecoration: 'none' }}
            >
              Terms & Policies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}