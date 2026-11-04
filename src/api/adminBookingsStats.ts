import { supabase } from "@/utils/supabase/client";
import { log } from "../lib/logger";
import { BookingStatus } from "../schemas/bookings";

export async function adminGetPaginatedBookings({
  page = 1,
  limit = 20,
  status,
  searchQuery
}: {
  page?: number;
  limit?: number;
  status?: BookingStatus | 'all';
  searchQuery?: string;
}) {
  log.info("adminGetPaginatedBookings", { page, limit, status, searchQuery });

  let query = supabase.from("bookings").select("id, full_name, mobile, email, booking_date, package_id, status, final_price, quoted_total, guest_count, event_type, time_slot, start_time, end_time, created_at, appointment_at", { count: "exact" });

  if (status && status !== 'all') {
    query = query.eq("status", status);
  }

  if (searchQuery) {
    // Supabase generic search: full_name, mobile, email
    query = query.or(`full_name.ilike.%${searchQuery}%,mobile.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to).order("booking_date", { ascending: false });

  const { data, count, error } = await query;

  if (error) {
    log.error("adminGetPaginatedBookings failed", error);
    throw error;
  }

  return { data, count };
}

export async function adminGetBookingStats() {
  log.info("adminGetBookingStats");
  const { data, error } = await supabase.rpc("admin_booking_stats");
  if (error) {
    log.error("admin_booking_stats failed", error);
    throw error;
  }
  return data?.[0] || { total: 0, pending: 0, appointment_scheduled: 0, quotation_in_progress: 0, confirmed: 0, completed: 0, declined: 0, cancelled: 0 };
}
