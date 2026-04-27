import { supabase } from "../../utils/supabase/client";
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

  let query = supabase.from("bookings").select("*", { count: "exact" });

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
  
  // To avoid pulling all rows, we should use count queries or a single RPC if we wanted optimization
  // But doing a small aggregate query in JS or single RPC is best. Wait, if we pull all just for stats:
  // Since we want to fix pagination by NOT pulling all, we could do 5 simple count queries (fast enough for admin panel)
  // or RPC. For now, let's do parallel counts.

  const types = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];
  const promises = types.map(async (status) => {
    let q = supabase.from("bookings").select("id", { count: "exact", head: true });
    if (status !== 'all') {
      q = q.eq("status", status);
    }
    const { count } = await q;
    return { status, count: count || 0 };
  });

  const results = await Promise.all(promises);
  const stats = {
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  };

  results.forEach(r => {
    if (r.status === 'all') stats.total = r.count;
    else stats[r.status as keyof typeof stats] = r.count;
  });

  return stats;
}
