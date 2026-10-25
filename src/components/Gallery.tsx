import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { X, ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';
import { useGalleryItems } from '../src/hooks/useGallery';
import { GalleryImageSkeleton } from './SkeletonLoader';

const CURATED_GALLERY_FALLBACKS = [
  {
    id: 'gal-1',
    image_url: '/new-gallery-images/banquet-hall.png',
    title: 'The Grand Event Hall',
    category: 'Architecture',
  },
  {
    id: 'gal-2',
    image_url: '/new-gallery-images/dining.png',
    title: 'Banquet Dining Hall',
    category: 'Dining',
  },
  {
    id: 'gal-3',
    image_url: '/new-gallery-images/outdoor.png',
    title: 'Landscaped Garden & Lawn',
    category: 'Outdoor',
  },
  {
    id: 'gal-4',
    image_url: '/new-gallery-images/corporate-event.png',
    title: 'Conclave & Stage Setup',
    category: 'Ceremony',
  },
];

export function Gallery() {
  const { data: rawImages = [], isLoading } = useGalleryItems();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const galleryImages = (rawImages && rawImages.length > 0) ? rawImages : CURATED_GALLERY_FALLBACKS;

  const categories = ['All', 'Hall', 'Dining', 'Outdoor', 'Ceremony'];

  const filteredImages = activeFilter === 'All'
    ? galleryImages
    : galleryImages.filter((img: any) => 
        (img.category && img.category.toLowerCase().includes(activeFilter.toLowerCase())) ||
        (img.title && img.title.toLowerCase().includes(activeFilter.toLowerCase()))
      );

  const displayList = filteredImages.length > 0 ? filteredImages : galleryImages;

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayList.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayList.length) % displayList.length);
  };

  return (
    <section id="gallery" style={{ background: '#FAF8F5', padding: '100px 24px', borderBottom: '1px solid #E8E3DA' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
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
            Visual Journey
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
            A Glimpse Into Dream Avenue
          </h2>
          <p style={{ color: '#737E72', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Explore the harmonious architecture, ambient lighting, and celebratory spaces that bring your milestones to life.
          </p>

          {/* Filter Pills */}
          <div 
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '32px',
            }}
          >
            {categories.map((cat) => {
              const isSelected = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '999px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    border: isSelected ? '1px solid #537517' : '1px solid #E8E3DA',
                    background: isSelected ? '#537517' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#485247',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {[1, 2, 3, 4].map((i) => (
              <GalleryImageSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {displayList.map((image: any, index: number) => (
              <motion.div
                key={image.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() => openLightbox(index)}
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  height: '320px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: '#F4EFEB',
                  border: '1px solid #E8E3DA',
                  boxShadow: '0 4px 16px rgba(27, 34, 27, 0.04)',
                }}
                whileHover={{
                  y: -4,
                  boxShadow: '0 16px 36px rgba(27, 34, 27, 0.08)',
                  borderColor: '#DFCAAB',
                }}
              >
                <ImageWithFallback
                  src={image.image_url}
                  alt={image.title || 'Dream Avenue Event Hall'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(27, 34, 27, 0.75) 0%, transparent 60%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '20px',
                    color: '#FAF8F5',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      {image.category && (
                        <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#DFCAAB', marginBottom: '2px' }}>
                          {image.category}
                        </div>
                      )}
                      <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.15rem', margin: 0, fontWeight: 600 }}>
                        {image.title || 'Event Hall Ambiance'}
                      </h4>
                    </div>
                    <div 
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Eye size={16} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxOpen && displayList[currentImageIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 200,
                background: 'rgba(17, 24, 18, 0.95)',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
              }}
              onClick={closeLightbox}
            >
              <button
                onClick={closeLightbox}
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#FFFFFF',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={24} />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                style={{
                  position: 'absolute',
                  left: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#FFFFFF',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronLeft size={28} />
              </button>

              <div 
                style={{ maxWidth: '900px', maxHeight: '80vh', position: 'relative' }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={displayList[currentImageIndex].image_url}
                  alt={displayList[currentImageIndex].title || 'Dream Avenue Event Hall'}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '75vh',
                    borderRadius: '16px',
                    objectFit: 'contain',
                    boxShadow: '0 20px 48px rgba(0, 0, 0, 0.4)',
                  }}
                />
                {displayList[currentImageIndex].title && (
                  <div style={{ textAlign: 'center', color: '#FAF8F5', marginTop: '14px', fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem' }}>
                    {displayList[currentImageIndex].title}
                  </div>
                )}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                style={{
                  position: 'absolute',
                  right: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#FFFFFF',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronRight size={28} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}