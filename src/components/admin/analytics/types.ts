// src/components/admin/analytics/types.ts
export type DateRangePreset = 'today' | '7d' | '30d' | '90d' | 'year' | 'all';

export interface DateRangeFilter {
  preset: DateRangePreset;
  startDate?: string;
  endDate?: string;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  changePercent?: number;
  changePeriod?: string;
  description?: string;
  iconName: string;
  gradient: string;
  progress?: number;
}

export interface ChartDataPoint {
  date: string;
  label: string;
  revenue: number;
  bookingsCount: number;
}

export interface CategoryBreakdown {
  name: string;
  count: number;
  revenue: number;
  color: string;
}

export interface DayOfWeekDistribution {
  day: string;
  bookings: number;
  occupancyPercent: number;
}

export interface AnalyticsSummaryStats {
  grossRevenue: number;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  conversionRate: number;
  averageBookingValue: number;
  occupancyRate: number;
  activeGuests: number;
}
