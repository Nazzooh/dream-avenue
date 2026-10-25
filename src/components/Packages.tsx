import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, ArrowRight, ShieldCheck, Users } from 'lucide-react';
import { usePackages } from '../src/hooks/usePackages';
import { CardSkeleton } from './SkeletonLoader';
import { useState } from 'react';
import { Package } from '../src/schemas/packages';
import { getOptimizedSupabaseUrl } from '../src/utils/imageUtils';

const FALLBACK_PACKAGES: Package[] = [
  {
    id: 'pkg-wedding',
    name: 'Bespoke Wedding Package',
    description: 'A complete curated offering for your milestone celebration, featuring grand hall access, bridal suite, and dedicated coordination.',
    features: ['Grand Hall & Stage Setup', 'Air-Conditioned Dining Hall Access', 'Private Bridal Suite Sanctuary', 'Dedicated Event Coordinator', 'Generous Parking & Valet Entry'],
    price: 45000,
    created_at: new Date().toISOString()
  },
  {
    id: 'pkg-corporate',
    name: 'Corporate Conclave',
    description: 'Professional setup tailored for business summits, awards nights, and conferences with reliable acoustics and comfort.',
    features: ['State-of-the-Art Acoustic Setup', 'High-Speed Connectivity', 'Banquet Dining for Attendees', 'Executive Restrooms & Green Room', 'Uninterrupted Generator Power Backup'],
    price: 38000,
    created_at: new Date().toISOString()
  },
  {
    id: 'pkg-celebration',
    name: 'Milestone Celebration',
    description: 'Perfect for family anniversaries, receptions, and gatherings requiring versatile floor plans and warm Malabar hospitality.',
    features: ['Flexible Seating Configurations', 'Dedicated Buffet Preparation Area', 'Ambient Decorative Lighting', 'Integrated Stage & Audio System', 'Cleaning & Security Support'],
    price: 32000,
    created_at: new Date().toISOString()
  }
];

export function Packages() {
  const navigate = useNavigate();
  const { data: rawPackages = [], isLoading } = usePackages();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const packages = (rawPackages && rawPackages.length > 0) ? rawPackages : FALLBACK_PACKAGES;

  return (
    <section id="packages" style={{ background: '#F8F5EF', padding: '100px 24px', borderBottom: '1px solid #E8E3DA' }}>
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
            Curated Packages
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
            Transparent Plans for Every Occasion
          </h2>
          <p style={{ color: '#737E72', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Designed for clear expectations and effortless planning. Select a package below to pre-fill your reservation directly.
          </p>
        </div>

        {/* Packages Grid */}
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
              alignItems: 'stretch',
            }}
          >
            {packages.map((pkg, index) => {
              const isFeatured = index === 0;
              const priceDisplay = pkg.price && pkg.price > 0 
                ? `₹${Number(pkg.price).toLocaleString('en-IN')}` 
                : 'Custom Quote';

              return (
                <motion.div
                  key={pkg.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredCard(pkg.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    border: isFeatured ? '2px solid #537517' : '1px solid #E8E3DA',
                    boxShadow: isFeatured ? '0 16px 36px rgba(83, 117, 23, 0.1)' : '0 8px 24px rgba(27, 34, 27, 0.04)',
                    padding: '36px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  whileHover={{
                    y: -6,
                    boxShadow: '0 20px 48px rgba(27, 34, 27, 0.08)',
                    borderColor: '#537517',
                  }}
                >
                  {/* Featured Ribbon */}
                  {isFeatured && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '-14px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#537517',
                        color: '#FFFFFF',
                        padding: '4px 16px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 12px rgba(83, 117, 23, 0.3)',
                      }}
                    >
                      Most Popular Choice
                    </div>
                  )}

                  {/* Header */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: '#1B221B',
                        marginBottom: '10px',
                      }}
                    >
                      {pkg.name}
                    </h3>
                    <p style={{ color: '#737E72', fontSize: '0.9375rem', lineHeight: 1.55, minHeight: '44px', margin: 0 }}>
                      {pkg.description}
                    </p>
                  </div>

                  {/* Pricing Box */}
                  <div 
                    style={{
                      padding: '18px 20px',
                      background: '#FAF8F5',
                      borderRadius: '16px',
                      border: '1px solid #F0EBE2',
                      marginBottom: '28px',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', color: '#737E72', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Package Investment
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span 
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: '2rem',
                          fontWeight: 700,
                          color: '#1B221B',
                        }}
                      >
                        {priceDisplay}
                      </span>
                      {pkg.price && pkg.price > 0 && (
                        <span style={{ fontSize: '0.8125rem', color: '#737E72' }}>/ slot</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#537517', fontWeight: 600, marginTop: '4px' }}>
                      + ₹3,000 Mandatory Floor Cleaning Service
                    </div>
                  </div>

                  {/* Features List */}
                  <div style={{ flex: '1', marginBottom: '32px' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1B221B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>
                      Included In This Plan:
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {pkg.features && pkg.features.map((feature: string, fIdx: number) => (
                        <li key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9375rem', color: '#485247' }}>
                          <div 
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: '#EDF6DE',
                              color: '#537517',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '2px',
                            }}
                          >
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action CTA */}
                  <button
                    onClick={() => navigate(`/booking?package=${pkg.id}`)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: isFeatured ? '#537517' : '#FFFFFF',
                      color: isFeatured ? '#FFFFFF' : '#1B221B',
                      border: isFeatured ? 'none' : '1px solid #DFCAAB',
                      borderRadius: '12px',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: isFeatured ? '0 4px 14px rgba(83, 117, 23, 0.25)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (isFeatured) {
                        e.currentTarget.style.background = '#3E5811';
                      } else {
                        e.currentTarget.style.borderColor = '#537517';
                        e.currentTarget.style.color = '#537517';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isFeatured) {
                        e.currentTarget.style.background = '#537517';
                      } else {
                        e.currentTarget.style.borderColor = '#DFCAAB';
                        e.currentTarget.style.color = '#1B221B';
                      }
                    }}
                  >
                    <span>Reserve Package</span>
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}