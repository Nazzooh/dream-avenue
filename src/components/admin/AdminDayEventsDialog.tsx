import { Calendar as CalendarIcon, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import type { CalendarEvent } from '@/api/calendar';
import { Modal } from '../admin-v2/Modal';

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Events on ${format(date, 'MMMM d, yyyy')}`}
      description="Scheduled events and bookings on this date"
      size="md"
      footer={
        <div className="admin-modal-actions">
          <button
            type="button"
            className="workspace-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
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
                className="flex items-center justify-between p-3.5 rounded-xl border border-[#E8E3DA] bg-white hover:border-[#58761B] hover:bg-[#FAF8F5] transition-all text-left w-full cursor-pointer"
              >
                <div>
                  <strong className="block text-sm text-[#1B221B] mb-0.5">
                    {event.title || 'Venue Event'}
                  </strong>
                  <span className="text-xs text-[#737E72]">
                    {timeLabel} {event.guests_count ? `• ${event.guests_count} Guests` : ''}
                  </span>
                </div>
                <ExternalLink size={16} className="text-[#58761B] flex-shrink-0 ml-2" />
              </button>
            );
          })
        )}
      </div>
    </Modal>
  );
}
