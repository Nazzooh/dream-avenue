import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useFacilities } from '@/hooks/useFacilities';
import { FacilitySkeleton } from './SkeletonLoader';
import { CURATED_SPACES } from './facilities/facilitiesData';
import { FacilityCard } from './facilities/FacilityCard';

export function Facilities() {
  const { data: facilities, isLoading } = useFacilities();
  const [showAll, setShowAll] = useState(false);

  // Merge remote facilities with curated imagery if remote facilities exist
  const displayItems = (facilities && facilities.length > 0)
    ? facilities.map((f: any, idx: number) => ({
        id: f.id,
        title: f.title || f.name,
        category: f.category || CURATED_SPACES[idx % CURATED_SPACES.length].category,
        capacity: f.capacity || CURATED_SPACES[idx % CURATED_SPACES.length].capacity,
        subtitles: f.subtitles || CURATED_SPACES[idx % CURATED_SPACES.length].subtitles,
        description: f.description || CURATED_SPACES[idx % CURATED_SPACES.length].description,
        image: f.image_url || f.image || CURATED_SPACES[idx % CURATED_SPACES.length].image,
        icon: f.icon || CURATED_SPACES[idx % CURATED_SPACES.length].icon,
      }))
    : CURATED_SPACES;

  // Show top 6 cards initially; toggle to view all
  const visibleItems = showAll ? displayItems : displayItems.slice(0, 6);

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
          <>
            <div
              className="mobile-card-rail"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '32px',
              }}
            >
              {visibleItems.map((space: any, index: number) => (
                <FacilityCard
                  key={space.id || index}
                  space={space}
                  index={index}
                />
              ))}
            </div>

            {/* Top 6 Expansion Action: See More / Show Less */}
            {displayItems.length > 6 && (
              <div style={{ textAlign: 'center', marginTop: '48px' }}>
                <button
                  type="button"
                  onClick={() => setShowAll((prev) => !prev)}
                  className="btn-editorial-outline"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '13px 30px',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                  }}
                >
                  <span>
                    {showAll ? 'Show Fewer Facilities' : `Explore All Facilities (${displayItems.length})`}
                  </span>
                  <ChevronDown
                    size={17}
                    style={{
                      transform: showAll ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.25s ease',
                    }}
                  />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
