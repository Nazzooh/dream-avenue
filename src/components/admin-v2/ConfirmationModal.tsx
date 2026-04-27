import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export function ConfirmationModal({ title, message, confirmText, cancelText, onConfirm, onCancel, isDangerous }: {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        background: 'rgba(0, 0, 0, 0.6)', 
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        padding: 'clamp(1rem,4vw,2rem)'
      }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="rounded-3xl"
        style={{
          background: 'white',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          width: '100%',
          maxWidth: 'min(28rem, 95vw)',
          padding: 'clamp(1.5rem,4vw,2rem)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="mx-auto mb-[1.5em] rounded-2xl flex items-center justify-center"
          style={{ 
            background: isDangerous 
              ? 'linear-gradient(135deg, #E57373, #EF5350)' 
              : 'linear-gradient(135deg, #C8D46B, #B5C55A)',
            color: 'white',
            width: 'clamp(4rem,12vw,5rem)',
            height: 'clamp(4rem,12vw,5rem)'
          }}
        >
          <AlertCircle style={{ width: '50%', height: '50%' }} />
        </div>
        
        <h3 className="text-center mb-[0.75em] text-[clamp(1.25rem,3vw,1.75rem)]" style={{ color: '#2A2A2A' }}>
          {title}
        </h3>
        <p className="text-center mb-[2em] text-[clamp(0.875rem,1.5vw,1rem)]" style={{ color: '#666', lineHeight: '1.6' }}>
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-[clamp(0.5rem,1.5vw,0.75rem)]">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl transition-all duration-200 text-[clamp(0.875rem,1.5vw,1rem)]"
            style={{
              background: '#F5F3EE',
              color: '#666',
              padding: 'clamp(0.75rem,2vw,1rem) clamp(1rem,2.5vw,1.5rem)'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl transition-all duration-200 text-[clamp(0.875rem,1.5vw,1rem)]"
            style={{
              background: isDangerous 
                ? 'linear-gradient(135deg, #E57373, #EF5350)' 
                : 'linear-gradient(135deg, #C8D46B, #B5C55A)',
              color: 'white',
              boxShadow: isDangerous 
                ? '0 4px 12px rgba(229, 115, 115, 0.3)' 
                : '0 4px 12px rgba(200, 212, 107, 0.3)',
              padding: 'clamp(0.75rem,2vw,1rem) clamp(1rem,2.5vw,1.5rem)'
            }}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
