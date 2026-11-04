import { supabase } from '@/utils/supabase/client';

// Public booking creation payload
export type BookingPayload = {
  full_name: string;
  mobile: string;
  booking_date: string;      // YYYY-MM-DD
  start_time: string | null;
  end_time: string | null;
  guest_count?: number;
  package_id?: string | null;
  special_requests?: string | null;
  email?: string | null;
  additional_notes?: string | null;
  user_id?: string | null;   // public user or null
};

// Converts UI slot to scalar times
export function normalizeTimes(slot: string) {
  switch (slot) {
    case 'morning':
    case 'half_day_morning':
      return { start: '10:00', end: '14:00' };
    case 'evening':
    case 'half_day_evening':
      return { start: '14:00', end: '18:00' };
    case 'night':
      return { start: '18:00', end: '22:00' };
    case 'full_day':
      return { start: '10:00', end: '18:00' };
    case 'short_duration':
      return { start: '10:00', end: '18:00' };
    default:
      return { start: null, end: null };
  }
}

export async function createBooking(payload: BookingPayload) {
  const safePayload = {
    full_name: payload.full_name,
    mobile: payload.mobile,
    booking_date: payload.booking_date,
    start_time: payload.start_time,
    end_time: payload.end_time,
    guest_count: payload.guest_count ?? 0,
    package_id: payload.package_id ?? null,
    special_requests: payload.special_requests ?? null,
    email: payload.email ?? null,
    additional_notes: payload.additional_notes ?? null,
    status: 'pending'
  };

  console.log('[CREATE BOOKING] final payload:', safePayload);

  const { data, error } = await supabase.rpc('submit_booking_request', {
    p_full_name: safePayload.full_name,
    p_mobile: safePayload.mobile,
    p_booking_date: safePayload.booking_date,
    p_start_time: safePayload.start_time,
    p_end_time: safePayload.end_time,
    p_guest_count: safePayload.guest_count,
    p_package_id: safePayload.package_id,
    p_special_requests: safePayload.special_requests,
    p_email: safePayload.email,
    p_additional_notes: safePayload.additional_notes,
  });

  if (error) {
    console.error('[createBooking] ERROR:', error);
    throw error;
  }

  return { id: data };
}
