import { motion } from 'motion/react';
import { Plus, Lock, Unlock, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';

interface AdminDateActionButtonsProps {
  isBlocked: boolean;
  hasEvents: boolean;
  eventCount: number;
  isUnblocking: boolean;
  onAddManualBooking: () => void;
  onBlockClick: () => void;
  onUnblockClick: () => void;
  onViewEventsClick: () => void;
}

export function AdminDateActionButtons({
  isBlocked,
  hasEvents,
  eventCount,
  isUnblocking,
  onAddManualBooking,
  onBlockClick,
  onUnblockClick,
  onViewEventsClick,
}: AdminDateActionButtonsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {!isBlocked && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.015, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddManualBooking}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem 1.15rem',
            borderRadius: '14px',
            border: '1.5px solid #D5E5B8',
            background: '#F3F7ED',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#537517',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0,
            }}
          >
            <Plus size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: '#1B221B', marginBottom: '2px' }}>
              Add Manual Booking
            </strong>
            <span style={{ fontSize: '0.8125rem', color: '#537517' }}>
              Create a direct reservation for this date
            </span>
          </div>
          <ArrowRight size={16} color="#537517" />
        </motion.button>
      )}

      {isBlocked ? (
        <motion.button
          type="button"
          whileHover={{ scale: 1.015, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onUnblockClick}
          disabled={isUnblocking}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem 1.15rem',
            borderRadius: '14px',
            border: '1.5px solid #DFCAAB',
            background: '#F7EEDF',
            cursor: isUnblocking ? 'wait' : 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#B88B52',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0,
            }}
          >
            <Unlock size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: '#1B221B', marginBottom: '2px' }}>
              Unblock Date
            </strong>
            <span style={{ fontSize: '0.8125rem', color: '#8C5E24' }}>
              Make this date available again for bookings
            </span>
          </div>
          <ArrowRight size={16} color="#8C5E24" />
        </motion.button>
      ) : (
        <motion.button
          type="button"
          whileHover={{ scale: 1.015, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBlockClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem 1.15rem',
            borderRadius: '14px',
            border: '1.5px solid #F0C4B8',
            background: '#FDF3F1',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#A1342C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0,
            }}
          >
            <Lock size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: '#1B221B', marginBottom: '2px' }}>
              Block Date
            </strong>
            <span style={{ fontSize: '0.8125rem', color: '#A1342C' }}>
              Prevent reservations and public inquiries
            </span>
          </div>
          <ArrowRight size={16} color="#A1342C" />
        </motion.button>
      )}

      {hasEvents && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.015, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewEventsClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem 1.15rem',
            borderRadius: '14px',
            border: '1.5px solid #E8E3DA',
            background: '#FFFFFF',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#1B221B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0,
            }}
          >
            <CalendarIcon size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: '#1B221B', marginBottom: '2px' }}>
              View Scheduled Events
            </strong>
            <span style={{ fontSize: '0.8125rem', color: '#737E72' }}>
              {eventCount} active reservation(s) on this date
            </span>
          </div>
          <ArrowRight size={16} color="#737E72" />
        </motion.button>
      )}
    </div>
  );
}

