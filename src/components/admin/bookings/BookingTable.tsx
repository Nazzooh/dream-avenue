import React from 'react';
import { Calendar, Clock, Eye, Ban, Users } from 'lucide-react';
import { Booking } from '../../../src/schemas/bookings';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
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
      <Table className="da-booking-table-grid">
        <TableHeader className="bg-slate-50/80">
          <TableRow className="border-slate-200 hover:bg-transparent">
            <TableHead className="da-booking-client-col">Client</TableHead>
            <TableHead className="da-booking-schedule-col">Schedule</TableHead>
            <TableHead className="da-booking-type-col">Booking</TableHead>
            <TableHead className="da-booking-guests-col">Guests</TableHead>
            <TableHead className="da-booking-status-col">Status</TableHead>
            <TableHead className="da-booking-actions-col">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id} className="border-slate-100 transition-colors hover:bg-[#B6F500]/[0.04]">
              <TableCell className="da-booking-client-cell">
                <div className="da-booking-client">
                  <div className="da-booking-avatar">
                    {(booking.full_name || 'BK').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="da-booking-client-copy">
                    <p>{booking.full_name || 'Unnamed client'}</p>
                    <span>{booking.mobile || booking.email || 'No contact details'}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="da-booking-schedule-cell">
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
              </TableCell>
              <TableCell className="da-booking-type-cell">
                <div className="da-booking-type">
                  <span>{formatEventType(booking.event_type)}</span>
                  <p>{formatAmount(booking.final_price)}</p>
                </div>
              </TableCell>
              <TableCell className="da-booking-guests-cell">
                <div>
                  <Users aria-hidden="true" />
                  {booking.guest_count || 0}
                </div>
              </TableCell>
              <TableCell className="da-booking-status-cell"><StatusBadge status={booking.status} /></TableCell>
              <TableCell className="da-booking-actions-cell">
                <div className="da-booking-row-actions">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onView(booking)}
                    aria-label={`View booking details for ${booking.full_name || 'unnamed client'}`}
                    className="da-booking-detail-action"
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    Details
                  </Button>
                  {booking.status === 'confirmed' && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => onCancel(booking)}
                      aria-label={`Cancel booking for ${booking.full_name || 'unnamed client'}`}
                    className="da-booking-cancel-action"
                    >
                      <Ban className="h-3.5 w-3.5" aria-hidden="true" />
                      Cancel
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
