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
    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow className="border-slate-200 hover:bg-transparent">
            <TableHead className="h-11 pl-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Client</TableHead>
            <TableHead className="h-11 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Schedule</TableHead>
            <TableHead className="h-11 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Booking</TableHead>
            <TableHead className="h-11 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Guests</TableHead>
            <TableHead className="h-11 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Status</TableHead>
            <TableHead className="h-11 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id} className="border-slate-100 transition-colors hover:bg-[#B6F500]/[0.04]">
              <TableCell className="py-4 pl-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-[#B6F500]">
                    {(booking.full_name || 'BK').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{booking.full_name || 'Unnamed client'}</p>
                    <p className="truncate text-xs text-slate-500">{booking.mobile || booking.email || 'No contact details'}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <Calendar className="h-3.5 w-3.5 text-[#C29A5D]" aria-hidden="true" />
                    {formatDate(booking.booking_date)}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {formatTime(booking.start_time)}
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="max-w-[180px] space-y-1">
                  <Badge variant="outline" className="border-slate-200 bg-slate-50 text-[10px] font-medium text-slate-600">
                    {formatEventType(booking.event_type)}
                  </Badge>
                  <p className="text-xs font-medium text-slate-600">{formatAmount(booking.final_price)}</p>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                  <Users className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  {booking.guest_count || 0}
                </div>
              </TableCell>
              <TableCell className="py-4"><StatusBadge status={booking.status} /></TableCell>
              <TableCell className="py-4 pr-5 align-middle">
                <div className="flex min-w-[154px] justify-end gap-2 whitespace-nowrap">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onView(booking)}
                    aria-label={`View booking details for ${booking.full_name || 'unnamed client'}`}
                    className="h-8 gap-1.5 border-slate-200 px-2.5 text-xs text-slate-700 hover:bg-slate-900 hover:text-white"
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
                      className="h-8 gap-1.5 px-2 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
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
