import { supabase } from "@/utils/supabase/client";
import { log } from "../lib/logger";

export interface CalendarDaySlots {
  full_day: boolean;
  morning: boolean;
  evening: boolean;
  night: boolean;
  short_duration: boolean;
}

export interface CalendarEvent {
  id?: string;
  day?: string;
  weekday?: number;
  bookings_count?: number;
  guests_count?: number;
  booking_ids?: string[];
  has_active?: boolean;
  event_date?: string;
  title?: string;
  start_date?: string;
  end_date?: string;
  type?: string;
}

export async function fetchCalendarMonth(year: number, month: number) {
  console.log(`[Calendar API] Fetching calendar for ${year}-${month}`);
  log.info("[Calendar API] Fetching month:", year, month);
  try {
    const payload = { p_month: month, p_year: year };
    const { data, error } = await supabase.rpc("get_calendar_month", payload);

    if (error) {
      console.error('[Calendar API] get_calendar_month RPC Error:', { code: error.code, message: error.message, details: error.details, payload });
      log.error("[Calendar API] get_calendar_month RPC Error:", error, { year, month });
      throw new Error(`Failed to load calendar: ${error.message}`);
    }

    console.log('[Calendar API] raw data', data);
    log.debug("[Calendar API] raw data:", data);
    return data;
  } catch (err: any) {
    log.error("[Calendar API] fetchCalendarMonth - EXCEPTION:", err);
    throw err;
  }
}

export async function fetchCalendarEvents(startDate: string, endDate: string) {
  log.info("[Calendar API] fetchCalendarEvents", { startDate, endDate });
  const payload = { p_start: startDate, p_end: endDate };
  const { data, error } = await supabase.rpc("get_calendar_events", payload);

  if (error) {
    console.error('[Calendar API] get_calendar_events RPC Error:', error);
    log.error("[Calendar API] fetchCalendarEvents failed", error);
    throw error;
  }
  return data;
}
