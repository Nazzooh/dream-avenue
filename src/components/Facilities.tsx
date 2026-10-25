import { motion } from 'motion/react';
import {
  Sparkles,
  Building2,
  Trees,
  Sunset,
  UtensilsCrossed,
  Car,
  Music,
  Wind,
  Utensils,
  Maximize2,
  Users
} from 'lucide-react';
import { useFacilities } from '../src/hooks/useFacilities';
import { FacilitySkeleton } from './SkeletonLoader';
import { getOptimizedSupabaseUrl } from '../src/utils/imageUtils';

const CURATED_SPACES = [
  {
    id: 'space-1',
    title: 'The Grand Event Hall',
    category: 'Main Auditorium',
    capacity: '1,000+ Guests',
    description: 'High-volume hall with expansive sightlines, state-of-the-art acoustic staging, and ambient chandeliers designed for memorable wedding receptions and assemblies.',
    image: '/new-gallery-images/banquet-hall.png',
    icon: 'banquet',
  },
  {
    id: 'space-2',
    title: 'Banquet Dining Hall',
    category: 'Dining Experience',
    capacity: '500+ Seated',
    description: 'Fully air-conditioned dining area with wide buffet corridors and ergonomic seating, ensuring a smooth, pleasant culinary experience for all your attendees.',
    image: '/new-gallery-images/dining.png',
    icon: 'dining',
  },
  {
    id: 'space-3',
    title: 'Scenic Open-Air Lawn',
    category: 'Outdoor Ambience',
    capacity: '350+ Guests',
    description: 'Landscaped green lawns framed with ambient festoon lighting, ideal for open-air welcomes, golden-hour photography, and evening cocktail sessions.',
    image: '/new-gallery-images/outdoor.png',
    icon: 'garden',
  },
  {
    id: 'space-4',
    title: 'Executive Bridal & Groom Suites',
    category: 'Private Sanctuaries',
    capacity: 'Private',
    description: 'Quiet, air-conditioned private suites equipped with full-length vanity mirrors, private restrooms, and plush lounge seating for touch-ups and rest.',
    image: '/new-gallery-images/corporate-event.png',
    icon: 'ac',
  },
  {
    id: 'space-5',
    title: 'Commercial Food Prep Area',
    category: 'Catering Support',
    capacity: 'Full Service',
    description: 'Clean, dedicated staging kitchen and pantry area enabling your chosen external caterers to plate and serve warm dishes seamlessly.',
    icon: 'catering',
  },
  {
    id: 'space-6',
    title: 'Secure Parking Plaza',
    category: 'Guest Convenience',
    capacity: '100+ Vehicles',
    description: 'Spacious on-site parking plaza with clear driveway ingress/egress, security personnel, and organized valet drop-off facilities.',
    icon: 'parking',
  },
];

const iconMap: Record<string, any> = {
  'banquet': Building2,
  'garden': Trees,
  'terrace': Sunset,
  'catering': UtensilsCrossed,
  'parking': Car,
  'music': Music,
  'ac': Wind,
  'dining': Utensils,
};

const getIcon = (iconName?: string) => {
  if (!iconName) return Sparkles;
  return iconMap[iconName.toLowerCase()] || Sparkles;
};

export function Facilities() {
  const { data: facilities, isLoading } = useFacilities();

  // Merge remote facilities with curated imagery if remote facilities exist
  const displayItems = (facilities && facilities.length > 0)
    ? facilities.map((f: any, idx: number) => ({
        id: f.id,
        title: f.title || f.name,
        category: f.category || CURATED_SPACES[idx % CURATED_SPACES.length].category,
        capacity: f.capacity || CURATED_SPACES[idx % CURATED_SPACES.length].capacity,
        description: f.description || CURATED_SPACES[idx % CURATED_SPACES.length].description,
        image: f.image_url || f.image || CURATED_SPACES[idx % CURATED_SPACES.length].image,
        icon: f.icon || CURATED_SPACES[idx % CURATED_SPACES.length].icon,
      }))
    : CURATED_SPACES;

  return (
    <section id="facilities" style={{ background: '#FAF8F5', padding: '100px 24px', borderBottom: '1px solid #E8E3DA' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
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
            Spaces & Facilities
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
            Crafted for Unforgettable Occasions
          </h2>
          <p style={{ color: '#737E72', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Every square foot of Dream Avenue Event Hall is curated with practical layout, acoustics, and aesthetic warmth.
          </p>
        </div>

        {/* Spaces Grid */}
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {[1, 2, 3].map((i) => (
              <FacilitySkeleton key={i} />
            ))}
          </div>
        ) : (
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '32px',
            }}
          >
            {displayItems.map((space: any, index: number) => {
              const Icon = getIcon(space.icon);
              return (
                <motion.div
                  key={space.id || index}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid #E8E3DA',
                    boxShadow: '0 8px 24px rgba(27, 34, 27, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  whileHover={{
                    y: -6,
                    boxShadow: '0 16px 36px rgba(27, 34, 27, 0.08)',
                    borderColor: '#DFCAAB',
                  }}
                >
                  {/* Space Image (if available) */}
                  {space.image ? (
                    <div style={{ position: 'relative', height: '240px', overflow: 'hidden', background: '#F4EFEB' }}>
                      <img
                        src={getOptimizedSupabaseUrl(space.image, 700)}
                        alt={space.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                      <div 
                        style={{
                          position: 'absolute',
                          top: '16px',
                          left: '16px',
                          background: 'rgba(27, 34, 27, 0.75)',
                          backdropFilter: 'blur(8px)',
                          color: '#FAF8F5',
                          padding: '6px 14px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {space.category}
                      </div>

                      <div 
                        style={{
                          position: 'absolute',
                          bottom: '16px',
                          right: '16px',
                          background: 'rgba(255, 255, 255, 0.92)',
                          backdropFilter: 'blur(8px)',
                          color: '#1B221B',
                          padding: '4px 12px',
                          borderRadius: '8px',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Users size={14} style={{ color: '#537517' }} />
                        {space.capacity}
                      </div>
                    </div>
                  ) : (
                    <div 
                      style={{ 
                        height: '140px', 
                        background: 'linear-gradient(135deg, #FAF4EB 0%, #EDF6DE 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                    >
                      <div 
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          background: '#FFFFFF',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#537517',
                        }}
                      >
                        <Icon size={28} />
                      </div>
                      <div 
                        style={{
                          position: 'absolute',
                          top: '16px',
                          left: '16px',
                          background: 'rgba(255, 255, 255, 0.85)',
                          color: '#537517',
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {space.category}
                      </div>
                    </div>
                  )}

                  {/* Body Content */}
                  <div style={{ padding: '24px', flex: '1', display: 'flex', flexDirection: 'column' }}>
                    <h3 
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        color: '#1B221B',
                        marginBottom: '10px',
                      }}
                    >
                      {space.title}
                    </h3>
                    <p style={{ color: '#737E72', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0, flex: '1' }}>
                      {space.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}