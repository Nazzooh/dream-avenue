import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight, CalendarDays, Leaf, MapPin, Sparkles, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePublicPreferences } from '@/context/PublicPreferences';

/**
 * Editorial Hero: Courtyard at Dusk architectural illustration.
 * Enhanced with cohesive focal depth zoom, scroll-reactive lantern brilliance,
 * and guaranteed navbar clearance across all desktop viewport heights.
 */
export function Hero() {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLElement>(null);
  const { motionEnabled, desktopMotionAllowed } = usePublicPreferences();
  const useScrollMotion = motionEnabled && desktopMotionAllowed;

  // Track scroll progress along the pinned runway
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  // Butter-smooth spring interpolation for scrub dynamics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 26,
    restDelta: 0.001,
  });

  // Actions and secondary elements fade early to focus attention on the architecture
  const actionsOpacity = useTransform(smoothProgress, [0, 0.20], [1, 0]);
  const actionsY = useTransform(smoothProgress, [0, 0.20], [0, 16]);
  const actionsPointerEvents = useTransform(smoothProgress, (v) => (v > 0.15 ? 'none' : 'auto'));

  // Subtext paragraph fades softly
  const subtextOpacity = useTransform(smoothProgress, [0, 0.28], [1, 0]);
  const subtextY = useTransform(smoothProgress, [0, 0.28], [0, 20]);

  // Welcoming eyebrow drifts and fades
  const eyebrowOpacity = useTransform(smoothProgress, [0, 0.36], [1, 0]);
  const eyebrowY = useTransform(smoothProgress, [0, 0.36], [0, 16]);

  // Main Title: Recedes into the Grand Archway without blurry font-rasterization
  const textScale = useTransform(smoothProgress, [0, 0.75], [1, 0.72]);
  const textZ = useTransform(smoothProgress, [0, 0.75], [0, -220]);
  const textY = useTransform(smoothProgress, [0, 0.75], [0, 52]);
  const textOpacity = useTransform(smoothProgress, [0, 0.5, 0.78, 0.94], [1, 0.9, 0.25, 0]);

  // Courtyard: Cohesive architectural depth push (anchored together, no drifting disorder)
  const courtyardScale = useTransform(smoothProgress, [0, 0.85], [1, 1.12]);
  const courtyardY = useTransform(smoothProgress, [0, 0.85], [0, -32]);
  const archGrandScale = useTransform(smoothProgress, [0, 0.85], [1, 1.06]);
  const archMiddleY = useTransform(smoothProgress, [0, 0.85], [0, -12]);
  const archSmallY = useTransform(smoothProgress, [0, 0.85], [0, -8]);

  // Scroll-reactive lantern brilliance: Glow radius and warmth expand with scroll
  const lanternScale = useTransform(smoothProgress, [0, 0.85], [1, 1.18]);
  const lanternGlowScale = useTransform(smoothProgress, [0, 0.8], [1, 1.7]);
  const lanternGlowOpacity = useTransform(smoothProgress, [0, 0.3, 0.8], [0.75, 0.95, 1.35]);

  // Ambient sun wash and botanicals
  const washScale = useTransform(smoothProgress, [0, 0.85], [1, 1.3]);
  const washOpacity = useTransform(smoothProgress, [0, 0.7, 1], [1, 0.9, 0.4]);
  const foliageTopY = useTransform(smoothProgress, [0, 0.85], [0, -40]);
  const foliageLowerY = useTransform(smoothProgress, [0, 0.85], [0, -25]);

  // Smooth exit transition: Dissolves cleanly without broken/disordered fragments
  const frameExitOpacity = useTransform(smoothProgress, [0.85, 0.99], [1, 0]);
  const hintOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);

  const initialReveal = useScrollMotion ? { opacity: 0, y: 14 } : false;

  return (
    <section
      ref={trackRef}
      id="home"
      className={useScrollMotion ? 'venue-hero-scroll-track venue-hero-scroll-track--active' : 'venue-hero-scroll-track'}
    >
      <div className={useScrollMotion ? 'venue-hero-sticky-frame' : ''}>
        <motion.div
          className={`venue-hero ${useScrollMotion ? 'venue-hero--cinematic' : ''}`}
          style={useScrollMotion ? { opacity: frameExitOpacity } : undefined}
        >
          <div className="venue-hero__texture" aria-hidden="true" />

          {/* Glowing Sun Wash */}
          <motion.div
            className="venue-hero__sun-wash"
            aria-hidden="true"
            style={useScrollMotion ? { scale: washScale, opacity: washOpacity } : undefined}
          />

          {/* Botanicals Top */}
          <motion.div
            className="venue-hero__botanicals venue-hero__botanicals--top"
            aria-hidden="true"
            style={useScrollMotion ? { y: foliageTopY } : undefined}
          >
            <i /><i /><i /><i /><i />
          </motion.div>

          {/* Botanicals Lower */}
          <motion.div
            className="venue-hero__botanicals venue-hero__botanicals--lower"
            aria-hidden="true"
            style={useScrollMotion ? { y: foliageLowerY } : undefined}
          >
            <i /><i /><i /><i /><i /><i />
          </motion.div>

          {/* Cohesive Courtyard Architecture */}
          <motion.div
            className="venue-hero__courtyard"
            aria-hidden="true"
            style={useScrollMotion ? { scale: courtyardScale, y: courtyardY } : undefined}
          >
            {/* Grand Arch */}
            <motion.div
              className="venue-hero__arch venue-hero__arch--grand"
              style={useScrollMotion ? { scale: archGrandScale } : undefined}
            >
              <span />
            </motion.div>

            {/* Middle Arch */}
            <motion.div
              className="venue-hero__arch venue-hero__arch--middle"
              style={useScrollMotion ? { y: archMiddleY } : undefined}
            >
              <span />
            </motion.div>

            {/* Small Arch */}
            <motion.div
              className="venue-hero__arch venue-hero__arch--small"
              style={useScrollMotion ? { y: archSmallY } : undefined}
            >
              <span />
            </motion.div>

            {/* Scroll-Reactive Brilliant Lanterns */}
            <motion.div
              className="venue-hero__lantern venue-hero__lantern--one"
              style={useScrollMotion ? { scale: lanternScale } : undefined}
            >
              <motion.div
                className="venue-hero__lantern-glow"
                style={useScrollMotion ? { scale: lanternGlowScale, opacity: lanternGlowOpacity } : undefined}
              />
              <b />
            </motion.div>

            <motion.div
              className="venue-hero__lantern venue-hero__lantern--two"
              style={useScrollMotion ? { scale: lanternScale } : undefined}
            >
              <motion.div
                className="venue-hero__lantern-glow"
                style={useScrollMotion ? { scale: lanternGlowScale, opacity: lanternGlowOpacity } : undefined}
              />
              <b />
            </motion.div>

            <motion.div
              className="venue-hero__lantern venue-hero__lantern--three"
              style={useScrollMotion ? { scale: lanternScale } : undefined}
            >
              <motion.div
                className="venue-hero__lantern-glow"
                style={useScrollMotion ? { scale: lanternGlowScale, opacity: lanternGlowOpacity } : undefined}
              />
              <b />
            </motion.div>

            <div className="venue-hero__floor" />
          </motion.div>

          {/* Hero Typography & Content */}
          <div className={`venue-hero__content ${useScrollMotion ? 'venue-hero__content--watermark' : ''}`}>
            {/* Welcoming Eyebrow with guaranteed navbar safe top distance */}
            <motion.div
              initial={initialReveal}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              style={useScrollMotion ? { opacity: eyebrowOpacity, y: eyebrowY } : undefined}
              className="venue-hero__eyebrow"
            >
              <Sparkles size={13} className="text-[#c9dc85] animate-pulse" />
              <span>Dream Avenue Welcomes You</span>
              <span className="opacity-40">·</span>
              <MapPin size={13} />
              <span>Calicut, Kerala</span>
            </motion.div>

            {/* Main Headline: Recedes into Grand Arch */}
            <motion.h1
              initial={initialReveal}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              style={
                useScrollMotion
                  ? {
                      scale: textScale,
                      z: textZ,
                      y: textY,
                      opacity: textOpacity,
                    }
                  : undefined
              }
              className={useScrollMotion ? 'venue-hero__title--watermark' : ''}
            >
              Made for gatherings<br /><em>worth remembering.</em>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={initialReveal}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              style={useScrollMotion ? { opacity: subtextOpacity, y: subtextY } : undefined}
            >
              A warm, well-appointed event hall for weddings, receptions, family milestones and business gatherings.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={initialReveal}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={
                useScrollMotion
                  ? {
                      opacity: actionsOpacity,
                      y: actionsY,
                      pointerEvents: actionsPointerEvents as any,
                    }
                  : undefined
              }
              className="venue-hero__actions"
            >
              <button type="button" onClick={() => navigate('/booking')} className="venue-hero__cta">
                <CalendarDays size={18} /> Check availability <ArrowRight size={17} />
              </button>
              <a href="#facilities" className="venue-hero__secondary">Explore the hall</a>
            </motion.div>

            {/* Highlights Proof */}
            <motion.div
              style={useScrollMotion ? { opacity: actionsOpacity, y: actionsY } : undefined}
              className="venue-hero__proof"
              aria-label="Venue highlights"
            >
              <span><Users size={15} /> 800 – 1,000+ guests</span>
              <span><Leaf size={15} /> Central AC & parking</span>
            </motion.div>
          </div>

          <div className="venue-hero__caption" aria-hidden="true">Dream Avenue · Event Hall</div>

          {/* Gentle Scroll Prompt */}
          {useScrollMotion && (
            <motion.div
              style={{ opacity: hintOpacity }}
              className="venue-hero__scroll-hint"
              aria-hidden="true"
            >
              <span className="venue-hero__scroll-hint-dot" />
              <span>Scroll to explore</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
