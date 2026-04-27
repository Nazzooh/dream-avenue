import { motion } from 'framer-motion';
import { User, Phone, Mail, Calendar, Clock, Users, Eye, Ban } from 'lucide-react';
import { StatusBadge } from '../../admin-v2/StatusBadge';
import { Booking } from '../../../src/schemas/bookings';

export function BookingCard({ booking, onView, onCancel, formatDate, formatTime, delay }: {
  booking: Booking;
  onView: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
  formatDate: (date: string | null | undefined) => string;
  formatTime: (time: string | null | undefined) => string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay, ease: "easeOut" }}
      className="p-[clamp(0.75rem,2.5vw,1.5rem)] rounded-2xl transition-all duration-200 cursor-pointer"
      style={{
        background: 'white',
        border: '2px solid #E8E5DB',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}
      onClick={() => onView(booking)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#C8D46B';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(200, 212, 107, 0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E8E5DB';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-[clamp(0.75rem,2vw,1rem)]">
        {/* Client Info - Fluid Layout */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] mb-[0.75em]">
            <div 
              className="rounded-full flex items-center justify-center flex-shrink-0 text-[clamp(0.875rem,1.5vw,1rem)]"
              style={{ 
                background: 'linear-gradient(135deg, #C8D46B, #B5C55A)', 
                color: 'white',
                width: '3em',
                height: '3em'
              }}
            >
              <User className="w-[1.5em] h-[1.5em]" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[clamp(1rem,2vw,1.25rem)] leading-tight mb-[0.25em] truncate" style={{ color: '#2A2A2A' }}>
                {booking.full_name}
              </h3>
              <div className="flex flex-wrap items-center gap-[0.75em] text-[clamp(0.75rem,1.5vw,0.875rem)]" style={{ color: '#666' }}>
                <div className="flex items-center gap-[0.25em]">
                  <Phone className="w-[1em] h-[1em]" />
                  {booking.mobile}
                </div>
                {booking.email && (
                  <div className="flex items-center gap-[0.25em] min-w-0">
                    <Mail className="w-[1em] h-[1em]" />
                    <span className="truncate">{booking.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Event Details - Flexible Grid */}
        <div className="flex flex-wrap gap-x-[clamp(1rem,3vw,1.5rem)] gap-y-[0.75em] text-[clamp(0.75rem,1.5vw,0.875rem)]">
          <div className="min-w-[120px]">
            <div className="text-[0.85em] mb-[0.25em]" style={{ color: '#999' }}>Event Date</div>
            <div className="flex items-center gap-[0.5em]" style={{ color: '#2A2A2A' }}>
              <Calendar className="w-[1em] h-[1em]" />
              {formatDate(booking.booking_date)}
            </div>
          </div>
          
          <div className="min-w-[100px]">
            <div className="text-[0.85em] mb-[0.25em]" style={{ color: '#999' }}>Time</div>
            <div className="flex items-center gap-[0.5em]" style={{ color: '#2A2A2A' }}>
              <Clock className="w-[1em] h-[1em]" />
              {formatTime(booking.start_time)}
            </div>
          </div>

          {booking.guest_count && (
            <div className="min-w-[80px]">
              <div className="text-[0.85em] mb-[0.25em]" style={{ color: '#999' }}>Guests</div>
              <div className="flex items-center gap-[0.5em]" style={{ color: '#2A2A2A' }}>
                <Users className="w-[1em] h-[1em]" />
                {booking.guest_count}
              </div>
            </div>
          )}
        </div>

        {/* Status and Actions */}
        <div className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] lg:pl-[clamp(0.75rem,2vw,1rem)] lg:border-l-2" style={{ borderColor: '#E8E5DB' }}>
          <StatusBadge 
            status={booking.status} 
          />
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(booking);
            }}
            className="rounded-xl transition-all duration-200 text-[clamp(0.875rem,1.5vw,1rem)]"
            style={{
              background: 'linear-gradient(135deg, #C8D46B, #B5C55A)',
              color: 'white',
              padding: 'clamp(0.5rem,1.5vw,0.625rem)'
            }}
          >
            <Eye className="w-[1em] h-[1em]" />
          </button>

          {booking.status === 'confirmed' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel(booking);
              }}
              className="rounded-xl transition-all duration-200 text-[clamp(0.875rem,1.5vw,1rem)]"
              style={{
                background: 'white',
                border: '2px solid #E57373',
                color: '#E57373',
                padding: 'clamp(0.5rem,1.5vw,0.625rem)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#E57373';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#E57373';
              }}
            >
              <Ban className="w-[1em] h-[1em]" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
