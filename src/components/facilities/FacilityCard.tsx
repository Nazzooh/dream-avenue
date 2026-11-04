import { motion } from 'motion/react';
import { Users } from 'lucide-react';
import { getOptimizedSupabaseUrl } from '@/utils/imageUtils';
import { getFacilityIcon } from './facilitiesData';

interface FacilityCardProps {
  space: {
    id: string;
    title: string;
    category?: string;
    capacity?: string;
    subtitles?: string;
    description: string;
    image?: string;
    icon?: string;
  };
  index: number;
  revealCards: boolean;
}

export function FacilityCard({ space, index, revealCards }: FacilityCardProps) {
  const Icon = getFacilityIcon(space.icon);

  // Parse comma-separated subtitles or tags
  const subtitleTags = space.subtitles
    ? (Array.isArray(space.subtitles) ? space.subtitles : space.subtitles.split(','))
        .map((s: string) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <motion.div
      className="mobile-rail-card"
      initial={revealCards ? { opacity: 0, y: 25 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
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
      {/* Space Image or Fallback Header */}
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

          {/* Admin Managed Badge Title / Category */}
          {space.category && (
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(27, 34, 27, 0.82)',
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
          )}

          {/* Capacity Pill */}
          {space.capacity && (
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.94)',
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
          )}
        </div>
      ) : (
        <div
          style={{
            height: '140px',
            background: 'linear-gradient(135deg, #FAF4EB 0%, #EDF6DE 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
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
          {space.category && (
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
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
          )}
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
            marginBottom: '6px',
          }}
        >
          {space.title}
        </h3>

        {/* Elegant Pill Chips for Subtitles & Highlights */}
        {subtitleTags.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginTop: '6px',
              marginBottom: '14px',
            }}
          >
            {subtitleTags.map((sub, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: '#F6F3ED',
                  border: '1px solid #DFD8C9',
                  color: '#4B5548',
                  letterSpacing: '0.01em',
                }}
              >
                {sub}
              </span>
            ))}
          </div>
        )}

        <p style={{ color: '#737E72', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0, flex: '1' }}>
          {space.description}
        </p>
      </div>
    </motion.div>
  );
}
