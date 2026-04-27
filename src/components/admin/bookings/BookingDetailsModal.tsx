import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Phone, Mail, User, Users, Clock, 
  MessageSquare, X, Check, AlertCircle, XCircle,
  CheckCircle, Ban, Trash2,
  Activity, Edit3, 
  Package, DollarSign, ShoppingCart, FileText
} from 'lucide-react';
import { StatusBadge } from '../../admin-v2/StatusBadge';
import { Booking, BookingStatus } from '../../../src/schemas/bookings';
import { BookingAction } from '../../../src/types/booking';
import { Package as PackageType } from '../../../src/schemas/packages';
import { usePackages } from '../../../src/hooks/usePackages';
import { toast } from 'sonner';
import { supabase } from '../../../utils/supabase/client';
import { formatAdminHistory } from '../../../src/utils/formatAdminHistory';
import { adminUpdateBookingDetails } from '../../../src/api/bookings';
import { getBookingActions, confirmBooking, adminUpdateBookingExtras } from '../../../src/api/adminBookings';

function BookingDetailsModal({ booking, onClose, onStatusUpdate, onCancel, onDelete, formatDate, formatTime, formatEventType, formatTimeSlot, updateStatusMutation, refetchBookings }: {
  booking: Booking;
  onClose: () => void;
  onStatusUpdate: (id: string, status: BookingStatus) => void;
  onCancel: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
  formatDate: (date: string | null | undefined) => string;
  formatTime: (time: string | null | undefined) => string;
  formatEventType: (eventType: string | null) => string;
  formatTimeSlot: (timeSlot: string | null) => string;
  updateStatusMutation: any;
  refetchBookings: () => void;
}) {
  console.log('📋 BookingDetailsModal - booking data:', {
    id: booking.id,
    event_type: booking.event_type,
    time_slot: booking.time_slot,
    package_id: booking.package_id,
    special_requests: booking.special_requests
  });
  
  const [adminNotes, setAdminNotes] = useState(booking.admin_notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [packageInfo, setPackageInfo] = useState<PackageType | null>(null);
  const [isLoadingPackage, setIsLoadingPackage] = useState(false);
  
  // Admin edit booking state
  const [editEventType, setEditEventType] = useState(booking.event_type || 'normal');
  const [editPackageId, setEditPackageId] = useState(booking.package_id || '');
  const [editTimeSlot, setEditTimeSlot] = useState(booking.time_slot || 'full_day');
  const [editStartTime, setEditStartTime] = useState(booking.start_time || '');
  const [editEndTime, setEditEndTime] = useState(booking.end_time || '');
  const [adminPriceAdjustment, setAdminPriceAdjustment] = useState(booking.admin_price_adjustment || 0);
  const [isSavingBookingEdits, setIsSavingBookingEdits] = useState(false);
  const [packageChanged, setPackageChanged] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  // Extra services state
  const [garbageBags, setGarbageBags] = useState(booking.garbage_bags || 0);
  const [platesSmall, setPlatesSmall] = useState(booking.plates_small || 0);
  const [platesLarge, setPlatesLarge] = useState(booking.plates_large || 0);
  const [cookingGasQty, setCookingGasQty] = useState(booking.cooking_gas_qty || 0);
  const [isSavingExtras, setIsSavingExtras] = useState(false);
  const [renderKey, setRenderKey] = useState(0); // Force re-render when costs update

  // Booking actions (audit trail)
  const [bookingActions, setBookingActions] = useState<BookingAction[]>([]);
  const [isLoadingActions, setIsLoadingActions] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  
  // Fetch all packages
  const { data: allPackages = [] } = usePackages();

  // Fetch package info
  useEffect(() => {
      const fetchPackage = async () => {
        setIsLoadingPackage(true);
        try {
          const { data, error } = await supabase
            .from('packages')
            .select('*')
            .eq('id', booking.package_id)
            .single();
          
          if (data) setPackageInfo(data);
          if (error) console.error('Failed to load package:', error);
        } finally {
          setIsLoadingPackage(false);
        }
      };
      
      fetchPackage();
  }, [booking.package_id]);

  // Fetch booking actions (audit trail)
  useEffect(() => {
    const fetchActions = async () => {
      if (!booking.id) return;
      
      setIsLoadingActions(true);
      try {
        const actions = await getBookingActions(booking.id!);
        setBookingActions(actions);
      } catch (error) {
        console.error('Failed to load booking actions:', error);
      } finally {
        setIsLoadingActions(false);
      }
    };

    fetchActions();
  }, [booking.id]);

  // Auto-clear times when time slot changes to non-short_duration
  useEffect(() => {
    if (editTimeSlot !== 'short_duration') {
      setEditStartTime('');
      setEditEndTime('');
    } else if (editTimeSlot === 'short_duration' && !editStartTime && !editEndTime) {
      // Set default times for short_duration if empty
      setEditStartTime('10:00');
      setEditEndTime('18:00');
    }
  }, [editTimeSlot]);

  const handleConfirmBooking = async () => {
    try {
      // Get current admin session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        toast.error('Admin session not found. Please log in again.');
        return;
      }

      const adminId = session.user.id;
      
      console.log('🔄 Confirming booking:', { bookingId: booking.id, adminId });
      
      // Call the confirmBooking function
      await confirmBooking({ bookingId: booking.id!, adminId });
      
      toast.success(
        <div>
          <strong>Booking Confirmed!</strong>
          <p style={{ fontSize: '0.875rem', marginTop: '4px', opacity: 0.9 }}>
            ✓ Date automatically blocked in calendar
          </p>
        </div>,
        { duration: 4000 }
      );
      
      // Refresh bookings list
      refetchBookings();
      
      // Close modal
      onClose();
    } catch (error: any) {
      console.error('❌ Confirm booking failed:', error);
      toast.error(error.message || 'Failed to confirm booking. Please try again.');
    }
  };

  const handleSaveNotes = async () => {
    if (!booking.id) return;
    
    setIsSavingNotes(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ admin_notes: adminNotes })
        .eq('id', booking.id);

      if (error) {
        console.error('Failed to save admin notes:', error);
        toast.error('Error saving notes');
      } else {
        toast.success('Admin notes updated successfully');
        // Update the booking object to reflect the change
        booking.admin_notes = adminNotes;
      }
    } catch (err) {
      console.error('Error saving admin notes:', err);
      toast.error('Error saving notes');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleSaveExtras = async () => {
    if (!booking.id) return;
    
    setIsSavingExtras(true);
    try {
      // Use the new admin_update_extras RPC
      
      const updatedBooking = await adminUpdateBookingExtras(booking.id, {
        garbage_bags: garbageBags,
        plates_small: platesSmall,
        plates_large: platesLarge,
        cooking_gas_qty: cookingGasQty
      });

      toast.success('Extra services updated successfully');
      
      // Log to verify the returned data
      console.log('Updated booking data from server:', {
        garbage_bags: updatedBooking.garbage_bags,
        garbage_cost: updatedBooking.garbage_cost,
        plates_small: updatedBooking.plates_small,
        plates_large: updatedBooking.plates_large,
        plates_cost: updatedBooking.plates_cost,
        cooking_gas_qty: updatedBooking.cooking_gas_qty,
        cooking_gas_cost: updatedBooking.cooking_gas_cost,
        extra_services_total: updatedBooking.extra_services_total,
        final_price: updatedBooking.final_price
      });
      
      // Log to verify the returned data
      console.log('Updated booking data from server:', {
        garbage_bags: updatedBooking.garbage_bags,
        garbage_cost: updatedBooking.garbage_cost,
        plates_small: updatedBooking.plates_small,
        plates_large: updatedBooking.plates_large,
        plates_cost: updatedBooking.plates_cost,
        cooking_gas_qty: updatedBooking.cooking_gas_qty,
        cooking_gas_cost: updatedBooking.cooking_gas_cost,
        extra_services_total: updatedBooking.extra_services_total,
        final_price: updatedBooking.final_price
      });
      
      // Update the booking object with the server-returned data
      Object.assign(booking, updatedBooking);
      
      // Update state values to match the confirmed values from server
      setGarbageBags(updatedBooking.garbage_bags || 0);
      setPlatesSmall(updatedBooking.plates_small || 0);
      setPlatesLarge(updatedBooking.plates_large || 0);
      setCookingGasQty(updatedBooking.cooking_gas_qty || 0);
      
      // Force component to re-render and display updated costs
      setRenderKey(prev => prev + 1);
    } catch (err: any) {
      console.error('Error saving extra services:', err);
      toast.error(err.message || 'Error saving extra services');
    } finally {
      setIsSavingExtras(false);
    }
  };

  const handleSaveBookingEdits = async () => {
    if (!booking.id) return;
    
    // Validation: start/end times only allowed for short_duration
    if (editTimeSlot !== 'short_duration' && (editStartTime || editEndTime)) {
      setValidationError('Start and end times are only allowed for short duration bookings');
      toast.error('Start and end times are only allowed for short duration bookings');
      return;
    }
    
    // Validation: if short_duration, times must be provided
    if (editTimeSlot === 'short_duration' && (!editStartTime || !editEndTime)) {
      setValidationError('Start and end times are required for short duration bookings');
      toast.error('Start and end times are required for short duration bookings');
      return;
    }
    
    setValidationError('');
    setIsSavingBookingEdits(true);
    
    try {
      // Get current admin session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        toast.error('Admin session not found. Please log in again.');
        setIsSavingBookingEdits(false);
        return;
      }

      const updatedBooking = await adminUpdateBookingDetails({
        bookingId: booking.id,
        eventType: editEventType,
        packageId: editPackageId || null,
        timeSlot: editTimeSlot,
        startTime: editTimeSlot === 'short_duration' ? (editStartTime || null) : null,
        endTime: editTimeSlot === 'short_duration' ? (editEndTime || null) : null,
        adminPriceAdjustment: adminPriceAdjustment,
        specialRequests: booking.special_requests || null,
        adminId: session.user.id,
      });
      
      // Prevent null crash
      if (!updatedBooking) {
        console.error("No updated booking returned from RPC");
        setIsSavingBookingEdits(false);
        return;
      }
      
      const finalBooking = updatedBooking;
      
      toast.success(
        <div>
          <strong>Booking Updated Successfully</strong>
          <p style={{ fontSize: '0.875rem', marginTop: '4px', opacity: 0.9 }}>
            ✓ Price recalculated by server | ₹{finalBooking.final_price?.toLocaleString()}
          </p>
        </div>,
        { duration: 4000 }
      );
      
      // Update the booking object with server data
      Object.assign(booking, finalBooking);
      
      // Update package info if package changed
      if (editPackageId) {
        const newPackage = allPackages.find(p => p.id === editPackageId);
        if (newPackage) {
          setPackageInfo(newPackage);
        }
      }
      
      setPackageChanged(false);
      setRenderKey(prev => prev + 1);
      
      // Refetch bookings list to update calendar and events
      window.location.reload();
    } catch (err: any) {
      console.error('Error saving booking edits:', err);
      toast.error(err.message || 'Error saving booking edits');
    } finally {
      setIsSavingBookingEdits(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        background: 'rgba(0, 0, 0, 0.6)', 
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        padding: 'clamp(0.75rem,3vw,1.5rem)'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="rounded-3xl overflow-hidden flex flex-col"
        style={{
          background: 'white',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: 'min(56rem, 95vw)',
          maxHeight: 'min(90vh, 1000px)',
          margin: '0 auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close Button - Fluid */}
        <div 
          className="border-b-2 flex items-center justify-between"
          style={{ 
            borderColor: '#E8E5DB',
            background: 'linear-gradient(135deg, #FAF9F6 0%, #F5F3EE 100%)',
            padding: 'clamp(0.75rem,2.5vw,1.5rem) clamp(1rem,4vw,2rem)'
          }}
        >
          <div className="flex items-center gap-[clamp(0.5rem,2vw,1rem)] min-w-0 flex-1">
            <div 
              className="rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ 
                background: 'linear-gradient(135deg, #C8D46B, #B5C55A)', 
                color: 'white',
                width: 'clamp(3rem,8vw,3.5rem)',
                height: 'clamp(3rem,8vw,3.5rem)'
              }}
            >
              <Calendar style={{ width: '45%', height: '45%' }} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[clamp(1.25rem,3vw,1.75rem)] leading-tight mb-[0.25em] truncate" style={{ color: '#2A2A2A' }}>
                Booking Details
              </h2>
              <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] truncate" style={{ color: '#999' }}>
                ID: {booking.id?.substring(0, 8)}...
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="rounded-xl transition-all duration-200 hover:scale-110 flex-shrink-0 ml-[clamp(0.5rem,2vw,1rem)]"
            style={{ 
              background: 'white', 
              border: '2px solid #E8E5DB',
              color: '#666',
              padding: 'clamp(0.5rem,1.5vw,0.75rem)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E57373';
              e.currentTarget.style.borderColor = '#E57373';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#E8E5DB';
              e.currentTarget.style.color = '#666';
            }}
          >
            <X style={{ width: 'clamp(1.25rem,3vw,1.5rem)', height: 'clamp(1.25rem,3vw,1.5rem)' }} />
          </button>
        </div>

        {/* Scrollable Content - Fluid Grid */}
        <div 
          className="overflow-y-auto flex-1"
          style={{
            padding: 'clamp(1rem,3vw,2rem) clamp(1rem,4vw,2rem)'
          }}
        >
          <div style={{ 
            display: 'grid',
            gap: 'clamp(1.5rem,3vw,2rem)'
          }}>
            {/* Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[clamp(0.5rem,1.5vw,0.75rem)]">
              <StatusBadge 
                status={booking.status} 
              />
              <div className="text-[clamp(0.75rem,1.5vw,0.875rem)]" style={{ color: '#999' }}>
                Created: {booking.created_at ? new Date(booking.created_at).toLocaleDateString() : 'N/A'}
              </div>
            </div>

            {/* Admin Booking Editor Section */}
            <div>
              <div className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] mb-[clamp(0.75rem,2vw,1.25rem)]">
                <div 
                  className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: '#2196F320', 
                    color: '#2196F3',
                    width: 'clamp(2.25rem,6vw,2.5rem)',
                    height: 'clamp(2.25rem,6vw,2.5rem)'
                  }}
                >
                  <Edit3 style={{ width: '45%', height: '45%' }} />
                </div>
                <h3 
                  className="uppercase tracking-wider text-[clamp(0.875rem,2vw,1.125rem)]"
                  style={{ color: '#2A2A2A' }}
                >
                  Edit Booking Details (Admin)
                </h3>
              </div>
              
              <div 
                className="rounded-2xl border-2"
                style={{ 
                  background: '#FAF9F6', 
                  borderColor: '#E8E5DB',
                  padding: 'clamp(0.75rem,2.5vw,1.5rem)'
                }}
              >
                <div style={{ display: 'grid', gap: 'clamp(0.75rem,2vw,1rem)' }}>
                  {/* Event Type */}
                  <div>
                    <label className="block mb-[0.5em] text-[clamp(0.75rem,1.5vw,0.875rem)]" style={{ color: '#666' }}>
                      Event Type
                    </label>
                    <select
                      value={editEventType}
                      onChange={(e) => setEditEventType(e.target.value as any)}
                      className="w-full rounded-xl transition-all duration-200 text-[clamp(0.875rem,1.5vw,1rem)]"
                      style={{
                        background: 'white',
                        border: '2px solid #E8E5DB',
                        color: '#2A2A2A',
                        outline: 'none',
                        padding: 'clamp(0.5rem,1.5vw,0.75rem) clamp(0.75rem,2vw,1rem)'
                      }}
                    >
                      <option value="birthday">Birthday Party</option>
                      <option value="meeting_conference">Meeting / Conference</option>
                      <option value="get_together">Get Together</option>
                      <option value="awareness_class">Awareness Class</option>
                      <option value="normal">Wedding/Reception</option>
                    </select>
                  </div>

                  {/* Package Selector */}
                  <div>
                    <label className="block mb-[0.5em] text-[clamp(0.75rem,1.5vw,0.875rem)]" style={{ color: '#666' }}>
                      Package
                    </label>
                    <select
                      value={editPackageId}
                      onChange={(e) => {
                        setEditPackageId(e.target.value);
                        setPackageChanged(true);
                      }}
                      className="w-full rounded-xl transition-all duration-200 text-[clamp(0.875rem,1.5vw,1rem)]"
                      style={{
                        background: 'white',
                        border: '2px solid #E8E5DB',
                        color: '#2A2A2A',
                        outline: 'none',
                        padding: 'clamp(0.5rem,1.5vw,0.75rem) clamp(0.75rem,2vw,1rem)'
                      }}
                    >
                      <option value="">Select a package...</option>
                      {allPackages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} - ₹{pkg.price?.toLocaleString()}
                        </option>
                      ))}
                    </select>
                    {packageChanged && (
                      <p className="mt-2 text-[clamp(0.75rem,1.5vw,0.875rem)] italic" style={{ color: '#F4B942' }}>
                        ⚠ Package changed — price will be recalculated on save
                      </p>
                    )}
                  </div>

                  {/* Time Slot */}
                  <div>
                    <label className="block mb-[0.5em] text-[clamp(0.75rem,1.5vw,0.875rem)]" style={{ color: '#666' }}>
                      Time Slot
                    </label>
                    <select
                      value={editTimeSlot}
                      onChange={(e) => setEditTimeSlot(e.target.value as any)}
                      className="w-full rounded-xl transition-all duration-200 text-[clamp(0.875rem,1.5vw,1rem)]"
                      style={{
                        background: 'white',
                        border: '2px solid #E8E5DB',
                        color: '#2A2A2A',
                        outline: 'none',
                        padding: 'clamp(0.5rem,1.5vw,0.75rem) clamp(0.75rem,2vw,1rem)'
                      }}
                    >
                      <option value="morning">Morning</option>
                      <option value="evening">Evening</option>
                      <option value="night">Night</option>
                      <option value="full_day">Full Day</option>
                      <option value="short_duration">Short Duration (4-5 hours)</option>
                    </select>
                  </div>

                  {/* Start & End Time (conditional) */}
                  {editTimeSlot === 'short_duration' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(0.75rem,2vw,1rem)' }}>
                      <div>
                        <label className="block mb-[0.5em] text-[clamp(0.75rem,1.5vw,0.875rem)]" style={{ color: '#666' }}>
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={editStartTime}
                          onChange={(e) => setEditStartTime(e.target.value)}
                          className="w-full rounded-xl transition-all duration-200 text-[clamp(0.875rem,1.5vw,1rem)]"
                          style={{
                            background: 'white',
                            border: '2px solid #E8E5DB',
                            color: '#2A2A2A',
                            outline: 'none',
                            padding: 'clamp(0.5rem,1.5vw,0.75rem) clamp(0.75rem,2vw,1rem)'
                          }}
                        />
                      </div>
                      <div>
                        <label className="block mb-[0.5em] text-[clamp(0.75rem,1.5vw,0.875rem)]" style={{ color: '#666' }}>
                          End Time
                        </label>
                        <input
                          type="time"
                          value={editEndTime}
                          onChange={(e) => setEditEndTime(e.target.value)}
                          className="w-full rounded-xl transition-all duration-200 text-[clamp(0.875rem,1.5vw,1rem)]"
                          style={{
                            background: 'white',
                            border: '2px solid #E8E5DB',
                            color: '#2A2A2A',
                            outline: 'none',
                            padding: 'clamp(0.5rem,1.5vw,0.75rem) clamp(0.75rem,2vw,1rem)'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Admin Price Adjustment */}
                  <div>
                    <label className="block mb-[0.5em] text-[clamp(0.75rem,1.5vw,0.875rem)]" style={{ color: '#666' }}>
                      Admin Adjustment (applied on top)
                    </label>
                    <div className="relative">
                      <span 
                        className="absolute left-[clamp(0.75rem,2vw,1rem)] top-1/2 -translate-y-1/2 text-[clamp(0.875rem,1.5vw,1rem)]" 
                        style={{ color: '#999' }}
                      >
                        ₹
                      </span>
                      <input
                        type="number"
                        step="100"
                        value={adminPriceAdjustment}
                        onChange={(e) => setAdminPriceAdjustment(parseFloat(e.target.value) || 0)}
                        className="w-full rounded-xl transition-all duration-200 text-[clamp(0.875rem,1.5vw,1rem)]"
                        style={{
                          background: 'white',
                          border: '2px solid #E8E5DB',
                          color: '#2A2A2A',
                          outline: 'none',
                          padding: 'clamp(0.5rem,1.5vw,0.75rem) clamp(0.75rem,2vw,1rem)',
                          paddingLeft: 'clamp(2rem,4vw,2.5rem)'
                        }}
                      />
                    </div>
                    <p className="mt-1 text-[clamp(0.625rem,1.25vw,0.75rem)]" style={{ color: '#999', fontStyle: 'italic' }}>
                      Can be positive or negative. Leave at 0 for no adjustment.
                    </p>
                  </div>

                  {/* Validation Error */}
                  {validationError && (
                    <div 
                      className="rounded-xl p-[clamp(0.75rem,2vw,1rem)] flex items-center gap-[0.5em] text-[clamp(0.75rem,1.5vw,0.875rem)]"
                      style={{ background: '#FEE2E2', color: '#DC2626' }}
                    >
                      <AlertCircle className="w-[1em] h-[1em] flex-shrink-0" />
                      {validationError}
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="flex justify-end gap-[clamp(0.5rem,1.5vw,0.75rem)] pt-[clamp(0.5rem,1.5vw,0.75rem)]" style={{ borderTop: '2px solid #E8E5DB' }}>
                    <button
                      onClick={handleSaveBookingEdits}
                      disabled={isSavingBookingEdits}
                      className="rounded-xl transition-all duration-200 flex items-center gap-[0.5em] disabled:opacity-50 text-[clamp(0.875rem,1.5vw,1rem)]"
                      style={{
                        background: isSavingBookingEdits ? '#E8E5DB' : 'linear-gradient(135deg, #2196F3, #1976D2)',
                        color: isSavingBookingEdits ? '#666' : 'white',
                        boxShadow: isSavingBookingEdits ? 'none' : '0 4px 12px rgba(33, 150, 243, 0.3)',
                        padding: 'clamp(0.625rem,1.5vw,0.75rem) clamp(1rem,2.5vw,1.5rem)'
                      }}
                    >
                      <Edit3 className="w-[1em] h-[1em]" />
                      {isSavingBookingEdits ? 'Saving...' : 'Save Booking Edits'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Information Section */}
            <div>
              <div className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] mb-[clamp(0.75rem,2vw,1.25rem)]">
                <div 
                  className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: '#C8D46B20', 
                    color: '#C8D46B',
                    width: 'clamp(2.25rem,6vw,2.5rem)',
                    height: 'clamp(2.25rem,6vw,2.5rem)'
                  }}
                >
                  <User style={{ width: '45%', height: '45%' }} />
                </div>
                <h3 
                  className="uppercase tracking-wider text-[clamp(0.875rem,2vw,1.125rem)]"
                  style={{ color: '#2A2A2A' }}
                >
                  Client Information
                </h3>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
                gap: 'clamp(0.75rem,2vw,1rem)'
              }}>
                <InfoCard
                  icon={<User style={{ width: '1em', height: '1em' }} />}
                  label="Full Name"
                  value={booking.full_name || ''}
                  color="#C8D46B"
                />
                <InfoCard
                  icon={<Phone style={{ width: '1em', height: '1em' }} />}
                  label="Mobile Number"
                  value={booking.mobile || ''}
                  color="#E0C097"
                />
                {booking.email && (
                  <InfoCard
                    icon={<Mail style={{ width: '1em', height: '1em' }} />}
                    label="Email Address"
                    value={booking.email}
                    color="#B5C55A"
                    span="md:col-span-2"
                  />
                )}
              </div>
            </div>

            {/* Event Details Section */}
            <div>
              <div className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] mb-[clamp(0.75rem,2vw,1.25rem)]">
                <div 
                  className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: '#4CAF5020', 
                    color: '#4CAF50',
                    width: 'clamp(2.25rem,6vw,2.5rem)',
                    height: 'clamp(2.25rem,6vw,2.5rem)'
                  }}
                >
                  <Calendar style={{ width: '45%', height: '45%' }} />
                </div>
                <h3 
                  className="uppercase tracking-wider text-[clamp(0.875rem,2vw,1.125rem)]"
                  style={{ color: '#2A2A2A' }}
                >
                  Event Details
                </h3>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                gap: 'clamp(0.75rem,2vw,1rem)'
              }}>
                <InfoCard
                  icon={<Calendar style={{ width: '1em', height: '1em' }} />}
                  label="Event Date"
                  value={formatDate(booking.booking_date || '')}
                  color="#4CAF50"
                />
                {booking.guest_count && (
                  <InfoCard
                    icon={<Users style={{ width: '1em', height: '1em' }} />}
                    label="Expected Guests"
                    value={booking.guest_count.toString()}
                    color="#E0C097"
                  />
                )}
              </div>
            </div>

            {/* Event Info Section */}
            <div>
              <div className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] mb-[clamp(0.75rem,2vw,1.25rem)]">
                <div 
                  className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: '#9C27B020', 
                    color: '#9C27B0',
                    width: 'clamp(2.25rem,6vw,2.5rem)',
                    height: 'clamp(2.25rem,6vw,2.5rem)'
                  }}
                >
                  <Package style={{ width: '45%', height: '45%' }} />
                </div>
                <h3 
                  className="uppercase tracking-wider text-[clamp(0.875rem,2vw,1.125rem)]"
                  style={{ color: '#2A2A2A' }}
                >
                  Event Info
                </h3>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                gap: 'clamp(0.75rem,2vw,1rem)'
              }}>
                <InfoCard
                  icon={<Package style={{ width: '1em', height: '1em' }} />}
                  label="Event Type"
                  value={formatEventType(booking.event_type)}
                  color="#9C27B0"
                />
                <InfoCard
                  icon={<Clock style={{ width: '1em', height: '1em' }} />}
                  label="Time Slot"
                  value={formatTimeSlot(booking.time_slot)}
                  color="#F4B942"
                />
              </div>
            </div>

            {/* Event Timing Section */}
            <div>
              <div className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] mb-[clamp(0.75rem,2vw,1.25rem)]">
                <div 
                  className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: '#FF980020', 
                    color: '#FF9800',
                    width: 'clamp(2.25rem,6vw,2.5rem)',
                    height: 'clamp(2.25rem,6vw,2.5rem)'
                  }}
                >
                  <Clock style={{ width: '45%', height: '45%' }} />
                </div>
                <h3 
                  className="uppercase tracking-wider text-[clamp(0.875rem,2vw,1.125rem)]"
                  style={{ color: '#2A2A2A' }}
                >
                  Event Timing
                </h3>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                gap: 'clamp(0.75rem,2vw,1rem)'
              }}>
                <InfoCard
                  icon={<Clock style={{ width: '1em', height: '1em' }} />}
                  label="Start Time"
                  value={booking.start_time ? formatTime(booking.start_time) : '—'}
                  color="#FF9800"
                />
                <InfoCard
                  icon={<Clock style={{ width: '1em', height: '1em' }} />}
                  label="End Time"
                  value={booking.end_time ? formatTime(booking.end_time) : '—'}
                  color="#FF5722"
                />
              </div>
            </div>

            {/* Special Requests Section */}
            {booking.special_requests && (
              <div>
                <div className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] mb-[clamp(0.75rem,2vw,1.25rem)]">
                  <div 
                    className="rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ 
                      background: '#E0C09720', 
                      color: '#E0C097',
                      width: 'clamp(2.25rem,6vw,2.5rem)',
                      height: 'clamp(2.25rem,6vw,2.5rem)'
                    }}
                  >
                    <MessageSquare style={{ width: '45%', height: '45%' }} />
                  </div>
                  <h3 
                    className="uppercase tracking-wider text-[clamp(0.875rem,2vw,1.125rem)]"
                    style={{ color: '#2A2A2A' }}
                  >
                    Special Requests
                  </h3>
                </div>
                
                <div 
                  className="rounded-2xl border-2"
                  style={{ 
                    background: '#FAF9F6', 
                    borderColor: '#E8E5DB',
                    padding: 'clamp(0.75rem,2.5vw,1.5rem)'
                  }}
                >
                  <p className="text-[clamp(0.875rem,1.5vw,1rem)]" style={{ color: '#2A2A2A', lineHeight: '1.8' }}>
                    {booking.special_requests}
                  </p>
                </div>
              </div>
            )}

            {/* Admin Notes Section */}
            <div>
              <div className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] mb-[clamp(0.75rem,2vw,1.25rem)]">
                <div 
                  className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: '#F4B94220', 
                    color: '#F4B942',
                    width: 'clamp(2.25rem,6vw,2.5rem)',
                    height: 'clamp(2.25rem,6vw,2.5rem)'
                  }}
                >
                  <FileText style={{ width: '45%', height: '45%' }} />
                </div>
                <h3 
                  className="uppercase tracking-wider text-[clamp(0.875rem,2vw,1.125rem)]"
                  style={{ color: '#2A2A2A' }}
                >
                  Admin Notes (Private)
                </h3>
              </div>
              
              <div 
                className="rounded-2xl border-2"
                style={{ 
                  background: '#FAF9F6', 
                  borderColor: '#E8E5DB',
                  padding: 'clamp(0.75rem,2.5vw,1.5rem)'
                }}
              >
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full rounded-xl transition-all duration-200 resize-none text-[clamp(0.875rem,1.5vw,1rem)]"
                  style={{
                    background: 'white',
                    border: '2px solid #E8E5DB',
                    color: '#2A2A2A',
                    outline: 'none',
                    minHeight: 'clamp(100px,15vh,150px)',
                    padding: 'clamp(0.5rem,1.5vw,0.75rem) clamp(0.75rem,2vw,1rem)'
                  }}
                  placeholder="Add internal notes like payment details, cancellation reason, follow-up actions..."
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#C8D46B';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(200, 212, 107, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E8E5DB';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <div className="flex justify-end" style={{ marginTop: 'clamp(0.75rem,2vw,1rem)' }}>
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="rounded-xl transition-all duration-200 flex items-center gap-[0.5em] disabled:opacity-50 text-[clamp(0.875rem,1.5vw,1rem)]"
                    style={{
                      background: isSavingNotes ? '#E8E5DB' : 'linear-gradient(135deg, #C8D46B, #B5C55A)',
                      color: isSavingNotes ? '#666' : 'white',
                      boxShadow: isSavingNotes ? 'none' : '0 4px 12px rgba(200, 212, 107, 0.3)',
                      padding: 'clamp(0.625rem,1.5vw,0.75rem) clamp(1rem,2.5vw,1.5rem)'
                    }}
                  >
                    <FileText className="w-[1em] h-[1em]" />
                    {isSavingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div>
              <div className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] mb-[clamp(0.75rem,2vw,1.25rem)]">
                <div 
                  className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: '#4CAF5020', 
                    color: '#4CAF50',
                    width: 'clamp(2.25rem,6vw,2.5rem)',
                    height: 'clamp(2.25rem,6vw,2.5rem)'
                  }}
                >
                  <DollarSign style={{ width: '45%', height: '45%' }} />
                </div>
                <h3 
                  className="uppercase tracking-wider text-[clamp(0.875rem,2vw,1.125rem)]"
                  style={{ color: '#2A2A2A' }}
                >
                  Pricing Details
                </h3>
              </div>
              
              <div 
                className="rounded-2xl border-2"
                style={{ 
                  background: '#FAF9F6', 
                  borderColor: '#E8E5DB',
                  padding: 'clamp(0.75rem,2.5vw,1.5rem)'
                }}
              >
                <div style={{
                  display: 'grid',
                  gap: 'clamp(0.5rem,1.5vw,0.75rem)'
                }}>
                  {/* Package */}
                  <div className="flex justify-between items-center" style={{ padding: 'clamp(0.5rem,1.5vw,0.75rem) 0' }}>
                    <span className="text-[clamp(0.875rem,1.5vw,1rem)]" style={{ color: '#666' }}>Package Selected:</span>
                    <span className="text-[clamp(0.875rem,1.5vw,1rem)]" style={{ color: '#2A2A2A' }}>
                      {isLoadingPackage ? 'Loading...' : (packageInfo?.name || 'N/A')}
                    </span>
                  </div>
                  
                  {/* Base Package Price */}
                  <div className="flex justify-between items-center" style={{ padding: 'clamp(0.5rem,1.5vw,0.75rem) 0', borderTop: '1px solid #E8E5DB' }}>
                    <span className="text-[clamp(0.875rem,1.5vw,1rem)]" style={{ color: '#666' }}>Base Package Price:</span>
                    <span className="text-[clamp(0.875rem,1.5vw,1rem)]" style={{ color: '#2A2A2A' }}>
                      ₹{packageInfo?.price?.toLocaleString() || '0'}
                    </span>
                  </div>
                  
                  {/* Cleaning Charge */}
                  <div className="flex justify-between items-center" style={{ padding: 'clamp(0.5rem,1.5vw,0.75rem) 0', borderTop: '1px solid #E8E5DB' }}>
                    <span className="text-[clamp(0.875rem,1.5vw,1rem)]" style={{ color: '#666' }}>Cleaning Charge (Fixed):</span>
                    <span className="text-[clamp(0.875rem,1.5vw,1rem)]" style={{ color: '#2A2A2A' }}>₹{(booking.floor_cleaning_cost || 3000).toLocaleString()}</span>
                  </div>
                  
                  {/* Extra Services Total - Only show if confirmed and has extras */}
                  {booking.status === 'confirmed' && (booking.extra_services_total || 0) > 0 && (
                    <div className="flex justify-between items-center" style={{ padding: 'clamp(0.5rem,1.5vw,0.75rem) 0', borderTop: '1px solid #E8E5DB' }}>
                      <span className="text-[clamp(0.875rem,1.5vw,1rem)]" style={{ color: '#666' }}>Extra Services:</span>
                      <span className="text-[clamp(0.875rem,1.5vw,1rem)]" style={{ color: '#2A2A2A' }}>₹{(booking.extra_services_total || 0).toLocaleString()}</span>
                    </div>
                  )}
                  
                  {/* Final Price - Server-Calculated (Read Only) */}
                  <div className="flex justify-between items-center" style={{ 
                    padding: 'clamp(0.75rem,2vw,1rem)', 
                    borderTop: '2px solid #E8E5DB',
                    background: 'linear-gradient(135deg, rgba(200, 212, 107, 0.1), rgba(181, 197, 90, 0.05))',
                    borderRadius: '12px',
                    marginTop: 'clamp(0.5rem,1.5vw,0.75rem)'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span className="text-[clamp(1rem,2vw,1.25rem)]" style={{ color: '#2A2A2A' }}>Final Price</span>
                      <span className="text-[clamp(0.625rem,1.25vw,0.75rem)]" style={{ color: '#999', fontStyle: 'italic' }}>(Auto-calculated by server)</span>
                    </div>
                    <span className="text-[clamp(1.25rem,2.5vw,1.5rem)]" style={{ color: '#C8D46B' }}>
                      ₹{(booking.final_price || ((packageInfo?.price || 0) + 3000)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Extra Services Section - Only show when confirmed */}
            {booking.status === 'confirmed' && (
              <div>
                <div className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] mb-[clamp(0.75rem,2vw,1.25rem)]">
                  <div 
                    className="rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ 
                      background: '#9C27B020', 
                      color: '#9C27B0',
                      width: 'clamp(2.25rem,6vw,2.5rem)',
                      height: 'clamp(2.25rem,6vw,2.5rem)'
                    }}
                  >
                    <ShoppingCart style={{ width: '45%', height: '45%' }} />
                  </div>
                  <h3 
                    className="uppercase tracking-wider text-[clamp(0.875rem,2vw,1.125rem)]"
                    style={{ color: '#2A2A2A' }}
                  >
                    Extra Services
                  </h3>
                </div>
                
                <div 
                  className="rounded-2xl border-2"
                  style={{ 
                    background: '#FAF9F6', 
                    borderColor: '#E8E5DB',
                    padding: 'clamp(0.75rem,2.5vw,1.5rem)'
                  }}
                >
                  {/* Editable Fields */}
                  <div style={{
                    display: 'grid',
                    gap: 'clamp(0.75rem,2vw,1rem)',
                    marginBottom: 'clamp(1rem,2.5vw,1.5rem)'
                  }}>
                    {/* Garbage Bags */}
                    <div>
                      <label className="block mb-[0.5em] text-[clamp(0.75rem,1.5vw,0.875rem)]" style={{ color: '#666' }}>
                        Garbage Bags
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={garbageBags}
                        onChange={(e) => setGarbageBags(parseInt(e.target.value) || 0)}
                        className="w-full rounded-xl transition-all duration-200 text-[clamp(0.875rem,1.5vw,1rem)]"
                        style={{
                          background: 'white',
                          border: '2px solid #E8E5DB',
                          color: '#2A2A2A',
                          outline: 'none',
                          padding: 'clamp(0.5rem,1.5vw,0.75rem) clamp(0.75rem,2vw,1rem)'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#C8D46B';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(200, 212, 107, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#E8E5DB';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Plates Small */}
                    <div>
                      <label className="block mb-[0.5em] text-[clamp(0.75rem,1.5vw,0.875rem)]" style={{ color: '#666' }}>
                        Plates (Small)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={platesSmall}
                        onChange={(e) => setPlatesSmall(parseInt(e.target.value) || 0)}
                        className="w-full rounded-xl transition-all duration-200 text-[clamp(0.875rem,1.5vw,1rem)]"
                        style={{
                          background: 'white',
                          border: '2px solid #E8E5DB',
                          color: '#2A2A2A',
                          outline: 'none',
                          padding: 'clamp(0.5rem,1.5vw,0.75rem) clamp(0.75rem,2vw,1rem)'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#C8D46B';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(200, 212, 107, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#E8E5DB';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Plates Large */}
                    <div>
                      <label className="block mb-[0.5em] text-[clamp(0.75rem,1.5vw,0.875rem)]" style={{ color: '#666' }}>
                        Plates (Large)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={platesLarge}
                        onChange={(e) => setPlatesLarge(parseInt(e.target.value) || 0)}
                        className="w-full rounded-xl transition-all duration-200 text-[clamp(0.875rem,1.5vw,1rem)]"
                        style={{
                          background: 'white',
                          border: '2px solid #E8E5DB',
                          color: '#2A2A2A',
                          outline: 'none',
                          padding: 'clamp(0.5rem,1.5vw,0.75rem) clamp(0.75rem,2vw,1rem)'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#C8D46B';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(200, 212, 107, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#E8E5DB';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Cooking Gas */}
                    <div>
                      <label className="block mb-[0.5em] text-[clamp(0.75rem,1.5vw,0.875rem)]" style={{ color: '#666' }}>
                        Cooking Gas (kg)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={cookingGasQty}
                        onChange={(e) => setCookingGasQty(parseFloat(e.target.value) || 0)}
                        className="w-full rounded-xl transition-all duration-200 text-[clamp(0.875rem,1.5vw,1rem)]"
                        style={{
                          background: 'white',
                          border: '2px solid #E8E5DB',
                          color: '#2A2A2A',
                          outline: 'none',
                          padding: 'clamp(0.5rem,1.5vw,0.75rem) clamp(0.75rem,2vw,1rem)'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#C8D46B';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(200, 212, 107, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#E8E5DB';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Computed Costs - Read Only (Server-Side Calculated) */}
                  <div 
                    key={renderKey}
                    className="rounded-xl border-2"
                    style={{ 
                      background: 'white', 
                      borderColor: '#E8E5DB',
                      padding: 'clamp(0.75rem,2vw,1rem)',
                      marginBottom: 'clamp(1rem,2.5vw,1.5rem)'
                    }}
                  >
                    <div style={{ display: 'grid', gap: 'clamp(0.5rem,1.5vw,0.75rem)' }}>
                      <div className="flex justify-between items-center">
                        <span className="text-[clamp(0.75rem,1.5vw,0.875rem)]" style={{ color: '#666' }}>Garbage Cost:</span>
                        <span className="text-[clamp(0.875rem,1.5vw,1rem)]" style={{ color: '#2A2A2A' }}>₹{(booking.garbage_cost || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[clamp(0.75rem,1.5vw,0.875rem)]" style={{ color: '#666' }}>Plates Cost:</span>
                        <span className="text-[clamp(0.875rem,1.5vw,1rem)]" style={{ color: '#2A2A2A' }}>₹{(booking.plates_cost || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[clamp(0.75rem,1.5vw,0.875rem)]" style={{ color: '#666' }}>Gas Cost:</span>
                        <span className="text-[clamp(0.875rem,1.5vw,1rem)]" style={{ color: '#2A2A2A' }}>₹{(booking.cooking_gas_cost || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center" style={{ 
                        paddingTop: 'clamp(0.5rem,1.5vw,0.75rem)', 
                        borderTop: '2px solid #E8E5DB',
                        marginTop: 'clamp(0.25rem,1vw,0.5rem)'
                      }}>
                        <span className="text-[clamp(0.875rem,1.5vw,1rem)]" style={{ color: '#2A2A2A' }}>Extra Total:</span>
                        <span className="text-[clamp(1rem,2vw,1.25rem)]" style={{ color: '#C8D46B' }}>₹{(booking.extra_services_total || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveExtras}
                      disabled={isSavingExtras}
                      className="rounded-xl transition-all duration-200 flex items-center gap-[0.5em] disabled:opacity-50 text-[clamp(0.875rem,1.5vw,1rem)]"
                      style={{
                        background: isSavingExtras ? '#E8E5DB' : 'linear-gradient(135deg, #C8D46B, #B5C55A)',
                        color: isSavingExtras ? '#666' : 'white',
                        boxShadow: isSavingExtras ? 'none' : '0 4px 12px rgba(200, 212, 107, 0.3)',
                        padding: 'clamp(0.625rem,1.5vw,0.75rem) clamp(1rem,2.5vw,1.5rem)'
                      }}
                    >
                      <ShoppingCart className="w-[1em] h-[1em]" />
                      {isSavingExtras ? 'Saving...' : 'Save Extras'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Audit Trail Section */}
            <div>
              <button
                onClick={() => setShowAuditTrail(!showAuditTrail)}
                className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] mb-[clamp(0.75rem,2vw,1.25rem)] w-full hover:opacity-80 transition-opacity"
              >
                <div 
                  className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: '#2196F320', 
                    color: '#2196F3',
                    width: 'clamp(2.25rem,6vw,2.5rem)',
                    height: 'clamp(2.25rem,6vw,2.5rem)'
                  }}
                >
                  <Activity style={{ width: '45%', height: '45%' }} />
                </div>
                <h3 
                  className="uppercase tracking-wider text-[clamp(0.875rem,2vw,1.125rem)] flex-1 text-left"
                  style={{ color: '#2A2A2A' }}
                >
                  Action History {showAuditTrail ? '▼' : '►'}
                </h3>
              </button>

              {showAuditTrail && (
                <div 
                  className="rounded-2xl border-2"
                  style={{ 
                    background: '#FAF9F6', 
                    borderColor: '#E8E5DB',
                    padding: 'clamp(0.75rem,2.5vw,1.5rem)'
                  }}
                >
                  {isLoadingActions ? (
                    <div className="text-center py-4" style={{ color: '#666' }}>
                      Loading action history...
                    </div>
                  ) : bookingActions.length === 0 ? (
                    <div className="text-center py-4" style={{ color: '#666' }}>
                      No actions recorded yet
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: 'clamp(0.75rem,2vw,1rem)' }}>
                      {bookingActions.map((action, index) => {
                        const actionMessage = formatAdminHistory(action);

                        return (
                        <div 
                          key={action.id}
                          className="rounded-xl border"
                          style={{
                            padding: 'clamp(0.75rem,2vw,1rem)',
                            borderColor: '#E8E5DB',
                            background: index === 0 ? 'rgba(200, 212, 107, 0.05)' : 'white'
                          }}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <p 
                                className="text-[clamp(0.875rem,1.5vw,1rem)] mb-1"
                                style={{ color: '#2A2A2A', lineHeight: '1.5' }}
                              >
                                {actionMessage}
                              </p>
                              <span className="text-[clamp(0.75rem,1.5vw,0.875rem)]" style={{ color: '#999' }}>
                                {new Date(action.performed_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          {action.notes && (
                            <div 
                              className="text-[clamp(0.875rem,1.5vw,1rem)] mt-3 pt-3 border-t"
                              style={{ color: '#666', borderColor: '#E8E5DB', fontStyle: 'italic' }}
                            >
                              Note: {action.notes}
                            </div>
                          )}
                        </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Action Buttons - Fluid */}
        <div 
          className="border-t-2"
          style={{ 
            borderColor: '#E8E5DB',
            background: '#FAF9F6',
            padding: 'clamp(0.75rem,2.5vw,1.5rem) clamp(1rem,4vw,2rem)'
          }}
        >
          <div className="flex flex-col sm:flex-row gap-[clamp(0.5rem,1.5vw,0.75rem)]">
            {booking.status === 'pending' && (
              <>
                <button
                  onClick={handleConfirmBooking}
                  disabled={updateStatusMutation.isPending}
                  className="flex-1 rounded-xl transition-all duration-200 flex items-center justify-center gap-[0.5em] disabled:opacity-50 disabled:cursor-not-allowed text-[clamp(0.875rem,1.5vw,1rem)]"
                  style={{
                    background: 'linear-gradient(135deg, #4CAF50, #45A049)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                    padding: 'clamp(0.75rem,2vw,1rem) clamp(1rem,2.5vw,1.5rem)'
                  }}
                >
                  <Check className="w-[1.25em] h-[1.25em]" />
                  <span className="font-medium">Confirm Booking</span>
                </button>
                <button
                  onClick={() => onCancel(booking)}
                  className="flex-1 rounded-xl transition-all duration-200 flex items-center justify-center gap-[0.5em] text-[clamp(0.875rem,1.5vw,1rem)]"
                  style={{
                    background: 'white',
                    border: '2px solid #E57373',
                    color: '#E57373',
                    padding: 'clamp(0.75rem,2vw,1rem) clamp(1rem,2.5vw,1.5rem)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#E57373';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#E57373';
                  }}
                >
                  <XCircle className="w-[1.25em] h-[1.25em]" />
                  <span className="font-medium">Reject</span>
                </button>
              </>
            )}

            {booking.status === 'confirmed' && (
              <>
                <button
                  onClick={() => onStatusUpdate(booking.id!, 'completed')}
                  disabled={updateStatusMutation.isPending}
                  className="flex-1 rounded-xl transition-all duration-200 flex items-center justify-center gap-[0.5em] disabled:opacity-50 disabled:cursor-not-allowed text-[clamp(0.875rem,1.5vw,1rem)]"
                  style={{
                    background: 'linear-gradient(135deg, #E0C097, #C29A5D)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(224, 192, 151, 0.3)',
                    padding: 'clamp(0.75rem,2vw,1rem) clamp(1rem,2.5vw,1.5rem)'
                  }}
                >
                  <CheckCircle className="w-[1.25em] h-[1.25em]" />
                  <span className="font-medium">Mark Completed</span>
                </button>
                <button
                  onClick={() => onCancel(booking)}
                  className="flex-1 rounded-xl transition-all duration-200 flex items-center justify-center gap-[0.5em] text-[clamp(0.875rem,1.5vw,1rem)]"
                  style={{
                    background: 'white',
                    border: '2px solid #E57373',
                    color: '#E57373',
                    padding: 'clamp(0.75rem,2vw,1rem) clamp(1rem,2.5vw,1.5rem)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#E57373';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#E57373';
                  }}
                >
                  <Ban className="w-[1.25em] h-[1.25em]" />
                  <span className="font-medium">Cancel Booking</span>
                </button>
              </>
            )}
            
            {booking.status === 'cancelled' && (
              <button
                onClick={() => onDelete(booking)}
                className="flex-1 rounded-xl transition-all duration-200 flex items-center justify-center gap-[0.5em] text-[clamp(0.875rem,1.5vw,1rem)]"
                style={{
                  background: 'white',
                  border: '2px solid #999',
                  color: '#999',
                  padding: 'clamp(0.75rem,2vw,1rem) clamp(1rem,2.5vw,1.5rem)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FF3333';
                  e.currentTarget.style.borderColor = '#FF3333';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#999';
                  e.currentTarget.style.color = '#999';
                }}
              >
                <Trash2 className="w-[1.25em] h-[1.25em]" />
                <span className="font-medium">Delete Permanently</span>
              </button>
            )}

            {booking.status === 'completed' && (
              <div className="flex-1 text-center" style={{ padding: 'clamp(0.75rem,2vw,1rem)' }}>
                <div className="flex items-center justify-center gap-[0.5em] text-[clamp(0.875rem,1.5vw,1rem)]" style={{ color: '#4CAF50' }}>
                  <CheckCircle className="w-[1.25em] h-[1.25em]" />
                  <span className="font-medium">Event Completed Successfully</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


function InfoCard({ icon, label, value, color, span }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  span?: string;
}) {
  return (
    <div 
      className={`rounded-2xl ${span || ''}`}
      style={{ 
        background: '#F5F3EE',
        padding: 'clamp(0.75rem,2vw,1rem)'
      }}
    >
      <div className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)]">
        <div 
          className="rounded-xl flex items-center justify-center flex-shrink-0 text-[clamp(0.875rem,1.5vw,1rem)]"
          style={{ 
            background: `${color}20`, 
            color,
            width: '2.5em',
            height: '2.5em'
          }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[clamp(0.7rem,1.25vw,0.75rem)] mb-[0.25em]" style={{ color: '#999' }}>{label}</div>
          <div className="truncate text-[clamp(0.875rem,1.5vw,1rem)]" style={{ color: '#2A2A2A' }}>{value}</div>
        </div>
      </div>
    </div>
  );
}


export { BookingDetailsModal, InfoCard };
