import React, { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateManualBooking } from '@/hooks/useCalendar';
import { usePackages } from '@/hooks/usePackages';
import { Modal } from '../admin-v2/Modal';

interface AdminManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDate: string;
}

export function AdminManualBookingModal({ isOpen, onClose, preselectedDate }: AdminManualBookingModalProps) {
  const { data: packages = [] } = usePackages();
  const createBookingMutation = useCreateManualBooking();

  const [formData, setFormData] = useState({
    full_name: '',
    mobile: '',
    email: '',
    guest_count: '',
    event_type: 'wedding',
    package_id: '',
    special_requests: '',
    additional_notes: '',
    time_slot: 'full_day',
    start_time: '',
    end_time: '',
  });

  const timeSlots = [
    { value: 'morning', label: 'Morning (10:00 - 14:00)' },
    { value: 'evening', label: 'Evening (14:00 - 18:00)' },
    { value: 'night', label: 'Night (18:00 - 22:00)' },
    { value: 'full_day', label: 'Full Day (10:00 - 18:00)' },
    { value: 'short_duration', label: 'Short Duration (Custom Times)' },
  ];

  const eventTypes = [
    { value: 'wedding', label: 'Wedding' },
    { value: 'birthday', label: 'Birthday' },
    { value: 'conference', label: 'Conference' },
    { value: 'corporate', label: 'Corporate Event' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name || !formData.mobile) {
      toast.error('Please fill in required fields (Name and Mobile)');
      return;
    }

    try {
      const payload: any = {
        full_name: formData.full_name,
        mobile: formData.mobile,
        email: formData.email || undefined,
        event_date: preselectedDate,
        event_type: formData.event_type,
        time_slot: formData.time_slot,
        start_time: formData.time_slot === 'short_duration' ? formData.start_time : undefined,
        end_time: formData.time_slot === 'short_duration' ? formData.end_time : undefined,
        guest_count: formData.guest_count ? parseInt(formData.guest_count) : undefined,
        package_id: formData.package_id || undefined,
        special_requests: formData.special_requests || undefined,
        additional_notes: formData.additional_notes || undefined,
        status: 'confirmed',
      };

      await createBookingMutation.mutateAsync(payload);
      toast.success('Manual booking created successfully!');
      onClose();
    } catch (error: any) {
      console.error('Error creating manual booking:', error);
      toast.error(error.message || 'Failed to create booking');
    }
  };

  const formattedDate = new Date(preselectedDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Manual Booking"
      description={`Confirmed booking for ${formattedDate}`}
      size="lg"
      footer={
        <div className="admin-modal-actions">
          <button type="button" className="workspace-button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            form="manual-booking-form"
            className="workspace-button workspace-button-primary inline-flex items-center gap-2"
            disabled={createBookingMutation.isPending}
          >
            {createBookingMutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={16} /> Create Booking
              </>
            )}
          </button>
        </div>
      }
    >
      <form id="manual-booking-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Contact Information */}
        <div className="admin-form-section">
          <h4 className="admin-form-section-title">Customer Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="admin-label block mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="admin-input w-full"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="admin-label block mb-1">
                Mobile <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                className="admin-input w-full"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="admin-label block mb-1">Email</label>
              <input
                type="email"
                className="admin-input w-full"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="admin-label block mb-1">Guest Count</label>
              <input
                type="number"
                className="admin-input w-full"
                value={formData.guest_count}
                onChange={(e) => setFormData({ ...formData, guest_count: e.target.value })}
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Event Specification */}
        <div className="admin-form-section">
          <h4 className="admin-form-section-title">Event & Timing</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="admin-label block mb-1">Event Type</label>
              <select
                className="admin-select w-full"
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
              >
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-label block mb-1">Package</label>
              <select
                className="admin-select w-full"
                value={formData.package_id}
                onChange={(e) => setFormData({ ...formData, package_id: e.target.value })}
              >
                <option value="">No Package</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="admin-label block mb-1">Time Slot</label>
            <select
              className="admin-select w-full"
              value={formData.time_slot}
              onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
            >
              {timeSlots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
          </div>

          {formData.time_slot === 'short_duration' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="admin-label block mb-1">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  className="admin-input w-full"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="admin-label block mb-1">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  className="admin-input w-full"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Requests & Notes */}
        <div className="admin-form-section">
          <h4 className="admin-form-section-title">Special Requests & Notes</h4>
          <div>
            <label className="admin-label block mb-1">Special Requests</label>
            <textarea
              className="admin-textarea w-full"
              value={formData.special_requests}
              onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
              rows={2}
            />
          </div>
          <div>
            <label className="admin-label block mb-1">Additional Notes</label>
            <textarea
              className="admin-textarea w-full"
              value={formData.additional_notes}
              onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
              rows={2}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
