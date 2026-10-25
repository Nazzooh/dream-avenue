import { motion } from 'motion/react';
import { Sparkles, Calendar, Heart, Award, Building, Cake } from 'lucide-react';
import { AvailabilityCalendar } from './AvailabilityCalendar';

const OCCASIONS = [
  {
    icon: Heart,
    title: 'Weddings & Holy Unions',
    description: 'Transform your special day into a timeless memory with grand stage setups, bridal suites, and banquet dining.',
    color: '#B88B52',
  },
  {
    icon: Sparkles,
    title: 'Receptions & Sangeet Nights',
    description: 'Vibrant acoustic soundscapes, ambient chandelier lighting, and generous dance floor spaces for celebratory evenings.',
    color: '#537517',
  },
  {
    icon: Building,
    title: 'Corporate Conclaves & Summits',
    description: 'Executive stage presence, uninterrupted generator backup, and high-speed amenities for seamless business conferences.',
    color: '#3E5811',
  },
  {
    icon: Cake,
    title: 'Milestones & Get-Togethers',
    description: 'Warm, hospitable atmosphere for birthdays, anniversaries, and community assemblies with flexible duration pricing.',
    color: '#B88B52',
  },
];

export function Events() {
  return (
    <section id="events" style={{ background: '#FAF8F5', padding: '100px 24px', borderBottom: '1px solid #E8E3DA' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
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
            Celebrated Occasions
          </div>
          <h2 
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#1B221B',
              margin: '0 0 16px 0',
              fontWeight: 700,
            }}
          >
            Curated Experiences for Every Gathering
          </h2>
          <p style={{ color: '#737E72', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Whether an intimate family milestone or a grand gathering of a thousand guests, Dream Avenue provides the perfect backdrop.
          </p>
        </div>

        {/* Occasions 4-card Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginBottom: '72px',
          }}
        >
          {OCCASIONS.map((occ, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '28px 24px',
                border: '1px solid #E8E3DA',
                boxShadow: '0 4px 16px rgba(27, 34, 27, 0.04)',
                transition: 'all 0.25s ease',
              }}
              whileHover={{ y: -4, borderColor: '#DFCAAB', boxShadow: '0 12px 28px rgba(27, 34, 27, 0.08)' }}
            >
              <div 
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#FAF4EB',
                  color: occ.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                }}
              >
                <occ.icon size={24} />
              </div>
              <h3 
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#1B221B',
                  marginBottom: '8px',
                }}
              >
                {occ.title}
              </h3>
              <p style={{ color: '#737E72', fontSize: '0.9375rem', lineHeight: 1.55, margin: 0 }}>
                {occ.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Real-time Availability Section */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#537517',
              marginBottom: '10px',
            }}
          >
            <Calendar size={14} />
            Real-Time Venue Availability
          </div>
          <h3 
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              color: '#1B221B',
              margin: '0 0 10px 0',
              fontWeight: 700,
            }}
          >
            Check Your Prospective Date
          </h3>
          <p style={{ color: '#737E72', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
            Click on any available green date to proceed directly into the booking concierge.
          </p>
        </div>

        {/* Embedded Availability Calendar */}
        <AvailabilityCalendar />
      </div>
    </section>
  );
}