// src/components/admin/analytics/useAnalyticsData.ts
import { useMemo } from 'react';
import { useBookings } from '../../../src/hooks/useBookings';
import { usePackages } from '../../../src/hooks/usePackages';
import { useAnalyticsSummary } from '../../../src/hooks/useAnalyticsSummary';
import type { Booking } from '../../../src/schemas/bookings';
import { 
  DateRangeFilter, 
  AnalyticsSummaryStats, 
  ChartDataPoint, 
  CategoryBreakdown, 
  DayOfWeekDistribution 
} from './types';

const CATEGORY_COLORS = ['#C29A5D', '#B6F500', '#10B981', '#6366F1', '#EC4899', '#F59E0B'];
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function useAnalyticsData(dateFilter: DateRangeFilter) {
  const { data: allBookings = [], isLoading: isBookingsLoading, refetch: refetchBookings } = useBookings();
  const { data: packages = [] } = usePackages();
  const { data: showcaseSummary, isLoading: isSummaryLoading, refetch: refetchShowcase } = useAnalyticsSummary();

  const packageMap = useMemo(() => {
    const map = new Map<string, { name: string; price: number }>();
    packages.forEach(pkg => {
      if (pkg.id) map.set(pkg.id, { name: pkg.name, price: Number(pkg.price) || 0 });
    });
    return map;
  }, [packages]);

  const getBookingRevenue = useMemo(() => (booking: Booking) => {
    const recordedTotal = Number(booking.final_price) || 0;
    if (recordedTotal > 0) return recordedTotal;

    const packagePrice = booking.package_id ? packageMap.get(booking.package_id)?.price || 0 : 0;
    const cleaningCost = booking.floor_cleaning === false
      ? 0
      : Number(booking.floor_cleaning_cost) || 3000;
    const extras = Number(booking.extra_services_total) || 0;
    const adjustment = Number(booking.admin_price_adjustment) || 0;

    return packagePrice + cleaningCost + extras + adjustment;
  }, [packageMap]);

  // Filter bookings based on selected date range
  const filteredBookings = useMemo(() => {
    if (!allBookings.length) return [];
    const now = new Date();
    const todayStr = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');

    return allBookings.filter((b) => {
      if (!b.booking_date) return dateFilter.preset === 'all';
      const bDateStr = b.booking_date.slice(0, 10);
      const bDate = new Date(`${bDateStr}T00:00:00`);

      switch (dateFilter.preset) {
        case 'today':
          return bDateStr === todayStr;
        case '7d': {
          const past = new Date();
          past.setDate(now.getDate() - 7);
          past.setHours(0, 0, 0, 0);
          return bDate >= past;
        }
        case '30d': {
          const past = new Date();
          past.setDate(now.getDate() - 30);
          past.setHours(0, 0, 0, 0);
          return bDate >= past;
        }
        case '90d': {
          const past = new Date();
          past.setDate(now.getDate() - 90);
          past.setHours(0, 0, 0, 0);
          return bDate >= past;
        }
        case 'year': {
          const past = new Date();
          past.setFullYear(now.getFullYear() - 1);
          past.setHours(0, 0, 0, 0);
          return bDate >= past;
        }
        case 'all':
        default:
          return true;
      }
    });
  }, [allBookings, dateFilter]);

  // Aggregate Key Performance Indicators
  const stats: AnalyticsSummaryStats = useMemo(() => {
    let grossRevenue = 0;
    let confirmedCount = 0;
    let pendingCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;
    let totalGuests = 0;

    filteredBookings.forEach((b) => {
      const price = getBookingRevenue(b);
      if (b.status !== 'cancelled') {
        grossRevenue += price;
      }
      if (b.guest_count) {
        totalGuests += Number(b.guest_count) || 0;
      }

      switch (b.status) {
        case 'confirmed':
          confirmedCount++;
          break;
        case 'pending':
          pendingCount++;
          break;
        case 'completed':
          completedCount++;
          break;
        case 'cancelled':
          cancelledCount++;
          break;
      }
    });

    const total = filteredBookings.length;
    const activeConfirmed = confirmedCount + completedCount;
    const conversionRate = total > 0 ? Math.round((activeConfirmed / total) * 100) : 0;
    const averageBookingValue = activeConfirmed > 0 ? Math.round(grossRevenue / activeConfirmed) : 0;
    const occupancyRate = Math.min(100, Math.round((activeConfirmed / Math.max(1, total)) * 85));

    return {
      grossRevenue,
      totalBookings: total,
      confirmedBookings: confirmedCount,
      pendingBookings: pendingCount,
      completedBookings: completedCount,
      cancelledBookings: cancelledCount,
      conversionRate,
      averageBookingValue,
      occupancyRate,
      activeGuests: totalGuests,
    };
  }, [filteredBookings, getBookingRevenue]);

  // Generate chart data series over timeline
  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!filteredBookings.length) return [];
    
    const dateMap = new Map<string, { revenue: number; count: number }>();
    
    // Sort chronological
    const sorted = [...filteredBookings].sort(
      (a, b) => new Date(a.booking_date || '').getTime() - new Date(b.booking_date || '').getTime()
    );

    sorted.forEach((b) => {
      const dateKey = b.booking_date || 'Unscheduled';
      const prev = dateMap.get(dateKey) || { revenue: 0, count: 0 };
      const rev = b.status !== 'cancelled' ? getBookingRevenue(b) : 0;
      dateMap.set(dateKey, {
        revenue: prev.revenue + rev,
        count: prev.count + 1,
      });
    });

    return Array.from(dateMap.entries()).map(([dateStr, data]) => {
      let label = dateStr;
      let timestamp: number | null = null;
      try {
        const d = new Date(dateStr);
        label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        timestamp = Number.isNaN(d.getTime()) ? null : d.getTime();
      } catch {
        label = dateStr;
      }
      return {
        date: dateStr,
        label,
        timestamp,
        revenue: data.revenue,
        bookingsCount: data.count,
      };
    });
  }, [filteredBookings, getBookingRevenue]);

  // Category & Package Distribution
  const categoryBreakdown: CategoryBreakdown[] = useMemo(() => {
    const map = new Map<string, { count: number; revenue: number }>();

    filteredBookings.forEach((b) => {
      const pkgName = (b.package_id && packageMap.get(b.package_id)?.name) || b.event_type || 'Custom Booking';
      const prev = map.get(pkgName) || { count: 0, revenue: 0 };
      const rev = b.status !== 'cancelled' ? getBookingRevenue(b) : 0;
      map.set(pkgName, {
        count: prev.count + 1,
        revenue: prev.revenue + rev,
      });
    });

    const entries = Array.from(map.entries());
    return entries.map(([name, val], idx) => ({
      name,
      count: val.count,
      revenue: val.revenue,
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
    }));
  }, [filteredBookings, packageMap, getBookingRevenue]);

  // Day of week distribution (Occupancy pattern)
  const dayOfWeekDistribution: DayOfWeekDistribution[] = useMemo(() => {
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    let max = 1;

    filteredBookings.forEach((b) => {
      if (!b.booking_date) return;
      const d = new Date(b.booking_date);
      const dayIdx = d.getDay();
      dayCounts[dayIdx]++;
      if (dayCounts[dayIdx] > max) max = dayCounts[dayIdx];
    });

    return DAYS_OF_WEEK.map((day, idx) => ({
      day,
      bookings: dayCounts[idx],
      occupancyPercent: Math.round((dayCounts[idx] / max) * 100),
    }));
  }, [filteredBookings]);

  const handleRefresh = () => {
    refetchBookings();
    refetchShowcase();
  };

  return {
    filteredBookings,
    stats,
    chartData,
    categoryBreakdown,
    dayOfWeekDistribution,
    showcaseSummary,
    isLoading: isBookingsLoading || isSummaryLoading,
    handleRefresh,
  };
}
