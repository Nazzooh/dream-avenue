import React from 'react';
import { Calendar, Clock, Eye, Ban, Users } from 'lucide-react';
import { Booking } from '@/schemas/bookings';
import { StatusBadge } from '../../admin-v2/StatusBadge';

interface BookingTableProps {
  bookings: Booking[];
  onView: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
  formatDate: (date: string | null | undefined) => string;
  formatTime: (time: string | null | undefined) => string;
}

function formatEventType(value: string | null | undefined) {
  return value?.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) || 'Not specified';
}

function formatAmount(value: number | null | undefined) {
  return typeof value === 'number' && value > 0
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
    : 'Not calculated';
}

export function BookingTable({ bookings, onView, onCancel, formatDate, formatTime }: BookingTableProps) {
  return (
    <div className="da-booking-table hidden md:block">
      <table className="da-booking-table-grid">
        <thead>
          <tr>
            <th className="da-booking-client-col">Client</th>
            <th className="da-booking-schedule-col">Schedule</th>
            <th className="da-booking-type-col">Booking</th>
            <th className="da-booking-guests-col">Guests</th>
            <th className="da-booking-status-col">Status</th>
            <th className="da-booking-actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr 
              key={booking.id} 
              className="da-booking-table-row"
              onClick={() => onView(booking)}
              title="Click row to view details"
            >
              <td className="da-booking-client-cell">
                <div className="da-booking-client">
                  <div className="da-booking-avatar">
                    {(booking.full_name || 'BK').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="da-booking-client-copy">
                    <p>{booking.full_name || 'Unnamed client'}</p>
                    <span>{booking.mobile || booking.email || 'No contact details'}</span>
                  </div>
                </div>
              </td>
              <td className="da-booking-schedule-cell">
                <div className="da-booking-schedule">
                  <div>
                    <Calendar aria-hidden="true" />
                    {formatDate(booking.booking_date)}
                  </div>
                  <div>
                    <Clock aria-hidden="true" />
                    {formatTime(booking.start_time)}
                  </div>
                </div>
              </td>
              <td className="da-booking-type-cell">
                <div className="da-booking-type">
                  <span>{formatEventType(booking.event_type)}</span>
                  <p>{formatAmount(booking.final_price)}</p>
                </div>
              </td>
              <td className="da-booking-guests-cell">
                <div>
                  <Users aria-hidden="true" />
                  {booking.guest_count || 0}
                </div>
              </td>
              <td className="da-booking-status-cell">
                <StatusBadge status={booking.status} />
              </td>
              <td className="da-booking-actions-cell">
                <div className="da-booking-row-actions">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(booking);
                    }}
                    aria-label={`View booking details for ${booking.full_name || 'unnamed client'}`}
                    className="da-booking-detail-action"
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Details</span>
                  </button>
                  {booking.status === 'confirmed' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancel(booking);
                      }}
                      aria-label={`Cancel booking for ${booking.full_name || 'unnamed client'}`}
                      className="da-booking-cancel-action"
                    >
                      <Ban className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="da-booking-cancel-label">Cancel</span>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
