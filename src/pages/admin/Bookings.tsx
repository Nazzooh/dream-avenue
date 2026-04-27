import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  CalendarDays, Clock, CheckCircle, Package, RefreshCw, ChevronLeft, ChevronRight
} from 'lucide-react';
import AdminLayout from '../../components/admin-v2/AdminLayout';
import { 
  useAdminPaginatedBookings, 
  useAdminBookingStats, 
  useCancelBooking, 
  useUpdateBookingStatus, 
  useDeleteBooking 
} from '../../src/hooks/useBookings';
import { Booking, BookingStatus } from '../../src/schemas/bookings';
import { toast } from 'sonner';

import { MetricCard } from '../../components/admin/bookings/MetricCard';
import { BookingCard } from '../../components/admin/bookings/BookingCard';
import { BookingsHeader } from '../../components/admin/bookings/BookingsHeader';
import { BookingsFilters } from '../../components/admin/bookings/BookingsFilters';
import { BookingDetailsModal } from '../../components/admin/bookings/BookingDetailsModal';
import { ConfirmationModal } from '../../components/admin-v2/ConfirmationModal';

export function AdminBookings() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 20;

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  const { 
    data: paginatedData, 
    isLoading: isBookingsLoading, 
    refetch: refetchBookings 
  } = useAdminPaginatedBookings({
    page,
    limit,
    status: statusFilter,
    searchQuery
  });

  const { 
    data: stats = { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 }, 
    isLoading: isStatsLoading,
    refetch: refetchStats
  } = useAdminBookingStats();

  const cancelBookingMutation = useCancelBooking();
  const deleteBookingMutation = useDeleteBooking();
  const updateStatusMutation = useUpdateBookingStatus();

  const handleRefresh = () => {
    refetchBookings();
    refetchStats();
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    try {
      await cancelBookingMutation.mutateAsync(bookingToCancel.id!);
      setIsCancelModalOpen(false);
      setBookingToCancel(null);
      handleRefresh();
      toast.success("Booking cancelled successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!bookingToDelete) return;
    try {
      await deleteBookingMutation.mutateAsync(bookingToDelete.id!);
      setIsDeleteModalOpen(false);
      setBookingToDelete(null);
      setIsViewModalOpen(false);
      handleRefresh();
      toast.success("Booking deleted permanently");
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: BookingStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: bookingId, status });
      setIsViewModalOpen(false);
      setSelectedBooking(null);
      handleRefresh();
      toast.success(`Booking marked as ${status}`);
    } catch (error) {
      console.error(error);
    }
  };

  // Helper formatters
  const formatDate = (dateStr: any) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
  const formatTime = (timeStr: any) => {
    if (!timeStr?.includes(':')) return 'N/A';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  };
  const formatEventType = (et: any) => et?.replace(/_/g, ' ').split(' ').map((w:any) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ') || 'Not specified';
  const timeSlotMap: Record<string, string> = { morning: 'Morning', evening: 'Evening', night: 'Night', full_day: 'Full Day', short_duration: 'Short Duration' };
  const formatTimeSlot = (ts: any) => (typeof ts === 'string' ? timeSlotMap[ts] : null) || ts || 'Not selected';

  const totalPages = Math.ceil((paginatedData?.count || 0) / limit);

  return (
    <AdminLayout>
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FAF9F6 0%, #F5F3EE 100%)' }}>
        <BookingsHeader 
          isLoading={isBookingsLoading || isStatsLoading} 
          onRefresh={handleRefresh} 
          pendingCount={stats.pending} 
        />

        <div className="w-full max-w-[1600px] mx-auto px-[4%] py-[clamp(1.5rem,4vw,2.5rem)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(1rem,2vw,1.5rem)] mb-[clamp(2rem,4vw,3rem)]">
            <MetricCard title="Total Volume" value={stats.total} icon={<CalendarDays className="w-full h-full" />} color="#B6F500" delay={0.1} />
            <MetricCard title="Pending" value={stats.pending} icon={<Clock className="w-full h-full" />} color="#FF9800" delay={0.2} change={stats.pending > 0 ? "Needs action" : "Cleared"} />
            <MetricCard title="Confirmed" value={stats.confirmed} icon={<CheckCircle className="w-full h-full" />} color="#4CAF50" delay={0.3} />
            <MetricCard title="Completed" value={stats.completed} icon={<Package className="w-full h-full" />} color="#E0C097" delay={0.4} />
          </div>


          <BookingsFilters 
            searchQuery={searchQuery} 
            onSearchChange={(v) => { setSearchQuery(v); setPage(1); }} 
            statusFilter={statusFilter} 
            onStatusFilterChange={(s) => { setStatusFilter(s); setPage(1); }} 
          />

          {isBookingsLoading ? (
            <div className="flex items-center justify-center py-20"><RefreshCw className="w-10 h-10 animate-spin text-[#B6F500]" /></div>
          ) : !paginatedData?.data?.length ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <CalendarDays className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium">No bookings found</h3>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4">
                {paginatedData.data.map((booking: Booking, index: number) => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    onView={(b) => { setSelectedBooking(b); setIsViewModalOpen(true); }} 
                    onCancel={(b) => { setBookingToCancel(b); setIsCancelModalOpen(true); }} 
                    formatDate={formatDate} formatTime={formatTime} delay={index * 0.03} 
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-2 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-white transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-medium">Page {page} of {totalPages}</span>
                  <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="p-2 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-white transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isViewModalOpen && selectedBooking && (
          <BookingDetailsModal
            booking={selectedBooking} onClose={() => { setIsViewModalOpen(false); setSelectedBooking(null); }}
            onStatusUpdate={handleStatusUpdate} onCancel={(b) => { setBookingToCancel(b); setIsCancelModalOpen(true); }}
            onDelete={(b) => { setBookingToDelete(b); setIsDeleteModalOpen(true); }}
            formatDate={formatDate} formatTime={formatTime} formatEventType={formatEventType} formatTimeSlot={formatTimeSlot}
            updateStatusMutation={updateStatusMutation} refetchBookings={handleRefresh}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCancelModalOpen && bookingToCancel && (
          <ConfirmationModal
            title="Cancel Booking" message={`Cancel the booking for ${bookingToCancel.full_name}?`}
            confirmText="Yes, Cancel" cancelText="No, Keep" onConfirm={handleConfirmCancel} 
            onCancel={() => { setIsCancelModalOpen(false); setBookingToCancel(null); }} isDangerous
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && bookingToDelete && (
          <ConfirmationModal
            title="Delete Permanently" message={`Delete booking for ${bookingToDelete.full_name}? This cannot be undone.`}
            confirmText="Yes, Delete" cancelText="Cancel" onConfirm={handleConfirmDelete}
            onCancel={() => { setIsDeleteModalOpen(false); setBookingToDelete(null); }} isDangerous
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

export default AdminBookings;
