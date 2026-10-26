import { motion } from 'motion/react';
import { Home, ArrowLeft, Phone, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CONTACT_INFO } from '../src/constants/contact';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAF8F5' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '130px 24px 60px' }}>
        <div style={{ maxWidth: '640px', width: '100%', textAlign: 'center' }}>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{ 
              fontSize: 'clamp(5rem, 12vw, 8rem)', 
              fontWeight: 800, 
              lineHeight: 1,
              margin: '0 0 1rem 0',
              fontFamily: "'Playfair Display', Georgia, serif",
              background: 'linear-gradient(135deg, #537517 0%, #B88B52 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em'
            }}>
              404
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 style={{ 
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', 
              color: '#1B221B', 
              marginBottom: '1rem',
              fontWeight: 700
            }}>
              Page Not Found
            </h2>
            <p style={{ 
              fontSize: '1.05rem', 
              color: '#737E72', 
              marginBottom: '2.5rem',
              lineHeight: 1.6
            }}>
              The page you are looking for might have been moved or is unavailable. Return home or speak with our concierge directly.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}
          >
            <button
              onClick={() => navigate(-1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: '#FFFFFF',
                color: '#1B221B',
                border: '1px solid #DFCAAB',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF8F5')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
            >
              <ArrowLeft size={18} />
              <span>Go Back</span>
            </button>

            <button
              onClick={() => navigate('/')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #537517 0%, #3B5410 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(83, 117, 23, 0.3)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #5F861B 0%, #486614 100%)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #537517 0%, #3B5410 100%)')}
            >
              <Home size={18} />
              <span>Back to Home</span>
            </button>
          </motion.div>

          {/* Direct Concierge Help Strip */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E8E3DA',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              fontSize: '0.875rem',
              color: '#737E72',
            }}
          >
            <span>Need direct assistance?</span>
            <a
              href={`tel:${CONTACT_INFO.phones.main}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#1B221B',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <Phone size={14} style={{ color: '#537517' }} />
              <span>{CONTACT_INFO.phones.main}</span>
            </a>
            <span style={{ opacity: 0.4 }}>&bull;</span>
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
              <MessageCircle size={14} />
              <span>WhatsApp Concierge</span>
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
