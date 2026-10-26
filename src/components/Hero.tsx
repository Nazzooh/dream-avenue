import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Play,
  X,
  Users,
  PartyPopper,
  CheckCircle2,
} from 'lucide-react';

// Curated Architectural Photography Slides
const HERO_SLIDES = [
  {
    id: 'grand-hall',
    name: 'The Grand Event Hall',
    badge: 'Main Auditorium',
    tagline: 'Central AC Grand Hall with Sculpted Chandeliers',
    image: '/new-gallery-images/banquet-hall.png',
    capacity: '1,000+ Guests',
  },
  {
    id: 'scenic-lawn',
    name: 'Manicured Garden Lawn',
    badge: 'Open-Air Sanctuary',
    tagline: 'Serene Open-Air Ambiance for Twilight Receptions & Soirées',
    image: '/new-gallery-images/outdoor.png',
    capacity: 'Tranquil Setting',
  },
  {
    id: 'dining-plaza',
    name: 'Banquet Dining Plaza',
    badge: 'Dining Pavilion',
    tagline: '500+ Seated Capacity with Wide Buffet Corridors',
    image: '/new-gallery-images/dining.png',
    capacity: '500+ Seated',
  },
  {
    id: 'conclave-stage',
    name: 'Acoustic Stage Arena',
    badge: 'Stage & Ceremonies',
    tagline: 'Engineered Acoustics & Ambient Illumination for Milestone Gatherings',
    image: '/new-gallery-images/corporate-event.png',
    capacity: 'Conclave Ready',
  },
];

export function Hero() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  // Concierge Form State
  const [eventDate, setEventDate] = useState<string>('');
  const [occasion, setOccasion] = useState<string>('normal');
  const [guestTier, setGuestTier] = useState<string>('500');

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY, scrollYProgress } = useScroll();

  // Scroll animations for subtle parallax
  const contentScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.94]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  // Minimum selectable date is today in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Auto-advance slideshow every 7 seconds when not paused
  useEffect(() => {
    if (isPaused || isVideoModalOpen) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, isVideoModalOpen]);

  // Close video modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVideoModalOpen) {
        setIsVideoModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVideoModalOpen]);

  // Floating CTA visibility on scroll
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setShowFloatingCTA(latest > 750);
    });
  }, [scrollY]);

  // Handle Concierge Form Submission
  const handleConciergeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (eventDate) params.set('date', eventDate);
    if (occasion) params.set('occasion', occasion);
    if (guestTier) params.set('guests', guestTier);

    const queryStr = params.toString();
    navigate(queryStr ? `/booking?${queryStr}` : '/booking');
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: '#0D130E',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: '120px',
        paddingBottom: '40px',
      }}
    >
      {/* FULL-BLEED SLIDESHOW WITH SMOOTH CROSSFADE & KEN BURNS ZOOM */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.0 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.4, ease: 'easeInOut' },
              scale: { duration: 7.5, ease: 'linear' },
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${currentSlide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </AnimatePresence>

        {/* Multi-layered Cinematic Vignette Gradients */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(13, 19, 14, 0.85) 0%, rgba(13, 19, 14, 0.42) 28%, rgba(13, 19, 14, 0.65) 68%, rgba(13, 19, 14, 0.98) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 50% 40%, rgba(83, 117, 23, 0.12) 0%, rgba(13, 19, 14, 0.6) 80%, rgba(13, 19, 14, 0.95) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* TOP / CENTER: MAGAZINE EDITORIAL HEADER */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          scale: contentScale,
          opacity: contentOpacity,
          padding: '0 20px',
          maxWidth: '1120px',
          margin: '0 auto',
          width: '100%',
          flex: '1 0 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Editorial Subtitle Badge & Video Tour Trigger Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          {/* Destination Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 18px',
              background: 'rgba(237, 246, 222, 0.08)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(184, 139, 82, 0.35)',
              borderRadius: '999px',
              color: '#DFCAAB',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            <Sparkles size={14} style={{ color: '#DFCAAB' }} />
            <span>Calicut, Kerala &bull; Bespoke Event Destination</span>
          </motion.div>

          {/* Watch Venue Film Modal Trigger */}
          <motion.button
            type="button"
            onClick={() => setIsVideoModalOpen(true)}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 16px',
              background: 'rgba(20, 27, 21, 0.65)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(223, 202, 171, 0.4)',
              borderRadius: '999px',
              color: '#FAF8F5',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(83, 117, 23, 0.5)';
              e.currentTarget.style.borderColor = '#DFCAAB';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(20, 27, 21, 0.65)';
              e.currentTarget.style.borderColor = 'rgba(223, 202, 171, 0.4)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#DFCAAB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1B221B',
              }}
            >
              <Play size={10} style={{ marginLeft: '1px', fill: '#1B221B' }} />
            </span>
            <span>Watch Venue Film &bull; 4K Tour</span>
          </motion.button>
        </div>

        {/* Magazine Editorial Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2 }}
          style={{
            fontSize: 'clamp(2.6rem, 6.2vw, 5.1rem)',
            fontFamily: "'Playfair Display', Georgia, serif",
            lineHeight: 1.1,
            fontWeight: 700,
            color: '#FAF8F5',
            letterSpacing: '-0.025em',
            margin: '0 0 18px 0',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
          }}
        >
          Where Celebrations Become <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #FAF8F5 15%, #E8D5B9 60%, #C4985F 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontStyle: 'italic',
              fontWeight: 400,
            }}
          >
            Enduring Memories
          </span>
        </motion.h1>

        {/* Refined Description */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.3 }}
          style={{
            fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
            color: 'rgba(250, 248, 245, 0.88)',
            maxWidth: '720px',
            margin: '0 auto 24px auto',
            lineHeight: 1.6,
            fontWeight: 400,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          }}
        >
          Dream Avenue Event Hall unites grand architectural scale, tranquil garden surroundings, and attentive hospitality in Calicut &mdash; seamlessly tailored for weddings, receptions, and distinguished conclaves.
        </motion.p>

        {/* Curated Venue Metric Micro-Badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.35 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '32px',
          }}
        >
          {[
            '1,200 Guest Capacity',
            'Central Air Conditioning',
            '500+ Seated Dining',
            'Dedicated Parking Plaza',
          ].map((feature, idx) => (
            <span
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 14px',
                background: 'rgba(250, 248, 245, 0.08)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(250, 248, 245, 0.18)',
                borderRadius: '8px',
                color: '#FAF8F5',
                fontSize: '0.78125rem',
                fontWeight: 500,
                letterSpacing: '0.3px',
              }}
            >
              <CheckCircle2 size={13} style={{ color: '#DFCAAB' }} />
              {feature}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* BOTTOM SECTION: FLOATING CONCIERGE COMMAND BAR & SLIDESHOW CONTROLS */}
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          width: '100%',
          maxWidth: '1160px',
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        {/* Slideshow Space Pill Selector Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          {/* Active Space Tag */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#DFCAAB',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            <span style={{ color: '#FAF8F5', opacity: 0.7 }}>Featuring:</span>
            <span style={{ color: '#DFCAAB', fontWeight: 700 }}>{currentSlide.name}</span>
            <span style={{ color: 'rgba(250, 248, 245, 0.4)' }}>&bull;</span>
            <span style={{ color: 'rgba(250, 248, 245, 0.8)', fontSize: '0.75rem', fontWeight: 500, textTransform: 'none' }}>
              {currentSlide.tagline}
            </span>
          </div>

          {/* Slide Switchers */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(17, 24, 18, 0.65)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(223, 202, 171, 0.25)',
              borderRadius: '999px',
              padding: '4px 6px',
            }}
          >
            <button
              type="button"
              onClick={handlePrevSlide}
              aria-label="Previous Space"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'transparent',
                border: 'none',
                color: '#FAF8F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(250, 248, 245, 0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <ChevronLeft size={16} />
            </button>

            {HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlide(i)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: activeSlide === i ? '#DFCAAB' : 'transparent',
                  color: activeSlide === i ? '#1B221B' : 'rgba(250, 248, 245, 0.7)',
                  fontSize: '0.6875rem',
                  fontWeight: activeSlide === i ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.5px',
                }}
              >
                0{i + 1}
              </button>
            ))}

            <button
              type="button"
              onClick={handleNextSlide}
              aria-label="Next Space"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'transparent',
                border: 'none',
                color: '#FAF8F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(250, 248, 245, 0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* FLOATING CONCIERGE BAR */}
        <motion.form
          onSubmit={handleConciergeSubmit}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            background: 'rgba(20, 27, 21, 0.88)',
            backdropFilter: 'blur(24px)',
            borderRadius: '20px',
            padding: '16px 20px',
            border: '1px solid rgba(184, 139, 82, 0.35)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '14px',
            alignItems: 'center',
          }}
        >
          {/* Field 1: Event Date */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(223, 202, 171, 0.25)',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(83, 117, 23, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DFCAAB',
                flexShrink: 0,
              }}
            >
              <Calendar size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#DFCAAB',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '2px',
                }}
              >
                Event Date
              </label>
              <input
                type="date"
                min={todayStr}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FAF8F5',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  colorScheme: 'dark',
                }}
              />
            </div>
          </div>

          {/* Field 2: Occasion Type */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(223, 202, 171, 0.25)',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(83, 117, 23, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DFCAAB',
                flexShrink: 0,
              }}
            >
              <PartyPopper size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#DFCAAB',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '2px',
                }}
              >
                Occasion
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FAF8F5',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  colorScheme: 'dark',
                }}
              >
                <option value="normal" style={{ background: '#1B221B', color: '#FAF8F5' }}>Wedding & Reception</option>
                <option value="birthday" style={{ background: '#1B221B', color: '#FAF8F5' }}>Birthday & Anniversary</option>
                <option value="get_together" style={{ background: '#1B221B', color: '#FAF8F5' }}>Family Get-Together / Nikkah</option>
                <option value="meeting" style={{ background: '#1B221B', color: '#FAF8F5' }}>Corporate Conclave / Seminar</option>
                <option value="other" style={{ background: '#1B221B', color: '#FAF8F5' }}>Cultural Gathering / Other</option>
              </select>
            </div>
          </div>

          {/* Field 3: Expected Guests */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(223, 202, 171, 0.25)',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(83, 117, 23, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DFCAAB',
                flexShrink: 0,
              }}
            >
              <Users size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#DFCAAB',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '2px',
                }}
              >
                Guests
              </label>
              <select
                value={guestTier}
                onChange={(e) => setGuestTier(e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FAF8F5',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  colorScheme: 'dark',
                }}
              >
                <option value="250" style={{ background: '#1B221B', color: '#FAF8F5' }}>Up to 250 Guests</option>
                <option value="500" style={{ background: '#1B221B', color: '#FAF8F5' }}>250 &ndash; 500 Guests</option>
                <option value="800" style={{ background: '#1B221B', color: '#FAF8F5' }}>500 &ndash; 800 Guests</option>
                <option value="1200" style={{ background: '#1B221B', color: '#FAF8F5' }}>800 &ndash; 1,200+ Guests</option>
              </select>
            </div>
          </div>

          {/* Field 4: Primary CTA Button */}
          <div style={{ width: '100%' }}>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px 22px',
                background: 'linear-gradient(135deg, #537517 0%, #3B5410 100%)',
                color: '#FFFFFF',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.9375rem',
                border: '1px solid rgba(223, 202, 171, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(83, 117, 23, 0.45)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #5F861B 0%, #486614 100%)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(83, 117, 23, 0.55)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #537517 0%, #3B5410 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(83, 117, 23, 0.45)';
              }}
            >
              <span>Check Rates & Availability</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </motion.form>

        {/* Micro Trust Guarantee Strip */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '18px',
            marginTop: '12px',
            color: 'rgba(250, 248, 245, 0.65)',
            fontSize: '0.75rem',
            fontWeight: 500,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <CheckCircle2 size={13} style={{ color: '#DFCAAB' }} />
            Live Real-Time Calendar Check
          </span>
          <span style={{ opacity: 0.4 }}>&bull;</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <CheckCircle2 size={13} style={{ color: '#DFCAAB' }} />
            Direct Hall Owner Pricing
          </span>
          <span style={{ opacity: 0.4 }}>&bull;</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <CheckCircle2 size={13} style={{ color: '#DFCAAB' }} />
            Zero Commission &bull; Instant WhatsApp Concierge
          </span>
        </div>
      </div>

      {/* POPUP 4K VENUE TOUR VIDEO MODAL */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsVideoModalOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(10, 15, 10, 0.88)',
              backdropFilter: 'blur(24px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '920px',
                background: '#161E16',
                borderRadius: '20px',
                border: '1px solid rgba(184, 139, 82, 0.4)',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Modal Top Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 24px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderBottom: '1px solid rgba(184, 139, 82, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={16} style={{ color: '#DFCAAB' }} />
                  <span
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      color: '#FAF8F5',
                      fontWeight: 600,
                      fontSize: '1.05rem',
                    }}
                  >
                    Dream Avenue Event Hall &mdash; 4K Cinematic Tour
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  aria-label="Close Tour"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(223, 202, 171, 0.3)',
                    color: '#FAF8F5',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#DFCAAB';
                    e.currentTarget.style.color = '#1B221B';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = '#FAF8F5';
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Video Player Container */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '56.25%',
                  background: '#000000',
                }}
              >
                <iframe
                  src="https://www.youtube-nocookie.com/embed/qXgr8igDL84?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&enablejsapi=1"
                  title="Dream Avenue Event Hall Showcase"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                />
              </div>

              {/* Modal Footer Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 24px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '0.8125rem', color: 'rgba(250, 248, 245, 0.7)' }}>
                  Calicut's premier event hall with central air-conditioning & manicured garden lawns.
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setIsVideoModalOpen(false);
                    navigate('/booking');
                  }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    background: '#537517',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Reserve Venue</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING CONCIERGE BUTTON ON SCROLL */}
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
          background: 'linear-gradient(135deg, #537517 0%, #3B5410 100%)',
          color: '#FFFFFF',
          padding: '13px 22px',
          borderRadius: '50px',
          border: '1px solid rgba(223, 202, 171, 0.4)',
          boxShadow: '0 8px 24px rgba(83, 117, 23, 0.45)',
          fontWeight: 600,
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#3B5410';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #537517 0%, #3B5410 100%)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <Calendar size={17} style={{ color: '#DFCAAB' }} />
        <span>Reserve Event Hall</span>
      </motion.button>
    </section>
  );
}
