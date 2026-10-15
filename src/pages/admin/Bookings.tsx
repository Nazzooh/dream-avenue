// src/pages/admin/Bookings.tsx
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  CalendarDays, Clock, CheckCircle, Package, RefreshCw, ChevronLeft, ChevronRight, Inbox
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
import { BookingTable } from '../../components/admin/bookings/BookingTable';
import { BookingsHeader } from '../../components/admin/bookings/BookingsHeader';
import { BookingsFilters } from '../../components/admin/bookings/BookingsFilters';
import { BookingDetailsModal } from '../../components/admin/bookings/BookingDetailsModal';
import { ConfirmationModal } from '../../components/admin-v2/ConfirmationModal';
import { exportBookingsToCSV } from '../../components/admin/bookings/exportBookingsUtils';
import { Button } from '../../components/ui/button';

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
    toast.info("Refreshed booking status", { duration: 1500 });
  };

  const handleExportCSV = () => {
    if (!paginatedData?.data?.length) {
      toast.error("No bookings data available to export");
      return;
    }
    exportBookingsToCSV(paginatedData.data, `bookings-${statusFilter}-${new Date().toISOString().slice(0,10)}.csv`);
    toast.success("CSV report exported successfully");
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
      toast.error("Failed to cancel booking");
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
      toast.error("Failed to delete booking");
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
      toast.error("Failed to update status");
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
      <div className="min-h-screen bg-slate-50/60 pb-16">
        <BookingsHeader 
          isLoading={isBookingsLoading || isStatsLoading} 
          onRefresh={handleRefresh} 
          pendingCount={stats.pending} 
          totalCount={stats.total}
          onExportCSV={handleExportCSV}
        />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard 
              title="Total Volume" 
              value={stats.total} 
              icon={<CalendarDays className="w-5 h-5" />} 
              color="#0F172A" 
              delay={0.05}
              subtitle="All time venue requests"
            />
            <MetricCard 
              title="Pending Review" 
              value={stats.pending} 
              icon={<Clock className="w-5 h-5" />} 
              color="#F59E0B" 
              delay={0.1}
              change={stats.pending > 0 ? "Requires action" : "All clear"}
              trend={stats.pending > 0 ? 'up' : 'down'}
              subtitle="Awaiting admin response"
            />
            <MetricCard 
              title="Confirmed" 
              value={stats.confirmed} 
              icon={<CheckCircle className="w-5 h-5" />} 
              color="#10B981" 
              delay={0.15}
              subtitle="Scheduled & active"
            />
            <MetricCard 
              title="Completed" 
              value={stats.completed} 
              icon={<Package className="w-5 h-5" />} 
              color="#6366F1" 
              delay={0.2}
              subtitle="Successfully hosted"
            />
          </div>

          {/* Filter Bar */}
          <BookingsFilters 
            searchQuery={searchQuery} 
            onSearchChange={(v) => { setSearchQuery(v); setPage(1); }} 
            statusFilter={statusFilter} 
            onStatusFilterChange={(s) => { setStatusFilter(s); setPage(1); }} 
            counts={stats}
          />

          {/* Bookings List Area */}
          {isBookingsLoading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200/80">
              <RefreshCw className="w-8 h-8 animate-spin text-slate-800 mb-3" />
              <p className="text-xs font-semibold text-slate-500">Loading bookings data...</p>
            </div>
          ) : !paginatedData?.data?.length ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-200 text-center px-4"
            >
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No bookings match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mb-4">
                {searchQuery || statusFilter !== 'all' 
                  ? "Try clearing filters or changing your search query." 
                  : "New booking requests submitted by users will appear right here."}
              </p>
              {(searchQuery || statusFilter !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="rounded-xl text-xs"
                >
                  Reset Filters
                </Button>
              )}
            </motion.div>
          ) : (
            <>
              <BookingTable
                bookings={paginatedData.data}
                onView={(booking) => { setSelectedBooking(booking); setIsViewModalOpen(true); }}
                onCancel={(booking) => { setBookingToCancel(booking); setIsCancelModalOpen(true); }}
                formatDate={formatDate}
                formatTime={formatTime}
              />

              {/* Mobile presentation */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {paginatedData.data.map((booking: Booking, index: number) => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    onView={(b) => { setSelectedBooking(b); setIsViewModalOpen(true); }} 
                    onCancel={(b) => { setBookingToCancel(b); setIsCancelModalOpen(true); }} 
                    formatDate={formatDate} 
                    formatTime={formatTime} 
                    delay={index * 0.02} 
                  />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-5 px-2">
                  <span className="text-xs text-slate-500 font-medium">
                    Showing <span className="font-bold text-slate-800">{((page - 1) * limit) + 1}</span> to <span className="font-bold text-slate-800">{Math.min(page * limit, paginatedData.count)}</span> of <span className="font-bold text-slate-800">{paginatedData.count}</span> results
                  </span>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="h-8 px-3 rounded-xl border-slate-200 text-xs font-semibold"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                      Previous
                    </Button>
                    <span className="text-xs font-bold px-3 py-1 bg-slate-900 text-white rounded-lg">
                      {page} / {totalPages}
                    </span>
                    <Button 
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="h-8 px-3 rounded-xl border-slate-200 text-xs font-semibold"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isViewModalOpen && selectedBooking && (
          <BookingDetailsModal
            booking={selectedBooking} 
            onClose={() => { setIsViewModalOpen(false); setSelectedBooking(null); }}
            onStatusUpdate={handleStatusUpdate} 
            onCancel={(b) => { setBookingToCancel(b); setIsCancelModalOpen(true); }}
            onDelete={(b) => { setBookingToDelete(b); setIsDeleteModalOpen(true); }}
            formatDate={formatDate} 
            formatTime={formatTime} 
            formatEventType={formatEventType} 
            formatTimeSlot={formatTimeSlot}
            updateStatusMutation={updateStatusMutation} 
            refetchBookings={handleRefresh}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCancelModalOpen && bookingToCancel && (
          <ConfirmationModal
            title="Cancel Booking" 
            message={`Are you sure you want to cancel the booking for ${bookingToCancel.full_name}?`}
            confirmText="Yes, Cancel" 
            cancelText="No, Keep" 
            onConfirm={handleConfirmCancel} 
            onCancel={() => { setIsCancelModalOpen(false); setBookingToCancel(null); }} 
            isDangerous
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && bookingToDelete && (
          <ConfirmationModal
            title="Delete Permanently" 
            message={`Delete booking for ${bookingToDelete.full_name}? This action cannot be undone.`}
            confirmText="Yes, Delete" 
            cancelText="Cancel" 
            onConfirm={handleConfirmDelete}
            onCancel={() => { setIsDeleteModalOpen(false); setBookingToDelete(null); }} 
            isDangerous
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

export default AdminBookings;
