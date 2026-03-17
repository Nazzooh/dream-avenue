import { motion } from 'motion/react';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAF9F6' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 60px' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{ 
              fontSize: '8rem', 
              fontWeight: 800, 
              lineHeight: 1,
              margin: '0 0 1rem 0',
              background: 'linear-gradient(135deg, #B6F500, #E0C097)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.05em'
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
              fontSize: '2rem', 
              color: '#343A40', 
              marginBottom: '1.5rem',
              fontWeight: 600
            }}>
              Oops! Page Not Found
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#666', 
              marginBottom: '3rem',
              lineHeight: 1.6
            }}>
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                background: 'transparent',
                color: '#343A40',
                border: '2px solid rgba(224, 192, 151, 0.5)',
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <ArrowLeft size={20} />
              Go Back
            </motion.button>

            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #B6F500, #E0C097)',
                color: '#343A40',
                border: 'none',
                borderRadius: '50px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(182, 245, 0, 0.25)',
              }}
            >
              <Home size={20} />
              Back to Home
            </motion.button>
          </motion.div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
