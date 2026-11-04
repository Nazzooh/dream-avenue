import { motion, AnimatePresence } from 'motion/react';
import { X, Lock } from 'lucide-react';
import { format } from 'date-fns';

interface AdminBlockDateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  blockReason: string;
  setBlockReason: (reason: string) => void;
  onConfirmBlock: () => void;
  isPending: boolean;
}

export function AdminBlockDateDialog({
  isOpen,
  onClose,
  date,
  blockReason,
  setBlockReason,
  onConfirmBlock,
  isPending,
}: AdminBlockDateDialogProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="admin-modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="admin-modal"
          style={{ maxWidth: '460px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="admin-modal-header">
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 650, color: '#B88B52', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Calendar Control
              </p>
              <h3 className="admin-modal-title">Block Venue Date</h3>
            </div>
            <button type="button" className="admin-modal-close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="admin-modal-body">
            <p style={{ fontSize: '0.875rem', color: '#485247', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
              Are you sure you want to block <strong>{format(date, 'MMMM d, yyyy')}</strong> from public inquiries and bookings?
            </p>

            <div className="admin-form-group">
              <label className="admin-label">Reason for Blocking (Optional)</label>
              <input
                type="text"
                className="admin-input"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="e.g. Maintenance, Private VIP event"
              />
            </div>
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="workspace-button workspace-button-secondary"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              className="workspace-button"
              onClick={onConfirmBlock}
              disabled={isPending}
              style={{
                background: '#A1342C',
                color: '#FFFFFF',
                border: 'none',
              }}
            >
              <Lock size={15} />
              {isPending ? 'Blocking...' : 'Confirm Block'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

