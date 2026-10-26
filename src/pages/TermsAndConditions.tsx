import { motion } from 'motion/react';
import { ArrowLeft, Home, Phone, MapPin, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import termsImage1 from 'figma:asset/fc2506f550c6d919223dabea349d993424eba7ac.png';
import termsImage2 from 'figma:asset/faebd163188685a7655f5105047bc98e08cb5968.png';
import { CONTACT_INFO } from '../src/constants/contact';

export default function TermsAndConditions() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5', display: 'flex', flexDirection: 'column' }}>
      <SEOHead 
        title="Terms and Conditions | Dream Avenue Event Hall"
        description="Read the Hall Rules and Guidelines for Dream Avenue Event Hall. Important information for planning your cherished celebration."
        url="https://dream-avenue.in/terms-and-conditions"
      />

      <Navbar />

      <main style={{ flex: 1, padding: '120px 24px 60px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Top Heading */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div 
              style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#537517',
                marginBottom: '10px',
              }}
            >
              Hall Policies & Guidelines
            </div>
            <h1 
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: '#1B221B',
                margin: '0 0 12px 0',
                fontWeight: 700,
              }}
            >
              Terms & Venue Guidelines
            </h1>
            <p style={{ color: '#737E72', fontSize: '1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              Please review these guidelines to ensure a seamless, dignified, and compliant event experience for all guests and organizers.
            </p>
          </div>

          {/* Guidelines Document Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              boxShadow: '0 12px 36px rgba(27, 34, 27, 0.06)',
              overflow: 'hidden',
              border: '1px solid #E8E3DA',
            }}
          >
            {/* Part 1 */}
            <div style={{ borderBottom: '1px solid #E8E3DA' }}>
              <ImageWithFallback
                src={termsImage1}
                alt="Dream Avenue Hall Rules and Guidelines - Part 1"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>

            {/* Part 2 */}
            <div>
              <ImageWithFallback
                src={termsImage2}
                alt="Dream Avenue Hall Rules and Guidelines - Part 2"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>

            {/* Note & Direct Assistance */}
            <div
              style={{
                padding: '32px',
                background: '#FAF8F5',
                borderTop: '1px solid #E8E3DA',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize: '0.9375rem',
                  lineHeight: '1.7',
                  color: '#485247',
                  margin: '0 0 24px 0',
                  fontStyle: 'italic',
                }}
              >
                These rules are established to ensure the safety, hygiene, and complete satisfaction of all participants.
                We appreciate your cooperation and wish you a memorable and joyous celebration!
              </p>

              {/* Contact Assistance Row */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '20px',
                  fontSize: '0.875rem',
                  color: '#1B221B',
                  fontWeight: 500,
                  paddingTop: '20px',
                  borderTop: '1px solid #E8E3DA',
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} style={{ color: '#537517' }} />
                  <span>Enquiries: {CONTACT_INFO.phones.main} &bull; {CONTACT_INFO.phones.booking}</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} style={{ color: '#B88B52' }} />
                  <span>Near Punchiri Bus Stop, Karuvanthiruthy, Feroke</span>
                </div>
                <a
                  href={CONTACT_INFO.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#537517',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Action Button Row */}
          <div style={{ marginTop: '36px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/booking')}
              style={{
                background: 'linear-gradient(135deg, #537517 0%, #3B5410 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 28px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#FFFFFF',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(83, 117, 23, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #5F861B 0%, #486614 100%)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #537517 0%, #3B5410 100%)')}
            >
              <span>Proceed to Booking</span>
            </button>

            <button
              onClick={() => navigate('/')}
              style={{
                background: '#FFFFFF',
                border: '1px solid #DFCAAB',
                borderRadius: '12px',
                padding: '14px 24px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#1B221B',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF8F5')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
            >
              <Home size={16} style={{ color: '#537517' }} />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
