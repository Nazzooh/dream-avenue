import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  Printer, 
  MessageCircle, 
  Building, 
  Leaf, 
  Utensils, 
  Users,
  AlertCircle
} from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SEOHead } from '../components/SEOHead';
import { PublicBookingCalendar } from '../components/PublicBookingCalendar';
import { SlotSelectorGrid, SLOT_OPTIONS, SHORT_DURATION_SLOT } from '../components/slot-booking/SlotSelectorGrid';
import { usePackages } from '../src/hooks/usePackages';
import { toast } from 'sonner';
import { createBooking, normalizeTimes } from '../src/api/createBooking';
import { CONTACT_INFO } from '../src/constants/contact';

const MANDATORY_CLEANING_FEE = 3000;
const SHORT_DURATION_PRICE = 26000;
const STANDARD_HALL_PRICE = 30000;

export default function SmartSlotBookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDate = searchParams.get('date') || '';
  const initialPackage = searchParams.get('package') || null;

  // 1-based Stage Navigation: 1: Date/Slot, 2: Package, 3: Event Details, 4: Contact, 5: Booking Pass
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form selections state
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [selectedSlot, setSelectedSlot] = useState<string>('full_day');
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(initialPackage);
  const [eventType, setEventType] = useState<string>('normal');
  const [guestCount, setGuestCount] = useState<string>('300');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Completed booking pass state
  const [bookingConfirmation, setBookingConfirmation] = useState<{
    id: string;
    reference: string;
    date: string;
    slotLabel: string;
    slotTime: string;
    packageName: string;
    basePrice: number;
    cleaningFee: number;
    totalPrice: number;
    guestCount: number;
    fullName: string;
    mobile: string;
  } | null>(null);

  // Packages list
  const { data: packages = [] } = usePackages();

  const selectedPackage = useMemo(() => {
    if (!selectedPackageId) return null;
    return packages.find((p) => p.id === selectedPackageId) || null;
  }, [packages, selectedPackageId]);

  // Deep-link initial stage jump if date or package already specified
  useEffect(() => {
    if (initialDate && initialPackage) {
      setCurrentStep(3);
    } else if (initialDate) {
      setCurrentStep(1);
    } else if (initialPackage) {
      setCurrentStep(1);
    }
  }, [initialDate, initialPackage]);

  // Price Calculation Logic
  const priceLedger = useMemo(() => {
    let base = 0;
    let label = 'Standard Hall Reservation';

    if (selectedSlot === 'short_duration') {
      base = SHORT_DURATION_PRICE;
      label = 'Short Duration Slot (4–5 Hours)';
    } else if (selectedPackage) {
      base = selectedPackage.price > 0 ? selectedPackage.price : STANDARD_HALL_PRICE;
      label = selectedPackage.name;
    } else {
      base = STANDARD_HALL_PRICE;
      label = 'Standard Hall Reservation';
    }

    const cleaning = MANDATORY_CLEANING_FEE;
    const total = base + cleaning;

    return {
      base,
      label,
      cleaning,
      total,
    };
  }, [selectedSlot, selectedPackage]);

  // Active Slot Label
  const activeSlotMeta = useMemo(() => {
    if (selectedSlot === 'short_duration') {
      return SHORT_DURATION_SLOT;
    }
    return SLOT_OPTIONS.find((s) => s.key === selectedSlot) || SLOT_OPTIONS[0];
  }, [selectedSlot]);

  // Handle Mobile Input Sanitization
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    let clean = raw.startsWith('91') && raw.length > 10 ? raw.slice(2) : raw;
    clean = clean.slice(0, 10);
    setMobile(clean);
  };

﻿  // Submit Booking
  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      toast.error('Please select an event date');
      setCurrentStep(1);
      return;
    }
    if (!fullName.trim() || fullName.trim().length < 2) {
      toast.error('Please enter your full name');
      return;
    }
    if (!mobile || mobile.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!termsAccepted) {
      toast.error('Please accept the venue policies & terms');
      return;
    }

    setIsSubmitting(true);

    try {
      const { start, end } = normalizeTimes(selectedSlot);
      const combinedNotes = `Event: ${eventType} | Slot: ${activeSlotMeta.label} (${activeSlotMeta.time}) | Package: ${priceLedger.label}`;

      const newBooking = await createBooking({
        full_name: fullName.trim(),
        mobile: mobile.trim(),
        booking_date: selectedDate,
        start_time: start,
        end_time: end,
        guest_count: parseInt(guestCount) || 300,
        package_id: selectedPackageId,
        special_requests: specialRequests ? `${combinedNotes}\nRequests: ${specialRequests}` : combinedNotes,
        email: email.trim() || null,
        additional_notes: `Floor Cleaning Included (₹3,000) | Est Total: ₹${priceLedger.total.toLocaleString('en-IN')}`,
        user_id: null,
      });

      const refId = `DA-${new Date().getFullYear()}-${String(newBooking?.id || Math.floor(1000 + Math.random() * 9000)).slice(-4).toUpperCase()}`;

      setBookingConfirmation({
        id: String(newBooking?.id || refId),
        reference: refId,
        date: selectedDate,
        slotLabel: activeSlotMeta.label,
        slotTime: activeSlotMeta.time,
        packageName: priceLedger.label,
        basePrice: priceLedger.base,
        cleaningFee: priceLedger.cleaning,
        totalPrice: priceLedger.total,
        guestCount: parseInt(guestCount) || 300,
        fullName: fullName.trim(),
        mobile: mobile.trim(),
      });

      setCurrentStep(5);
      toast.success('Reservation request submitted successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Booking failed:', err);
      toast.error('Failed to submit booking', {
        description: err.message || 'Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp Pre-filled link
  const whatsappUrl = useMemo(() => {
    if (!bookingConfirmation) return '#';
    const text = encodeURIComponent(
      `Hello Dream Avenue Concierge! 🌟\n\nI have submitted a venue booking request:\n• Ref: ${bookingConfirmation.reference}\n• Name: ${bookingConfirmation.fullName}\n• Mobile: +91 ${bookingConfirmation.mobile}\n• Date: ${bookingConfirmation.date}\n• Time Slot: ${bookingConfirmation.slotLabel} (${bookingConfirmation.slotTime})\n• Plan: ${bookingConfirmation.packageName}\n• Guests: ${bookingConfirmation.guestCount}\n• Estimated Total: ₹${bookingConfirmation.totalPrice.toLocaleString('en-IN')} (incl. ₹3,000 floor cleaning)\n\nPlease confirm availability and next steps for my reservation.`
    );
    return `https://wa.me/${CONTACT_INFO.phones.whatsapp.replace(/\D/g, '')}?text=${text}`;
  }, [bookingConfirmation]);

  return (
    <div className="editorial-page" style={{ minHeight: '100vh', background: '#FAF8F5', paddingTop: '90px', paddingBottom: '80px' }}>
      <SEOHead
        title="Reserve Dream Avenue Event Hall | Online Booking Concierge"
        description="Check real-time date availability, select time slots, explore curated packages, and reserve Dream Avenue Event Hall in Calicut with complete transparent pricing."
        url="https://dreamavenue.in/booking"
      />
      <Navbar />

      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        {/* Step Indicator Header (Steps 1-4) */}
        {currentStep < 5 && (
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  if (currentStep > 1) setCurrentStep((prev) => prev - 1);
                  else navigate('/');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: '#537517',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  padding: '6px 0',
                }}
              >
                <ArrowLeft size={16} />
                <span>{currentStep === 1 ? 'Return to Home' : 'Previous Step'}</span>
              </button>

              <div style={{ fontSize: '0.8125rem', color: '#737E72', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Stage {currentStep} of 4
              </div>
            </div>

            {/* Visual Stepper */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[
                { step: 1, title: 'Date & Slot' },
                { step: 2, title: 'Package' },
                { step: 3, title: 'Event Details' },
                { step: 4, title: 'Contact & Confirm' },
              ].map((s) => {
                const isActive = currentStep === s.step;
                const isDone = currentStep > s.step;
                return (
                  <div
                    key={s.step}
                    onClick={() => {
                      if (s.step < currentStep) setCurrentStep(s.step);
                    }}
                    style={{
                      cursor: s.step < currentStep ? 'pointer' : 'default',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div
                      style={{
                        height: '4px',
                        borderRadius: '2px',
                        background: isActive ? '#537517' : isDone ? '#3E5811' : '#E8E3DA',
                        transition: 'background 0.3s ease',
                      }}
                    />
                    <div style={{ fontSize: '0.75rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#1B221B' : '#737E72' }}>
                      {s.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Layout */}
        {currentStep < 5 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(300px, 360px)',
              gap: '36px',
              alignItems: 'start',
            }}
            className="booking-split-container"
          >
            {/* Left Column: Stage Specific Content */}
            <div style={{ minWidth: 0 }}>
              <AnimatePresence mode="wait">
                {/* STAGE 1: Date & Time Slot */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{ marginBottom: '24px' }}>
                      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.75rem', fontWeight: 700, color: '#1B221B', margin: '0 0 8px 0' }}>
                        Select Date & Schedule
                      </h2>
                      <p style={{ color: '#737E72', fontSize: '0.9375rem', margin: 0 }}>
                        Choose your celebration date from the live availability calendar below, then pick your desired time slot.
                      </p>
                    </div>

                    {/* Calendar */}
                    <div style={{ marginBottom: '32px' }}>
                      <PublicBookingCalendar
                        selectedDate={selectedDate}
                        onDateSelect={(d) => {
                          setSelectedDate(d);
                          toast.success(`Selected date: ${d}`);
                        }}
                      />
                    </div>

                    {/* Time Slot Selector */}
                    <div
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        padding: '24px',
                        border: '1px solid #E8E3DA',
                        boxShadow: '0 4px 16px rgba(27, 34, 27, 0.04)',
                        marginBottom: '32px',
                      }}
                    >
                      <SlotSelectorGrid
                        selectedSlot={selectedSlot}
                        onSlotChange={(s) => setSelectedSlot(s)}
                        eventType={eventType}
                      />
                    </div>

                    {/* Navigation CTA */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedDate) {
                            toast.error('Please pick an available date first');
                            return;
                          }
                          setCurrentStep(2);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '14px 28px',
                          background: selectedDate ? '#537517' : '#C5CEB8',
                          color: '#FFFFFF',
                          borderRadius: '12px',
                          fontWeight: 600,
                          fontSize: '0.9375rem',
                          border: 'none',
                          cursor: selectedDate ? 'pointer' : 'not-allowed',
                          boxShadow: selectedDate ? '0 4px 14px rgba(83, 117, 23, 0.25)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <span>Continue to Package Selection</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

﻿                {/* STAGE 2: Package Selection */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{ marginBottom: '24px' }}>
                      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.75rem', fontWeight: 700, color: '#1B221B', margin: '0 0 8px 0' }}>
                        Choose Your Venue Plan
                      </h2>
                      <p style={{ color: '#737E72', fontSize: '0.9375rem', margin: 0 }}>
                        Select one of our curated plans or choose the Standard Hall option.
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                      {/* Standard Hall Option */}
                      <div
                        onClick={() => setSelectedPackageId(null)}
                        style={{
                          background: selectedPackageId === null ? '#EDF6DE' : '#FFFFFF',
                          border: selectedPackageId === null ? '2px solid #537517' : '1px solid #E8E3DA',
                          borderRadius: '16px',
                          padding: '24px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '10px',
                              background: '#FFFFFF',
                              color: '#537517',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1px solid #DFCAAB',
                            }}
                          >
                            <Building size={20} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#1B221B', marginBottom: '2px' }}>
                              Standard Hall Reservation (Hall Only)
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#737E72' }}>
                              Full auditorium, dining banquet access, stage, and primary utilities.
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1B221B' }}>
                            ₹30,000
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#537517', fontWeight: 600 }}>
                            Base Hall Rate
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Packages */}
                      {packages.map((pkg) => {
                        const isSelected = selectedPackageId === pkg.id;
                        return (
                          <div
                            key={pkg.id}
                            onClick={() => setSelectedPackageId(pkg.id)}
                            style={{
                              background: isSelected ? '#EDF6DE' : '#FFFFFF',
                              border: isSelected ? '2px solid #537517' : '1px solid #E8E3DA',
                              borderRadius: '16px',
                              padding: '24px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.25rem', color: '#1B221B' }}>
                                    {pkg.name}
                                  </span>
                                  {isSelected && (
                                    <span style={{ background: '#537517', color: '#FFFFFF', padding: '2px 8px', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 600 }}>
                                      Selected
                                    </span>
                                  )}
                                </div>
                                <p style={{ color: '#737E72', fontSize: '0.875rem', margin: 0 }}>
                                  {pkg.description}
                                </p>
                              </div>

                              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: '1.35rem', color: '#1B221B' }}>
                                  ₹{pkg.price && pkg.price > 0 ? Number(pkg.price).toLocaleString('en-IN') : 'Custom'}
                                </div>
                              </div>
                            </div>

                            {/* Features Preview */}
                            {pkg.features && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                                {pkg.features.slice(0, 4).map((f: string, fIdx: number) => (
                                  <div
                                    key={fIdx}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      fontSize: '0.75rem',
                                      background: '#FFFFFF',
                                      padding: '4px 10px',
                                      borderRadius: '6px',
                                      color: '#485247',
                                      border: '1px solid #E8E3DA',
                                    }}
                                  >
                                    <Check size={12} style={{ color: '#537517' }} />
                                    <span>{f}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        style={{
                          padding: '14px 24px',
                          background: 'transparent',
                          border: '1px solid #DFCAAB',
                          borderRadius: '12px',
                          fontWeight: 600,
                          fontSize: '0.9375rem',
                          color: '#485247',
                          cursor: 'pointer',
                        }}
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(3);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '14px 28px',
                          background: '#537517',
                          color: '#FFFFFF',
                          borderRadius: '12px',
                          fontWeight: 600,
                          fontSize: '0.9375rem',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <span>Continue to Event Details</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STAGE 3: Event Details & Inclusions */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{ marginBottom: '24px' }}>
                      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.75rem', fontWeight: 700, color: '#1B221B', margin: '0 0 8px 0' }}>
                        Event Scope & Transparent Ledger
                      </h2>
                      <p style={{ color: '#737E72', fontSize: '0.9375rem', margin: 0 }}>
                        Tell us about your occasion. All mandatory services are transparently detailed below.
                      </p>
                    </div>

                    <div
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        padding: '28px',
                        border: '1px solid #E8E3DA',
                        boxShadow: '0 4px 16px rgba(27, 34, 27, 0.04)',
                        marginBottom: '32px',
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                        {/* Event Type */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1B221B', marginBottom: '8px' }}>
                            Event Type
                          </label>
                          <select
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '12px 14px',
                              borderRadius: '10px',
                              border: '1px solid #DFCAAB',
                              background: '#FFFFFF',
                              color: '#1B221B',
                              fontSize: '0.9375rem',
                              fontFamily: 'inherit',
                            }}
                          >
                            <option value="normal">Wedding / Reception</option>
                            <option value="birthday">Birthday Party (Qualifies for Short Duration)</option>
                            <option value="get_together">Get-Together (Qualifies for Short Duration)</option>
                            <option value="meeting">Business Meeting / Conference</option>
                            <option value="awareness_class">Seminar / Awareness Class</option>
                            <option value="other">Other Gathering</option>
                          </select>
                        </div>

                        {/* Guest Count */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1B221B', marginBottom: '8px' }}>
                            Estimated Guest Count
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="1500"
                            value={guestCount}
                            onChange={(e) => setGuestCount(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '12px 14px',
                              borderRadius: '10px',
                              border: '1px solid #DFCAAB',
                              background: '#FFFFFF',
                              color: '#1B221B',
                              fontSize: '0.9375rem',
                              fontFamily: 'inherit',
                            }}
                          />
                        </div>
                      </div>

                      {/* Special Requests */}
                      <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1B221B', marginBottom: '8px' }}>
                          Special Notes or Requests <span style={{ color: '#737E72', fontWeight: 400 }}>(Optional)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          placeholder="e.g. Preferred caterer, stage setup timings, or valet requirements..."
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            border: '1px solid #E8E3DA',
                            background: '#FFFFFF',
                            color: '#1B221B',
                            fontSize: '0.9375rem',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                          }}
                        />
                      </div>

                      {/* Inclusions & Policies Box */}
                      <div
                        style={{
                          background: '#FAF8F5',
                          borderRadius: '16px',
                          padding: '20px',
                          border: '1px solid #DFCAAB',
                        }}
                      >
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1B221B', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ShieldCheck size={18} style={{ color: '#537517' }} />
                          <span>Venue Policies & Included Services</span>
                        </div>

                        {/* Mandatory Floor Cleaning */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#EDF6DE', color: '#537517', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                            <Check size={14} strokeWidth={3} />
                          </div>
                          <div>
                            <span style={{ fontWeight: 600, color: '#1B221B', fontSize: '0.875rem' }}>
                              Mandatory Floor Cleaning Service (₹3,000)
                            </span>
                            <p style={{ margin: '2px 0 0 0', fontSize: '0.8125rem', color: '#737E72' }}>
                              Ensures thorough sanitation, industrial floor buffing, and complete trash disposal before and after your event. Itemized in all reservations.
                            </p>
                          </div>
                        </div>

                        {/* Zero-Plastic Policy */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#EDF6DE', color: '#537517', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                            <Leaf size={14} />
                          </div>
                          <div>
                            <span style={{ fontWeight: 600, color: '#1B221B', fontSize: '0.875rem' }}>
                              Zero-Plastic Eco Policy
                            </span>
                            <p style={{ margin: '2px 0 0 0', fontSize: '0.8125rem', color: '#737E72' }}>
                              Single-use plastics are prohibited. Purified water points are accessible throughout the venue.
                            </p>
                          </div>
                        </div>

                        {/* Sustainable Plate Rentals */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#FAF4EB', color: '#B88B52', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                            <Utensils size={14} />
                          </div>
                          <div>
                            <span style={{ fontWeight: 600, color: '#1B221B', fontSize: '0.875rem' }}>
                              Optional Sustainable Plate Rentals
                            </span>
                            <p style={{ margin: '2px 0 0 0', fontSize: '0.8125rem', color: '#737E72' }}>
                              Large Dining Plates (₹3.50/plate) and Small Dessert Plates (₹2.50/plate) can be settled directly on event day if needed.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        style={{
                          padding: '14px 24px',
                          background: 'transparent',
                          border: '1px solid #DFCAAB',
                          borderRadius: '12px',
                          fontWeight: 600,
                          fontSize: '0.9375rem',
                          color: '#485247',
                          cursor: 'pointer',
                        }}
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(4);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '14px 28px',
                          background: '#537517',
                          color: '#FFFFFF',
                          borderRadius: '12px',
                          fontWeight: 600,
                          fontSize: '0.9375rem',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <span>Continue to Contact & Confirm</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

﻿                {/* STAGE 4: Client Contact & Agreement */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{ marginBottom: '24px' }}>
                      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.75rem', fontWeight: 700, color: '#1B221B', margin: '0 0 8px 0' }}>
                        Client Information & Agreement
                      </h2>
                      <p style={{ color: '#737E72', fontSize: '0.9375rem', margin: 0 }}>
                        Provide your primary contact number. We will prepare your Digital Booking Pass instantly.
                      </p>
                    </div>

                    <form onSubmit={handleConfirmReservation}>
                      <div
                        style={{
                          background: '#FFFFFF',
                          borderRadius: '20px',
                          padding: '28px',
                          border: '1px solid #E8E3DA',
                          boxShadow: '0 4px 16px rgba(27, 34, 27, 0.04)',
                          marginBottom: '32px',
                        }}
                      >
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                          {/* Full Name */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1B221B', marginBottom: '8px' }}>
                              Full Name *
                            </label>
                            <div style={{ position: 'relative' }}>
                              <input
                                type="text"
                                required
                                placeholder="Your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '12px 14px 12px 40px',
                                  borderRadius: '10px',
                                  border: '1px solid #DFCAAB',
                                  background: '#FFFFFF',
                                  color: '#1B221B',
                                  fontSize: '0.9375rem',
                                  fontFamily: 'inherit',
                                }}
                              />
                              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#737E72' }} />
                            </div>
                          </div>

                          {/* Mobile */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1B221B', marginBottom: '8px' }}>
                              Mobile Number (10 digits) *
                            </label>
                            <div style={{ position: 'relative' }}>
                              <input
                                type="tel"
                                required
                                placeholder="9876543210"
                                value={mobile}
                                onChange={handleMobileChange}
                                maxLength={10}
                                style={{
                                  width: '100%',
                                  padding: '12px 14px 12px 40px',
                                  borderRadius: '10px',
                                  border: '1px solid #DFCAAB',
                                  background: '#FFFFFF',
                                  color: '#1B221B',
                                  fontSize: '0.9375rem',
                                  fontFamily: 'inherit',
                                }}
                              />
                              <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#737E72' }} />
                            </div>
                          </div>
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: '24px' }}>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1B221B', marginBottom: '8px' }}>
                            Email Address <span style={{ color: '#737E72', fontWeight: 400 }}>(Optional for receipt)</span>
                          </label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type="email"
                              placeholder="you@domain.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '12px 14px 12px 40px',
                                borderRadius: '10px',
                                border: '1px solid #DFCAAB',
                                background: '#FFFFFF',
                                color: '#1B221B',
                                fontSize: '0.9375rem',
                                fontFamily: 'inherit',
                              }}
                            />
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#737E72' }} />
                          </div>
                        </div>

                        {/* Terms & Conditions Acceptance */}
                        <div
                          style={{
                            padding: '16px',
                            background: '#FAF8F5',
                            borderRadius: '12px',
                            border: '1px solid #E8E3DA',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                          }}
                        >
                          <input
                            type="checkbox"
                            id="termsCheck"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            style={{ width: '18px', height: '18px', accentColor: '#537517', marginTop: '2px', cursor: 'pointer' }}
                          />
                          <label htmlFor="termsCheck" style={{ fontSize: '0.8125rem', color: '#485247', lineHeight: 1.5, cursor: 'pointer' }}>
                            I agree to Dream Avenue Event Hall policies: zero single-use plastic policy, no drinks inside the main auditorium, and complete payment settlement prior to the event date.
                          </label>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          style={{
                            padding: '14px 24px',
                            background: 'transparent',
                            border: '1px solid #DFCAAB',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '0.9375rem',
                            color: '#485247',
                            cursor: 'pointer',
                          }}
                        >
                          Back
                        </button>

                        <button
                          type="submit"
                          disabled={isSubmitting || !termsAccepted || mobile.length !== 10}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '14px 32px',
                            background: (termsAccepted && mobile.length === 10 && !isSubmitting) ? '#537517' : '#C5CEB8',
                            color: '#FFFFFF',
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '1rem',
                            border: 'none',
                            cursor: (termsAccepted && mobile.length === 10 && !isSubmitting) ? 'pointer' : 'not-allowed',
                            boxShadow: (termsAccepted && mobile.length === 10) ? '0 6px 20px rgba(83, 117, 23, 0.3)' : 'none',
                          }}
                        >
                          {isSubmitting ? (
                            <span>Securing Request...</span>
                          ) : (
                            <>
                              <span>Confirm Reservation Request</span>
                              <Check size={18} strokeWidth={2.5} />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Sticky Live Folio Breakdown */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #DFCAAB',
                  boxShadow: '0 8px 24px rgba(27, 34, 27, 0.06)',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #F0EBE2', paddingBottom: '12px' }}>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.2rem', color: '#1B221B' }}>
                    Reservation Folio
                  </div>
                  <div style={{ background: '#EDF6DE', color: '#537517', padding: '3px 8px', borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Live Ledger
                  </div>
                </div>

                {/* Selected Date & Slot */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
                    <CalendarIcon size={16} style={{ color: '#537517', flexShrink: 0 }} />
                    <span style={{ color: '#1B221B', fontWeight: 600 }}>
                      {selectedDate || 'Select a date in Step 1'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
                    <Clock size={16} style={{ color: '#B88B52', flexShrink: 0 }} />
                    <span style={{ color: '#485247' }}>
                      {activeSlotMeta.label} ({activeSlotMeta.time})
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
                    <Building size={16} style={{ color: '#737E72', flexShrink: 0 }} />
                    <span style={{ color: '#485247' }}>
                      {priceLedger.label}
                    </span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div style={{ borderTop: '1px solid #F0EBE2', paddingTop: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#485247', marginBottom: '8px' }}>
                    <span>Base Venue Rental</span>
                    <span>₹{priceLedger.base.toLocaleString('en-IN')}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#537517', fontWeight: 600, marginBottom: '8px' }}>
                    <span>Mandatory Floor Cleaning</span>
                    <span>₹{priceLedger.cleaning.toLocaleString('en-IN')}</span>
                  </div>

                  <div style={{ borderTop: '1px dashed #E8E3DA', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, color: '#1B221B', fontSize: '1rem' }}>
                      Estimated Total
                    </span>
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: '#1B221B', fontSize: '1.5rem' }}>
                      ₹{priceLedger.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#737E72', lineHeight: 1.5 }}>
                  * Final dates and timing are subject to deposit confirmation. No hidden charges.
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STAGE 5: Digital Booking Pass */
          <motion.div
            key="step-5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ maxWidth: '680px', margin: '0 auto' }}
          >
            {bookingConfirmation && (
              <div>
                {/* Perforated Ticket Card */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    border: '1px solid #DFCAAB',
                    boxShadow: '0 24px 64px -12px rgba(27, 34, 27, 0.12)',
                    overflow: 'hidden',
                    position: 'relative',
                    marginBottom: '24px',
                  }}
                >
                  {/* Ticket Top Banner */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #1B221B 0%, #2A382A 100%)',
                      color: '#FAF8F5',
                      padding: '28px 32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.6875rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#DFCAAB', fontWeight: 600, marginBottom: '4px' }}>
                        Digital Booking Pass
                      </div>
                      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', fontWeight: 700 }}>
                        Dream Avenue Event Hall
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.6875rem', color: '#DFCAAB', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Booking Reference
                      </div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FAF8F5', letterSpacing: '1px' }}>
                        {bookingConfirmation.reference}
                      </div>
                    </div>
                  </div>

                  {/* Ticket Body */}
                  <div style={{ padding: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#737E72', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
                          Primary Host
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '1.0625rem', color: '#1B221B' }}>
                          {bookingConfirmation.fullName}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#737E72' }}>
                          +91 {bookingConfirmation.mobile}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#737E72', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
                          Event Date & Schedule
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '1.0625rem', color: '#1B221B' }}>
                          {bookingConfirmation.date}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#537517', fontWeight: 600 }}>
                          {bookingConfirmation.slotLabel} ({bookingConfirmation.slotTime})
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#737E72', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
                          Reserved Plan
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: '#1B221B' }}>
                          {bookingConfirmation.packageName}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#737E72' }}>
                          Est. Guests: {bookingConfirmation.guestCount}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#737E72', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
                          Status
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#EDF6DE', color: '#3E5811', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 700 }}>
                          <Check size={14} />
                          <span>Request Received</span>
                        </div>
                      </div>
                    </div>

                    {/* Perforated Separator */}
                    <div style={{ position: 'relative', borderBottom: '2px dashed #E8E3DA', margin: '24px -32px', paddingBottom: '0' }} />

                    {/* Financial Summary */}
                    <div style={{ paddingTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#485247', marginBottom: '8px' }}>
                        <span>Base Rental Amount</span>
                        <span>₹{bookingConfirmation.basePrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#537517', fontWeight: 600, marginBottom: '12px' }}>
                        <span>Mandatory Floor Cleaning (Included)</span>
                        <span>₹{bookingConfirmation.cleaningFee.toLocaleString('en-IN')}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid #F0EBE2', paddingTop: '12px' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#1B221B' }}>
                          Total Estimated Amount
                        </span>
                        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.75rem', color: '#1B221B' }}>
                          ₹{bookingConfirmation.totalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instant Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* WhatsApp Connect */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '16px',
                      background: '#25D366',
                      color: '#FFFFFF',
                      borderRadius: '14px',
                      fontWeight: 700,
                      fontSize: '1.0625rem',
                      textDecoration: 'none',
                      boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)',
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <MessageCircle size={22} />
                    <span>Chat with Venue Concierge on WhatsApp</span>
                  </a>

                  {/* Print & Return Buttons */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      style={{
                        flex: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '14px',
                        background: '#FFFFFF',
                        border: '1px solid #DFCAAB',
                        borderRadius: '12px',
                        color: '#1B221B',
                        fontWeight: 600,
                        fontSize: '0.9375rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Printer size={18} />
                      <span>Print Pass</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      style={{
                        flex: '1',
                        padding: '14px',
                        background: '#FAF4EB',
                        border: '1px solid #DFCAAB',
                        borderRadius: '12px',
                        color: '#B88B52',
                        fontWeight: 600,
                        fontSize: '0.9375rem',
                        cursor: 'pointer',
                      }}
                    >
                      Return to Website
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
