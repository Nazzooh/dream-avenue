import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { useBlockDate, useUnblockDate, useCalendarEvents } from '@/hooks/useCalendar';
import { AdminManualBookingModal } from './AdminManualBookingModal';
import { AdminBlockDateDialog } from './AdminBlockDateDialog';
import { AdminDayEventsDialog } from './AdminDayEventsDialog';
import { AdminDateActionButtons } from './AdminDateActionButtons';

interface AdminDateActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
}

export function AdminDateActionModal({ isOpen, onClose, date }: AdminDateActionModalProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showManualBooking, setShowManualBooking] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showEventsDialog, setShowEventsDialog] = useState(false);
  const [blockReason, setBlockReason] = useState('');

  const dateStr = format(date, 'yyyy-MM-dd');
  const { data: events = [] } = useCalendarEvents(dateStr, dateStr);
  const blockDateMutation = useBlockDate();
  const unblockDateMutation = useUnblockDate();

  const isBlocked = events.some((event) => event.type === 'blocked' || event.title?.toLowerCase().includes('blocked'));
  const hasEvents = events.length > 0 && (events[0].bookings_count || 0) > 0;
  const eventCount = events[0]?.bookings_count || events.length;

  const handleBlockConfirm = async () => {
    if (!user?.id) {
      toast.error('Authentication required');
      return;
    }

    try {
      await blockDateMutation.mutateAsync({
        date: dateStr,
        reason: blockReason,
        admin_id: user.id,
      });
      toast.success(`Date ${format(date, 'MMM d, yyyy')} blocked successfully`);
      setShowBlockDialog(false);
      setBlockReason('');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to block date');
    }
  };

  const handleUnblock = async () => {
    if (!user?.id) {
      toast.error('Authentication required');
      return;
    }

    try {
      await unblockDateMutation.mutateAsync({
        date: dateStr,
        admin_id: user.id,
      });
      toast.success(`Date ${format(date, 'MMM d, yyyy')} unblocked successfully`);
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to unblock date');
    }
  };

  if (!isOpen) return null;

  if (showManualBooking) {
    return (
      <AdminManualBookingModal
        isOpen={showManualBooking}
        onClose={() => {
          setShowManualBooking(false);
          onClose();
        }}
        preselectedDate={dateStr}
      />
    );
  }

  if (showBlockDialog) {
    return (
      <AdminBlockDateDialog
        isOpen={showBlockDialog}
        onClose={() => setShowBlockDialog(false)}
        date={date}
        blockReason={blockReason}
        setBlockReason={setBlockReason}
        onConfirmBlock={handleBlockConfirm}
        isPending={blockDateMutation.isPending}
      />
    );
  }

  if (showEventsDialog) {
    return (
      <AdminDayEventsDialog
        isOpen={showEventsDialog}
        onClose={() => setShowEventsDialog(false)}
        date={date}
        events={events}
        onEventClick={(bookingId) => {
          navigate(bookingId ? `/admin/bookings?id=${bookingId}` : '/admin/bookings');
          onClose();
        }}
      />
    );
  }

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
          style={{ maxWidth: '480px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="admin-modal-header">
            <div>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#B88B52',
                  marginBottom: '2px',
                }}
              >
                Date Actions
              </span>
              <h3 className="admin-modal-title">
                {format(date, 'MMMM d, yyyy')}
              </h3>
            </div>
            <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          {/* Action List */}
          <div className="admin-modal-body">
            <AdminDateActionButtons
              isBlocked={isBlocked}
              hasEvents={hasEvents}
              eventCount={eventCount}
              isUnblocking={unblockDateMutation.isPending}
              onAddManualBooking={() => setShowManualBooking(true)}
              onBlockClick={() => setShowBlockDialog(true)}
              onUnblockClick={handleUnblock}
              onViewEventsClick={() => setShowEventsDialog(true)}
            />
          </div>

          {/* Footer */}
          <div className="admin-modal-footer">
            <button
              type="button"
              className="workspace-button workspace-button-secondary"
              onClick={onClose}
              style={{ width: '100%' }}
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
