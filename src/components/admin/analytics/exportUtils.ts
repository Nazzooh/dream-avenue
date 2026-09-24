// src/components/admin/analytics/exportUtils.ts
// CSV export utility for analytics data
import { ChartDataPoint, CategoryBreakdown, AnalyticsSummaryStats } from './types';

export function exportAnalyticsCSV(
  stats: AnalyticsSummaryStats,
  chartData: ChartDataPoint[],
  categoryBreakdown: CategoryBreakdown[]
): void {
  const rows: string[] = [];

  // Header section
  rows.push('Dream Avenue — Analytics Export');
  rows.push(`Generated: ${new Date().toLocaleString()}`);
  rows.push('');

  // KPIs
  rows.push('=== KEY PERFORMANCE INDICATORS ===');
  rows.push('Metric,Value');
  rows.push(`Gross Revenue,${stats.grossRevenue}`);
  rows.push(`Total Bookings,${stats.totalBookings}`);
  rows.push(`Confirmed Bookings,${stats.confirmedBookings}`);
  rows.push(`Pending Bookings,${stats.pendingBookings}`);
  rows.push(`Completed Bookings,${stats.completedBookings}`);
  rows.push(`Cancelled Bookings,${stats.cancelledBookings}`);
  rows.push(`Conversion Rate,${stats.conversionRate}%`);
  rows.push(`Average Booking Value,${stats.averageBookingValue}`);
  rows.push(`Occupancy Rate,${stats.occupancyRate}%`);
  rows.push(`Total Guests,${stats.activeGuests}`);
  rows.push('');

  // Timeline
  rows.push('=== REVENUE TIMELINE ===');
  rows.push('Date,Revenue,Bookings Count');
  chartData.forEach((d) => {
    rows.push(`${d.date},${d.revenue},${d.bookingsCount}`);
  });
  rows.push('');

  // Category breakdown
  rows.push('=== CATEGORY BREAKDOWN ===');
  rows.push('Category,Bookings,Revenue');
  categoryBreakdown.forEach((c) => {
    rows.push(`"${c.name}",${c.count},${c.revenue}`);
  });

  // Download
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `dream-avenue-analytics-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
