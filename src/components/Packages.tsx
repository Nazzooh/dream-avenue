import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Users,
  CheckCircle2,
  Clock,
  Sparkle
} from 'lucide-react';
import { usePackages } from '../src/hooks/usePackages';
import { CardSkeleton } from './SkeletonLoader';
import { Package } from '../src/schemas/packages';

const FALLBACK_PACKAGES: Package[] = [
  {
    id: 'pkg-popular',
    name: 'Popular Package',
    description: 'Our most comprehensive package with all amenities, designed for memorable wedding receptions and large celebrations.',
    features: [
      'Full Grand Hall & Staging Access',
      'Central Air-Conditioning Throughout',
      'Air-Conditioned Dining Hall Access',
      'Private Bridal Suite Sanctuary',
      'Generous Parking Plaza Entry',
      'Uninterrupted Generator Power Backup'
    ],
    price: 40000,
    created_at: new Date().toISOString()
  },
  {
    id: 'pkg-demanded',
    name: 'Demanded Package',
    description: 'Our most sought-after event package with essential amenities for vibrant family celebrations and ceremonies.',
    features: [
      'Grand Event Hall Access',
      'Central Air-Conditioning',
      'Dining Hall Access for Guests',
      'Dedicated Stage Setup Area',
      'Dedicated Parking Area',
      'Power Generator Backup'
    ],
    price: 35000,
    created_at: new Date().toISOString()
  },
  {
    id: 'pkg-meeting',
    name: 'Meeting Package',
    description: 'Our premier package configured for business conferences, corporate conclaves, counseling, and seminars.',
    features: [
      'Acoustically Tuned Stage & Hall',
      'Central Air-Conditioning',
      'Seating Setup for Attendees',
      'Executive Dining & Refreshment Area',
      'Parking for Attendees & VIPs',
      'Uninterrupted Power Backup'
    ],
    price: 30000,
    created_at: new Date().toISOString()
  }
];

export function Packages() {
  const navigate = useNavigate();
  const { data: rawPackages = [], isLoading } = usePackages();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Mouse drag-to-scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const packages = (rawPackages && rawPackages.length > 0) ? rawPackages : FALLBACK_PACKAGES;

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    // Calculate approximate active card
    const cardWidth = 380 + 24; // width + gap
    const index = Math.round(scrollLeft / cardWidth);
    setActiveCardIndex(Math.min(Math.max(index, 0), packages.length - 1));
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    updateScrollButtons();
    return () => el.removeEventListener('scroll', updateScrollButtons);
  }, [packages]);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 400;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const scrollToCard = (index: number) => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 380 + 24;
    scrollContainerRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <section 
      id="packages" 
      style={{ 
        background: '#FAF8F5', 
        padding: '100px 24px 90px 24px', 
        borderBottom: '1px solid #E8E3DA',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* SECTION HEADER WITH INTEGRATED CONTROLS */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '24px'
          }}
        >
          <div>
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
              <Sparkles size={14} style={{ color: '#537517' }} />
              <span>Curated Venue Packages</span>
            </div>
            <h2 
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2.1rem, 4.2vw, 3.2rem)',
                color: '#1B221B',
                margin: '0 0 12px 0',
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              Transparent Plans for Every Occasion
            </h2>
            <p style={{ color: '#737E72', fontSize: '1rem', maxWidth: '620px', margin: 0, lineHeight: 1.6 }}>
              Swipe horizontally to explore curated offerings. Choose your preferred plan to pre-fill your reservation folio instantly.
            </p>
          </div>

          {/* DESKTOP / TABLET SLIDER NAVIGATION CONTROLS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#737E72', fontWeight: 600 }}>
              0{activeCardIndex + 1} / 0{packages.length}
            </span>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => scrollByAmount('left')}
                disabled={!canScrollLeft}
                aria-label="Previous Package"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: canScrollLeft ? '#FFFFFF' : 'rgba(232, 227, 218, 0.4)',
                  border: '1px solid #DFCAAB',
                  color: canScrollLeft ? '#1B221B' : '#B0A89C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: canScrollLeft ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  boxShadow: canScrollLeft ? '0 4px 12px rgba(0, 0, 0, 0.06)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (canScrollLeft) {
                    e.currentTarget.style.background = '#537517';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#537517';
                  }
                }}
                onMouseLeave={(e) => {
                  if (canScrollLeft) {
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.color = '#1B221B';
                    e.currentTarget.style.borderColor = '#DFCAAB';
                  }
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={() => scrollByAmount('right')}
                disabled={!canScrollRight}
                aria-label="Next Package"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: canScrollRight ? '#537517' : 'rgba(232, 227, 218, 0.4)',
                  border: canScrollRight ? '1px solid #537517' : '1px solid #DFCAAB',
                  color: canScrollRight ? '#FFFFFF' : '#B0A89C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: canScrollRight ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  boxShadow: canScrollRight ? '0 4px 14px rgba(83, 117, 23, 0.3)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (canScrollRight) {
                    e.currentTarget.style.background = '#3E5811';
                    e.currentTarget.style.borderColor = '#3E5811';
                  }
                }}
                onMouseLeave={(e) => {
                  if (canScrollRight) {
                    e.currentTarget.style.background = '#537517';
                    e.currentTarget.style.borderColor = '#537517';
                  }
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* HORIZONTAL SCROLL CARDS CONTAINER */}
        {isLoading ? (
          <div style={{ display: 'flex', gap: '24px', overflowX: 'hidden' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ flex: '0 0 380px' }}>
                <CardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            style={{
              display: 'flex',
              gap: '24px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              padding: '16px 4px 32px 4px',
              cursor: isDragging ? 'grabbing' : 'grab',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {packages.map((pkg, index) => {
              const isPopular = index === 0;
              const formattedPrice = pkg.price && pkg.price > 0
                ? `\u20B9${Number(pkg.price).toLocaleString('en-IN')}`
                : 'Custom Quote';

              return (
                <div
                  key={pkg.id || index}
                  style={{
                    flex: '0 0 clamp(320px, 84vw, 380px)',
                    scrollSnapAlign: 'start',
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    border: isPopular ? '2px solid #537517' : '1px solid #E8E3DA',
                    boxShadow: isPopular
                      ? '0 16px 40px rgba(83, 117, 23, 0.12)'
                      : '0 8px 24px rgba(27, 34, 27, 0.05)',
                    padding: '36px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    userSelect: 'none',
                  }}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '-13px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#537517',
                        color: '#FFFFFF',
                        padding: '4px 18px',
                        borderRadius: '999px',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 12px rgba(83, 117, 23, 0.35)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Most Popular Choice
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div style={{ marginBottom: '22px' }}>
                      <h3 
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: '1.625rem',
                          fontWeight: 700,
                          color: '#1B221B',
                          marginBottom: '8px',
                          letterSpacing: '-0.015em',
                        }}
                      >
                        {pkg.name}
                      </h3>
                      <p 
                        style={{ 
                          color: '#737E72', 
                          fontSize: '0.90625rem', 
                          lineHeight: 1.55, 
                          minHeight: '44px', 
                          margin: 0 
                        }}
                      >
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
                        marginBottom: '26px',
                      }}
                    >
                      <div 
                        style={{ 
                          fontSize: '0.6875rem', 
                          color: '#737E72', 
                          textTransform: 'uppercase', 
                          letterSpacing: '1px', 
                          fontWeight: 600,
                          marginBottom: '4px' 
                        }}
                      >
                        Package Investment
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span 
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: '2.1rem',
                            fontWeight: 700,
                            color: '#1B221B',
                          }}
                        >
                          {formattedPrice}
                        </span>
                        {pkg.price && pkg.price > 0 && (
                          <span style={{ fontSize: '0.8125rem', color: '#737E72', fontWeight: 500 }}>/ slot</span>
                        )}
                      </div>
                      <div 
                        style={{ 
                          fontSize: '0.75rem', 
                          color: '#537517', 
                          fontWeight: 600, 
                          marginTop: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <span>+</span>
                        <span>\u20B93,000 Mandatory Floor Cleaning Service</span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div style={{ marginBottom: '32px' }}>
                      <div 
                        style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          color: '#1B221B', 
                          textTransform: 'uppercase', 
                          letterSpacing: '1px', 
                          marginBottom: '14px' 
                        }}
                      >
                        Included In This Plan:
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
                        {pkg.features && pkg.features.map((feature: string, fIdx: number) => (
                          <li 
                            key={fIdx} 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'flex-start', 
                              gap: '10px', 
                              fontSize: '0.875rem', 
                              color: '#3B453B',
                              lineHeight: 1.45
                            }}
                          >
                            <div 
                              style={{
                                width: '18px',
                                height: '18px',
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
                              <Check size={11} strokeWidth={3} />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <button
                    type="button"
                    onClick={() => navigate(`/booking?package=${pkg.id}`)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: isPopular ? 'linear-gradient(135deg, #537517 0%, #3B5410 100%)' : '#FFFFFF',
                      color: isPopular ? '#FFFFFF' : '#1B221B',
                      border: isPopular ? 'none' : '1px solid #DFCAAB',
                      borderRadius: '12px',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: isPopular ? '0 6px 18px rgba(83, 117, 23, 0.3)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (isPopular) {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #5F861B 0%, #486614 100%)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      } else {
                        e.currentTarget.style.background = '#FAF8F5';
                        e.currentTarget.style.borderColor = '#537517';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isPopular) {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #537517 0%, #3B5410 100%)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      } else {
                        e.currentTarget.style.background = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#DFCAAB';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <span>Select Plan & Reserve</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* INTERACTIVE CARD INDICATOR PILLS */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '8px', 
            marginTop: '8px',
            marginBottom: '44px' 
          }}
        >
          {packages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToCard(idx)}
              aria-label={`Go to package ${idx + 1}`}
              style={{
                width: activeCardIndex === idx ? '28px' : '8px',
                height: '8px',
                borderRadius: '999px',
                background: activeCardIndex === idx ? '#537517' : '#DFCAAB',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* ALL-INCLUSIVE AMENITIES GUARANTEE BANNER */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E8E3DA',
            borderRadius: '20px',
            padding: '24px 28px',
            boxShadow: '0 8px 24px rgba(27, 34, 27, 0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div 
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#EDF6DE',
                color: '#537517',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#1B221B', fontSize: '0.9375rem' }}>
                Every Package Includes Full Sanctuary Standards
              </div>
              <div style={{ color: '#737E72', fontSize: '0.8125rem', marginTop: '2px' }}>
                Central Air Conditioning &bull; Heavy-Duty Generator Power Backup &bull; Dedicated Security &bull; Eco Zero-Plastic Hall
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/booking')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              background: '#FAF8F5',
              border: '1px solid #DFCAAB',
              color: '#537517',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#537517';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.borderColor = '#537517';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FAF8F5';
              e.currentTarget.style.color = '#537517';
              e.currentTarget.style.borderColor = '#DFCAAB';
            }}
          >
            <span>Compare Time Slots</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
