// src/components/admin/bookings/exportBookingsUtils.ts
import { Booking } from '../../../src/schemas/bookings';

export function exportBookingsToCSV(bookings: Booking[], filename = 'bookings-report.csv') {
  if (!bookings || !bookings.length) return;

  const headers = [
    'Booking ID',
    'Client Name',
    'Mobile',
    'Email',
    'Event Type',
    'Booking Date',
    'Start Time',
    'Guest Count',
    'Status',
    'Special Request',
    'Created At'
  ];

  const rows = bookings.map(b => [
    b.id || '',
    `"${(b.full_name || '').replace(/"/g, '""')}"`,
    `"${b.mobile || ''}"`,
    `"${b.email || ''}"`,
    `"${(b.event_type || '').replace(/_/g, ' ')}"`,
    b.booking_date || '',
    b.start_time || '',
    b.guest_count ?? '',
    b.status || '',
    `"${(b.special_request || '').replace(/"/g, '""')}"`,
    b.created_at || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
