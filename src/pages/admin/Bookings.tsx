import { useState, type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, CircleX, Clock3,
  Download, Inbox, RefreshCw, Search, UsersRound, X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useAdminPaginatedBookings,
  useAdminBookingStats,
  useCancelBooking,
  useDeleteBooking,
  useUpdateBookingStatus,
} from '../../src/hooks/useBookings';
import { Booking, BookingStatus } from '../../src/schemas/bookings';
import { BookingCard } from '../../components/admin/bookings/BookingCard';
import { BookingDetailsModal } from '../../components/admin/bookings/BookingDetailsModal';
import { BookingTable } from '../../components/admin/bookings/BookingTable';
import { Button } from '../../components/ui/button';
import { ConfirmationModal } from '../../components/admin-v2/ConfirmationModal';
import { exportBookingsToCSV } from '../../components/admin/bookings/exportBookingsUtils';
import { AdminActionButton } from '../../components/admin-v2/AdminActionButton';

const statusFilters: Array<{ value: BookingStatus | 'all'; label: string; count: keyof BookingStats }> = [
  { value: 'all', label: 'All', count: 'total' },
  { value: 'pending', label: 'Needs review', count: 'pending' },
  { value: 'confirmed', label: 'Confirmed', count: 'confirmed' },
  { value: 'completed', label: 'Completed', count: 'completed' },
  { value: 'cancelled', label: 'Cancelled', count: 'cancelled' },
];

type BookingStats = { total: number; pending: number; confirmed: number; completed: number; cancelled: number };

function BookingMetric({ label, value, note, tone, icon }: {
  label: string; value: number; note: string; tone: 'default' | 'attention' | 'success' | 'muted'; icon: ReactNode;
}) {
  return (
    <article className={`da-booking-metric da-booking-metric-${tone}`}>
      <div className="da-booking-metric-icon" aria-hidden="true">{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{note}</span>
      </div>
    </article>
  );
}

export function AdminBookings() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const limit = 20;

  const { data: paginatedData, isLoading: isBookingsLoading, refetch: refetchBookings } = useAdminPaginatedBookings({
    page, limit, status: statusFilter, searchQuery,
  });
  const { data: stats = { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 }, isLoading: isStatsLoading, refetch: refetchStats } = useAdminBookingStats();
  const cancelBookingMutation = useCancelBooking();
  const deleteBookingMutation = useDeleteBooking();
  const updateStatusMutation = useUpdateBookingStatus();
  const isLoading = isBookingsLoading || isStatsLoading;
  const totalPages = Math.ceil((paginatedData?.count || 0) / limit);

  const refresh = () => {
    refetchBookings();
    refetchStats();
    toast.info('Bookings refreshed', { duration: 1500 });
  };

  const openBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const updateStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: bookingId, status });
      setIsViewModalOpen(false);
      setSelectedBooking(null);
      refresh();
      toast.success(`Booking marked as ${status}`);
    } catch {
      toast.error('Unable to update this booking');
    }
  };

  const cancelBooking = async () => {
    if (!bookingToCancel?.id) return;
    try {
      await cancelBookingMutation.mutateAsync(bookingToCancel.id);
      setBookingToCancel(null);
      refresh();
      toast.success('Booking cancelled');
    } catch {
      toast.error('Unable to cancel this booking');
    }
  };

  const deleteBooking = async () => {
    if (!bookingToDelete?.id) return;
    try {
      await deleteBookingMutation.mutateAsync(bookingToDelete.id);
      setBookingToDelete(null);
      setIsViewModalOpen(false);
      refresh();
      toast.success('Booking deleted permanently');
    } catch {
      toast.error('Unable to delete this booking');
    }
  };

  const exportCsv = () => {
    if (!paginatedData?.data?.length) return toast.error('No bookings in this view to export');
    exportBookingsToCSV(paginatedData.data, `dream-avenue-bookings-${new Date().toISOString().slice(0, 10)}.csv`);
    toast.success('CSV report exported');
  };

  const formatDate = (date: string | null | undefined) => date
    ? new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    : 'Date pending';
  const formatTime = (time: string | null | undefined) => {
    if (!time?.includes(':')) return 'Time pending';
    const [hour, minute] = time.split(':');
    const numericHour = Number(hour);
    return `${numericHour % 12 || 12}:${minute} ${numericHour >= 12 ? 'PM' : 'AM'}`;
  };
  const formatEventType = (value: string | null | undefined) => value?.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) || 'Not specified';
  const formatTimeSlot = (value: string | null | undefined) => ({ morning: 'Morning', evening: 'Evening', night: 'Night', full_day: 'Full day', short_duration: 'Short duration' }[value || ''] || value || 'Not selected');
  const clearFilters = () => { setSearchQuery(''); setStatusFilter('all'); setPage(1); };
  const hasFilters = Boolean(searchQuery.trim()) || statusFilter !== 'all';

  return (
    <section className="da-bookings-workspace">
      <header className="da-operations-header">
        <div>
          <p className="da-page-eyebrow">Venue operations</p>
          <div className="da-title-row">
            <h1>Bookings</h1>
            <span className={stats.pending ? 'da-live-badge attention' : 'da-live-badge'}>
              {stats.pending ? `${stats.pending} awaiting review` : 'All caught up'}
            </span>
          </div>
          <p className="da-header-copy">Prioritise client requests and keep each event moving from enquiry to completion.</p>
        </div>
        <div className="da-operations-actions">
          <AdminActionButton type="button" data-admin-shortcut="refresh" icon={<RefreshCw size={17} />} onClick={refresh} loading={isLoading}>Refresh</AdminActionButton>
          <AdminActionButton type="button" data-admin-shortcut="export" variant="primary" icon={<Download size={17} />} onClick={exportCsv}>Export CSV</AdminActionButton>
        </div>
      </header>

      <div className="da-booking-metrics" aria-label="Booking summary">
        <BookingMetric label="All bookings" value={stats.total} note="All venue requests" tone="default" icon={<CalendarDays size={20} />} />
        <BookingMetric label="Needs review" value={stats.pending} note={stats.pending ? 'Action required' : 'Nothing waiting'} tone="attention" icon={<Clock3 size={20} />} />
        <BookingMetric label="Confirmed" value={stats.confirmed} note="Scheduled events" tone="success" icon={<CheckCircle2 size={20} />} />
        <BookingMetric label="Completed" value={stats.completed} note="Successfully hosted" tone="default" icon={<UsersRound size={20} />} />
        <BookingMetric label="Cancelled" value={stats.cancelled} note="Closed requests" tone="muted" icon={<CircleX size={20} />} />
      </div>

      <section className="da-booking-list-panel" aria-label="Bookings list">
        <div className="da-booking-toolbar">
          <label className="da-booking-search">
            <Search size={18} aria-hidden="true" />
            <input data-admin-search value={searchQuery} onChange={(event) => { setSearchQuery(event.target.value); setPage(1); }} placeholder="Search client, phone, or email" />
            {searchQuery && <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear booking search"><X size={16} /></button>}
          </label>
          <div className="da-booking-filters" role="group" aria-label="Filter bookings by status">
            {statusFilters.map((filter) => (
              <button key={filter.value} type="button" aria-pressed={statusFilter === filter.value}
                className={statusFilter === filter.value ? 'is-active' : ''}
                onClick={() => { setStatusFilter(filter.value); setPage(1); }}>
                {filter.label}<span>{stats[filter.count]}</span>
              </button>
            ))}
          </div>
        </div>

        {isBookingsLoading ? (
          <div className="da-booking-empty"><RefreshCw size={28} className="animate-spin" /><p>Loading booking operations…</p></div>
        ) : !paginatedData?.data.length ? (
          <div className="da-booking-empty">
            <Inbox size={34} /><h2>No bookings in this view</h2>
            <p>{hasFilters ? 'Try clearing the current search or status filter.' : 'New client enquiries will appear here.'}</p>
            {hasFilters && <Button type="button" variant="outline" onClick={clearFilters}>Clear filters</Button>}
          </div>
        ) : (
          <>
            <BookingTable bookings={paginatedData.data} onView={openBooking} onCancel={setBookingToCancel} formatDate={formatDate} formatTime={formatTime} />
            <div className="da-booking-mobile-list">
              {paginatedData.data.map((booking, index) => <BookingCard key={booking.id} booking={booking} onView={openBooking} onCancel={setBookingToCancel} formatDate={formatDate} formatTime={formatTime} delay={index * 0.02} />)}
            </div>
          </>
        )}

        {totalPages > 1 && (
          <nav className="da-booking-pagination" aria-label="Bookings pages">
            <p>Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, paginatedData?.count || 0)} of {paginatedData?.count || 0}</p>
            <div>
              <Button type="button" variant="outline" disabled={page === 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft size={16} /> Previous</Button>
              <span>Page {page} of {totalPages}</span>
              <Button type="button" variant="outline" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)}>Next <ChevronRight size={16} /></Button>
            </div>
          </nav>
        )}
      </section>

      <AnimatePresence>
        {isViewModalOpen && selectedBooking && <BookingDetailsModal booking={selectedBooking} onClose={() => { setIsViewModalOpen(false); setSelectedBooking(null); }} onStatusUpdate={updateStatus} onCancel={setBookingToCancel} onDelete={setBookingToDelete} formatDate={formatDate} formatTime={formatTime} formatEventType={formatEventType} formatTimeSlot={formatTimeSlot} updateStatusMutation={updateStatusMutation} refetchBookings={refresh} />}
        {bookingToCancel && <ConfirmationModal title="Cancel booking" message={`Cancel the booking for ${bookingToCancel.full_name}?`} confirmText="Cancel booking" cancelText="Keep booking" onConfirm={cancelBooking} onCancel={() => setBookingToCancel(null)} isDangerous />}
        {bookingToDelete && <ConfirmationModal title="Delete permanently" message={`Delete the booking for ${bookingToDelete.full_name}? This cannot be undone.`} confirmText="Delete booking" cancelText="Keep booking" onConfirm={deleteBooking} onCancel={() => setBookingToDelete(null)} isDangerous />}
      </AnimatePresence>
    </section>
  );
}

export default AdminBookings;
