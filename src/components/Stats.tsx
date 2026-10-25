import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, Award, Star } from 'lucide-react';
import { useLatestAnalytics } from '../src/hooks/useAnalyticsAppendOnly';
import { SatisfactionRateCard } from './SatisfactionRateCard';

export function Stats() {
  const { data: latestAnalytics, isLoading } = useLatestAnalytics();

  // Animated counter states
  const [eventsCount, setEventsCount] = useState(0);
  const [guestsCount, setGuestsCount] = useState(0);
  const [satisfactionCount, setSatisfactionCount] = useState(0);

  useEffect(() => {
    if (latestAnalytics) {
      animateCounter(latestAnalytics.events_hosted || 250, setEventsCount, 1500);
      animateCounter(latestAnalytics.guests_served || 15000, setGuestsCount, 1800);
      animateCounter(latestAnalytics.client_satisfaction || 98, setSatisfactionCount, 1500);
    } else {
      // Fallback defaults
      animateCounter(250, setEventsCount, 1500);
      animateCounter(15000, setGuestsCount, 1800);
      animateCounter(98, setSatisfactionCount, 1500);
    }
  }, [latestAnalytics]);

  const animateCounter = (target: number, setter: (val: number) => void, duration: number) => {
    const steps = 40;
    const increment = target / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setter(Math.min(Math.floor(increment * currentStep), target));
      
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, duration / steps);
  };

  const metrics = [
    {
      icon: Calendar,
      value: `${eventsCount}+`,
      label: 'Celebrations Hosted',
      subtext: 'Weddings, receptions & galas',
      color: '#537517',
    },
    {
      icon: Users,
      value: `${guestsCount.toLocaleString()}+`,
      label: 'Guests Welcomed',
      subtext: 'Across all private events',
      color: '#B88B52',
    },
    {
      icon: Award,
      value: '1,000+',
      label: 'Grand Hall Capacity',
      subtext: 'Spacious & comfortable',
      color: '#537517',
    },
  ];

  return (
    <section 
      style={{
        background: '#FAF8F5',
        padding: '72px 24px',
        borderBottom: '1px solid #E8E3DA',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Editorial Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
            A Track Record of Joy
          </div>
          <h2 
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              color: '#1B221B',
              margin: '0 0 12px 0',
              fontWeight: 700,
            }}
          >
            Celebrations in Perspective
          </h2>
          <p style={{ color: '#737E72', fontSize: '1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Every gathering at Dream Avenue Event Hall is curated with precision, elegance, and warm Malabar hospitality.
          </p>
        </div>

        {/* Stats Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {metrics.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '32px 24px',
                border: '1px solid #E8E3DA',
                boxShadow: '0 4px 16px rgba(27, 34, 27, 0.04)',
                textAlign: 'center',
                transition: 'all 0.25s ease',
              }}
              whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(27, 34, 27, 0.08)', borderColor: '#DFCAAB' }}
            >
              <div 
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'rgba(237, 246, 222, 0.7)',
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px auto',
                }}
              >
                <item.icon size={26} />
              </div>
              <div 
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(2.2rem, 3vw, 2.75rem)',
                  fontWeight: 700,
                  color: item.color,
                  lineHeight: 1.1,
                  marginBottom: '8px',
                }}
              >
                {item.value}
              </div>
              <div style={{ fontWeight: 600, fontSize: '1.0625rem', color: '#1B221B', marginBottom: '4px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#737E72' }}>
                {item.subtext}
              </div>
            </motion.div>
          ))}

          {/* Satisfaction card */}
          <SatisfactionRateCard value={satisfactionCount} delay={0.3} />
        </div>
      </div>
    </section>
  );
}