import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronDown, ArrowRight, Sparkles, Phone, CheckCircle2 } from 'lucide-react';

// @ts-ignore
import heroPoster from '../assets/hero-poster.png';

export function Hero() {
  const navigate = useNavigate();
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [peekDate, setPeekDate] = useState<string>('');
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

  const handleDatePeekSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (peekDate) {
      navigate(`/booking?date=${peekDate}`);
    } else {
      navigate('/booking');
    }
  };

  // Scroll Animations
  const contentScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.92]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.15]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.5], [0.65, 0.25]);

  // Floating CTA visibility
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setShowFloatingCTA(latest > 700);
    });
  }, [scrollY]);

  // Minimum selectable date is today in YYYY-MM-DD format
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <section
      id="home"
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: '#111812',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '100px',
        paddingBottom: '80px',
      }}
    >
      {/* Dynamic Video / Poster Background Layer */}
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
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(17, 24, 18, 0.8) 0%, rgba(17, 24, 18, 0.45) 50%, rgba(17, 24, 18, 0.9) 100%)',
            backgroundImage: `linear-gradient(to bottom, rgba(17, 24, 18, 0.8) 0%, rgba(17, 24, 18, 0.45) 50%, rgba(17, 24, 18, 0.9) 100%), url(${heroPoster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1,
            pointerEvents: 'none',
          }} 
        />

        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '177.77777778vh',
            height: '100vh',
            minWidth: '100vw',
            minHeight: '56.25vw',
          }}
        >
          <iframe
            src="https://www.youtube-nocookie.com/embed/qXgr8igDL84?si=qLxbZzpO5cGkX9fY&autoplay=1&mute=1&controls=0&loop=1&playlist=qXgr8igDL84&playsinline=1&modestbranding=1&rel=0&showinfo=0&disablekb=1&enablejsapi=1"
            title="Dream Avenue Event Hall Showcase"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={() => setVideoLoaded(true)}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              opacity: videoLoaded ? (videoOpacity as any) : 0,
              transition: 'opacity 1s ease-in-out',
              position: 'relative',
              zIndex: 0,
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
          padding: '0 24px',
          maxWidth: '1080px',
          margin: '0 auto',
        }}
      >
        {/* Editorial Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ marginBottom: '24px' }}
        >
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 20px',
              background: 'rgba(237, 246, 222, 0.12)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(184, 139, 82, 0.35)',
              borderRadius: '999px',
              color: '#DFCAAB',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            <Sparkles size={15} style={{ color: '#DFCAAB' }} />
            Bespoke Event Destination &bull; Calicut
          </div>
        </motion.div>

        {/* Dynamic Editorial Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontSize: 'clamp(2.4rem, 6vw, 4.75rem)',
            fontFamily: "'Playfair Display', Georgia, serif",
            lineHeight: 1.12,
            fontWeight: 700,
            color: '#FAF8F5',
            letterSpacing: '-0.025em',
            margin: '0 0 20px 0',
          }}
        >
          Elevating Life's <br />
          <span 
            style={{
              background: 'linear-gradient(135deg, #FAF8F5 30%, #DFCAAB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontStyle: 'italic',
              fontWeight: 400,
            }}
          >
            Cherished Celebrations
          </span>
        </motion.h1>

        {/* Editorial Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'rgba(250, 248, 245, 0.82)',
            maxWidth: '680px',
            margin: '0 auto 36px auto',
            lineHeight: 1.65,
            fontWeight: 400,
          }}
        >
          Dream Avenue Event Hall provides refined contemporary spaces, tranquil garden surroundings, and attentive hospitality designed for memorable weddings, gatherings, and conclaves.
        </motion.p>

        {/* Embedded Instant Date Availability Peek */}
        <motion.form
          onSubmit={handleDatePeekSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '12px 16px',
            maxWidth: '560px',
            margin: '0 auto 36px auto',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 20px 48px rgba(0, 0, 0, 0.25)',
            border: '1px solid #DFCAAB',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 200px' }}>
            <Calendar size={20} style={{ color: '#537517' }} />
            <div style={{ textAlign: 'left', width: '100%' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#737E72', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Event Date
              </div>
              <input
                type="date"
                min={todayStr}
                value={peekDate}
                onChange={(e) => setPeekDate(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: '#1B221B',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  width: '100%',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: '#537517',
              color: '#FFFFFF',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.9375rem',
              border: 'none',
              cursor: 'pointer',
              flex: '1 1 auto',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#3E5811')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#537517')}
          >
            <span>Check Availability</span>
            <ArrowRight size={16} />
          </button>
        </motion.form>

        {/* Secondary Links & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <button
            onClick={() => navigate('/booking')}
            style={{
              padding: '14px 32px',
              background: '#B88B52',
              color: '#FFFFFF',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 6px 20px rgba(184, 139, 82, 0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#9E743F';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#B88B52';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Calendar size={18} />
            <span>Reserve Hall</span>
          </button>

          <a
            href="#facilities"
            onClick={(e) => handleNavClick(e, '#facilities')}
            style={{
              padding: '14px 28px',
              background: 'rgba(250, 248, 245, 0.1)',
              color: '#FAF8F5',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 500,
              border: '1px solid rgba(250, 248, 245, 0.3)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(250, 248, 245, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(250, 248, 245, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(250, 248, 245, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(250, 248, 245, 0.3)';
            }}
          >
            <span>Explore Spaces</span>
            <ChevronDown size={18} />
          </a>
        </motion.div>
      </motion.div>

      {/* Floating Concierge Action */}
      <motion.button
        onClick={() => navigate('/booking')}
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: showFloatingCTA ? 1 : 0,
          y: showFloatingCTA ? 0 : 50,
          pointerEvents: showFloatingCTA ? 'auto' : 'none',
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 90,
          background: '#537517',
          color: '#FFFFFF',
          padding: '14px 24px',
          borderRadius: '50px',
          border: 'none',
          boxShadow: '0 8px 24px rgba(83, 117, 23, 0.4)',
          fontWeight: 600,
          fontSize: '0.9375rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#3E5811')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#537517')}
      >
        <Calendar size={18} />
        <span>Book Event Hall</span>
      </motion.button>
    </section>
  );
}