import { Lock } from 'lucide-react';
import { format } from 'date-fns';
import { Modal } from '../admin-v2/Modal';

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Block Venue Date"
      description={`Block ${format(date, 'MMMM d, yyyy')} from inquiries`}
      size="sm"
      alert
      footer={
        <div className="admin-modal-actions">
          <button
            type="button"
            className="workspace-button"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            className="workspace-button workspace-button-danger inline-flex items-center gap-1.5"
            onClick={onConfirmBlock}
            disabled={isPending}
          >
            <Lock size={15} />
            {isPending ? 'Blocking...' : 'Confirm Block'}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <p style={{ fontSize: '0.875rem', color: '#485247', lineHeight: 1.5, margin: 0 }}>
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
    </Modal>
  );
}
