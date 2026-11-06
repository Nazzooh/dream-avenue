import { ArrowRight, CalendarDays, Leaf, MapPin, Sparkles, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * A deliberately static hero. It avoids scroll listeners, pinning, springs and
 * transform updates so the first screen stays responsive on every device.
 */
export function Hero() {
  const navigate = useNavigate();

  return (
    <section id="home" className="venue-hero-scroll-track">
      <div className="venue-hero">
        <div className="venue-hero__texture" aria-hidden="true" />
        <div className="venue-hero__sun-wash" aria-hidden="true" />
        <div className="venue-hero__botanicals venue-hero__botanicals--top" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="venue-hero__botanicals venue-hero__botanicals--lower" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        <div className="venue-hero__courtyard" aria-hidden="true">
          <div className="venue-hero__arch venue-hero__arch--grand"><span /></div>
          <div className="venue-hero__arch venue-hero__arch--middle"><span /></div>
          <div className="venue-hero__arch venue-hero__arch--small"><span /></div>
          <div className="venue-hero__lantern venue-hero__lantern--one"><div className="venue-hero__lantern-glow" /><b /></div>
          <div className="venue-hero__lantern venue-hero__lantern--two"><div className="venue-hero__lantern-glow" /><b /></div>
          <div className="venue-hero__lantern venue-hero__lantern--three"><div className="venue-hero__lantern-glow" /><b /></div>
          <div className="venue-hero__floor" />
        </div>

        <div className="venue-hero__content">
          <div className="venue-hero__eyebrow"><Sparkles size={13} /><span>Dream Avenue Welcomes You</span><span aria-hidden="true">·</span><MapPin size={13} /><span>Calicut, Kerala</span></div>
          <h1>Made for gatherings<br /><em>worth remembering.</em></h1>
          <p>A warm, well-appointed event hall for weddings, receptions, family milestones and business gatherings.</p>
          <div className="venue-hero__actions">
            <button type="button" onClick={() => navigate('/booking')} className="venue-hero__cta"><CalendarDays size={18} /> Check availability <ArrowRight size={17} /></button>
            <a href="#facilities" className="venue-hero__secondary">Explore the hall</a>
          </div>
          <div className="venue-hero__proof" aria-label="Venue highlights"><span><Users size={15} /> 800 – 1,000+ guests</span><span><Leaf size={15} /> Central AC & parking</span></div>
        </div>
        <div className="venue-hero__caption" aria-hidden="true">Dream Avenue · Event Hall</div>
      </div>
    </section>
  );
}
