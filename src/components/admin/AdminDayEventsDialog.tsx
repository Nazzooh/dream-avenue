import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import type { CalendarEvent } from '@/api/calendar';

interface AdminDayEventsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  events: CalendarEvent[];
  onEventClick: (bookingId?: string | null) => void;
}

export function AdminDayEventsDialog({
  isOpen,
  onClose,
  date,
  events,
  onEventClick,
}: AdminDayEventsDialogProps) {
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
          style={{ maxWidth: '520px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="admin-modal-header">
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 650, color: '#B88B52', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Schedule Overview
              </p>
              <h3 className="admin-modal-title">Events on {format(date, 'MMMM d, yyyy')}</h3>
            </div>
            <button type="button" className="admin-modal-close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#737E72' }}>
                <CalendarIcon size={36} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>No scheduled events on this date.</p>
              </div>
            ) : (
              events.map((event, idx) => {
                const bookingId = event.booking_ids && event.booking_ids.length > 0 ? event.booking_ids[0] : event.id;
                const timeLabel = event.start_date && event.end_date 
                  ? `${event.start_date} - ${event.end_date}` 
                  : `${event.bookings_count || 1} confirmed booking(s)`;

                return (
                  <button
                    key={bookingId || idx}
                    type="button"
                    onClick={() => onEventClick(bookingId)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '1px solid #E8E3DA',
                      background: '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#537517';
                      e.currentTarget.style.background = '#FAF8F5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E8E3DA';
                      e.currentTarget.style.background = '#FFFFFF';
                    }}
                  >
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: '#1B221B', marginBottom: '4px' }}>
                        {event.title || 'Venue Event'}
                      </strong>
                      <span style={{ fontSize: '0.8125rem', color: '#737E72' }}>
                        {timeLabel} {event.guests_count ? `• ${event.guests_count} Guests` : ''}
                      </span>
                    </div>
                    <ExternalLink size={16} color="#537517" />
                  </button>
                );
              })
            )}
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="workspace-button workspace-button-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

