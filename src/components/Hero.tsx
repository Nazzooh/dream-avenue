import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, ChevronDown, ArrowRight, Award, Phone } from 'lucide-react';

// @ts-ignore
import heroPoster from '../assets/hero-poster.png';

export function Hero() {
  const navigate = useNavigate();
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY, scrollYProgress } = useScroll();

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

  // Scroll Animations
  const contentScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.5], [0.7, 0.3]);
  const badgeY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const headlineY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  // Floating CTA visibility
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setShowFloatingCTA(latest > 800);
    });
  }, [scrollY]);

  return (
    <section
      id="home"
      ref={containerRef}
      style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '80px', // Offset for Navbar height
      }}
    >
      {/* Dynamic Video Background Layer */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          scale: videoScale,
          zIndex: 0,
        }}
      >
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.4)',
          zIndex: 1,
          pointerEvents: 'auto', // Capture all clicks/interactions
        }} />

        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '177.77777778vh',
          height: '100vh',
          minWidth: '100vw',
          minHeight: '56.25vw',
        }}>
          <iframe
            src="https://www.youtube-nocookie.com/embed/qXgr8igDL84?si=qLxbZzpO5cGkX9fY&autoplay=1&mute=1&controls=0&loop=1&playlist=qXgr8igDL84&playsinline=1&modestbranding=1&rel=0&showinfo=0&disablekb=1&enablejsapi=1"
            title="Dream Avenue Background"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              opacity: videoOpacity as any,
              transition: 'opacity 1s ease-in-out',
            }}
          />
        </div>
      </motion.div>

      {/* Main Content Layer */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          scale: contentScale,
          opacity: contentOpacity,
          padding: '20px 24px 0 24px', // Extra top padding inside content
          maxWidth: '1200px',
        }}
      >
        {/* Floating Badge */}
        <motion.div
          style={{ y: badgeY }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 24px',
            background: 'rgba(200, 212, 107, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(200, 212, 107, 0.3)',
            borderRadius: '100px',
            color: '#C8D46B',
            fontSize: '0.875rem',
            fontWeight: '600',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '32px',
          }}>
            <Award size={18} />
            Calicut's Premier Luxury Venue
            <Sparkles size={18} />
          </div>
        </motion.div>

        {/* Dynamic Headline */}
        <motion.h1
          style={{
            y: headlineY,
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            fontFamily: 'var(--font-heading)',
            lineHeight: 1.1,
            fontWeight: 800,
            color: '#FAF9F6',
            letterSpacing: '-0.03em',
            margin: '0 0 24px 0',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Elevating Your <br />
          <span style={{
            background: 'linear-gradient(135deg, #C8D46B 0%, #E0C097 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Grandest Moments</span>
        </motion.h1>

        {/* Description Pill */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(250, 249, 246, 0.8)',
            maxWidth: '700px',
            margin: '0 auto 48px auto',
            lineHeight: 1.6,
          }}
        >
          A masterpiece of architecture and luxury, meticulously designed for
          unforgettable weddings, corporate galas, and global conventions.
        </motion.p>

        {/* Dynamic Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
          }}
        >
          <motion.button
            onClick={() => navigate('/booking')}
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(200, 212, 107, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '20px 48px',
              background: '#C8D46B',
              color: '#050505',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Calendar size={20} />
            Book Now
            <ArrowRight size={20} />
          </motion.button>

          <motion.a
            href="#facilities"
            onClick={(e: any) => handleNavClick(e, '#facilities')}
            whileHover={{ scale: 1.05, background: 'rgba(250, 249, 246, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '20px 48px',
              background: 'transparent',
              color: '#FAF9F6',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: '600',
              border: '2px solid rgba(250, 249, 246, 0.2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              backdropFilter: 'blur(10px)',
            }}
          >
            View Space
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Floating CTA */}
      <motion.button
        onClick={() => navigate('/booking')}
        initial={{ opacity: 0, y: 100 }}
        animate={{
          opacity: showFloatingCTA ? 1 : 0,
          y: showFloatingCTA ? 0 : 100,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 1000,
          background: '#C8D46B',
          color: '#050505',
          padding: '16px 32px',
          borderRadius: '50px',
          border: 'none',
          boxShadow: '0 10px 30px rgba(200, 212, 107, 0.4)',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
        }}
      >
        <Phone size={18} />
        Reserve Venue
      </motion.button>

      {/* Elegant Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(250, 249, 246, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Explore</span>
        <ChevronDown size={20} />
      </motion.div>

      <style>{`
        h1 {
          font-size: clamp(2.5rem, 8vw, 5.5rem) !important;
        }
      `}</style>
    </section>
  );
}
