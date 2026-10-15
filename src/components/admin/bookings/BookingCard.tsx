// src/components/admin/bookings/BookingCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, Mail, Calendar, Clock, Users, Eye, Ban
} from 'lucide-react';
import { StatusBadge } from '../../admin-v2/StatusBadge';
import { Booking } from '../../../src/schemas/bookings';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

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
  // Compute client initials
  const initials = booking.full_name
    ? booking.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'BK';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md sm:rounded-xl"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* Left section: Client Avatar + Main Details */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Client Avatar with gradient fill */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-[#B6F500] shadow-sm transition-transform group-hover:scale-105">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h3 className="text-base font-bold text-slate-900 tracking-tight truncate group-hover:text-slate-800">
                {booking.full_name}
              </h3>
              <StatusBadge status={booking.status} />
              {booking.event_type && (
                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[11px] font-medium capitalize">
                  {booking.event_type.replace(/_/g, ' ')}
                </Badge>
              )}
            </div>

            {/* Contact info pill strip */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium mt-1.5">
              <div className="flex items-center gap-1.5 text-slate-700 bg-slate-100/70 px-2.5 py-1 rounded-lg">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{booking.mobile}</span>
              </div>

              {booking.email && (
                <div className="flex items-center gap-1.5 text-slate-700 bg-slate-100/70 px-2.5 py-1 rounded-lg truncate max-w-[220px]">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{booking.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle section: Schedule & Event specs */}
        <div className="flex flex-wrap items-center gap-6 text-xs border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-6">
          {/* Date */}
          <div className="min-w-[110px]">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5">
              Event Date
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatDate(booking.booking_date)}</span>
            </div>
          </div>

          {/* Time Slot */}
          <div className="min-w-[90px]">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5">
              Time
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatTime(booking.start_time)}</span>
            </div>
          </div>

          {/* Guests */}
          {booking.guest_count && (
            <div className="min-w-[70px]">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5">
                Guests
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>{booking.guest_count}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right section: Action Buttons */}
        <div className="flex w-full shrink-0 items-center justify-end gap-2 border-t border-slate-100 pt-3 lg:w-auto lg:border-t-0 lg:pt-0">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onView(booking);
            }}
            aria-label={`View booking details for ${booking.full_name || 'unnamed client'}`}
            className="h-9 px-3 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white font-medium text-xs gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Button>

          {booking.status === 'confirmed' && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onCancel(booking);
              }}
              className="h-9 px-3 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white font-medium text-xs gap-1.5 transition-all"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </Button>
          )}

        </div>

      </div>
    </motion.div>
  );
}
