import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryLightboxProps {
  isOpen: boolean;
  images: any[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function GalleryLightbox({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: GalleryLightboxProps) {
  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && currentImage && (
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
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close lightbox"
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
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Previous photo"
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
              src={currentImage.image_url}
              alt={currentImage.title || 'Dream Avenue Event Hall'}
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                borderRadius: '16px',
                objectFit: 'contain',
                boxShadow: '0 20px 48px rgba(0, 0, 0, 0.4)',
              }}
            />
            {currentImage.title && (
              <div
                style={{
                  textAlign: 'center',
                  color: '#FAF8F5',
                  marginTop: '14px',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.25rem',
                }}
              >
                {currentImage.title}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next photo"
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
  );
}
