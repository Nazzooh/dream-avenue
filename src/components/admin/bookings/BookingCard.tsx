import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, Calendar, Clock, Users, Eye, Ban } from 'lucide-react';
import { StatusBadge } from '../../admin-v2/StatusBadge';
import { Booking } from '@/schemas/bookings';

interface BookingCardProps {
  booking: Booking;
  onView: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
  formatDate: (date: string | null | undefined) => string;
  formatTime: (time: string | null | undefined) => string;
  delay: number;
}

export function BookingCard({ 
  booking, 
  onView, 
  onCancel, 
  formatDate, 
  formatTime, 
  delay 
}: BookingCardProps) {
  const initials = booking.full_name
    ? booking.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'BK';

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay, ease: [0.16, 1, 0.3, 1] }}
      className="da-booking-card-mobile"
      onClick={() => onView(booking)}
    >
      <div className="da-booking-card-top">
        <div className="da-booking-avatar">
          {initials}
        </div>
        <div className="da-booking-card-info">
          <div className="da-booking-card-title-row">
            <h3>{booking.full_name || 'Unnamed client'}</h3>
            <StatusBadge status={booking.status} />
          </div>
          {booking.event_type && (
            <span className="da-booking-card-event-badge">
              {booking.event_type.replace(/_/g, ' ')}
            </span>
          )}
          <div className="da-booking-card-contacts">
            {booking.mobile && (
              <a 
                href={`tel:${booking.mobile}`} 
                onClick={(e) => e.stopPropagation()} 
                className="da-booking-contact-pill"
                title={`Call ${booking.mobile}`}
              >
                <Phone size={12} />
                <span>{booking.mobile}</span>
              </a>
            )}
            {booking.email && (
              <a 
                href={`mailto:${booking.email}`} 
                onClick={(e) => e.stopPropagation()} 
                className="da-booking-contact-pill"
                title={`Email ${booking.email}`}
              >
                <Mail size={12} />
                <span>{booking.email}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="da-booking-card-specs-grid">
        <div className="da-booking-spec-box">
          <span className="da-booking-spec-label">EVENT DATE</span>
          <div className="da-booking-spec-value">
            <Calendar size={13} />
            <span>{formatDate(booking.booking_date)}</span>
          </div>
        </div>
        <div className="da-booking-spec-box">
          <span className="da-booking-spec-label">TIME</span>
          <div className="da-booking-spec-value">
            <Clock size={13} />
            <span>{formatTime(booking.start_time)}</span>
          </div>
        </div>
        <div className="da-booking-spec-box">
          <span className="da-booking-spec-label">GUESTS</span>
          <div className="da-booking-spec-value">
            <Users size={13} />
            <span>{booking.guest_count || 0}</span>
          </div>
        </div>
      </div>

      <div className="da-booking-card-actions">
        <button
          type="button"
          className="da-booking-detail-action"
          onClick={(e) => {
            e.stopPropagation();
            onView(booking);
          }}
          aria-label={`View booking details for ${booking.full_name || 'unnamed client'}`}
        >
          <Eye size={14} />
          <span>Details</span>
        </button>
        {booking.status === 'confirmed' && (
          <button
            type="button"
            className="da-booking-cancel-action"
            onClick={(e) => {
              e.stopPropagation();
              onCancel(booking);
            }}
            aria-label={`Cancel booking for ${booking.full_name || 'unnamed client'}`}
          >
            <Ban size={14} />
            <span>Cancel</span>
          </button>
        )}
      </div>
    </motion.article>
  );
}
