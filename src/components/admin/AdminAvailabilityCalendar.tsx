import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useCalendarMonth, useCalendarEvents } from '@/hooks/useCalendar';
import { format } from 'date-fns';
import type { CalendarDaySlots, CalendarEvent } from '@/api/calendar';
import { AdminDateActionModal } from './AdminDateActionModal';
import { AdminCalendarDayCell } from './AdminCalendarDayCell';
import { CalendarLoadingSpinner } from '../LoadingFallback';

interface AdminAvailabilityCalendarProps {
  onDateSelect?: (date: Date) => void;
}

export function AdminAvailabilityCalendar({ onDateSelect }: AdminAvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = useMemo(() => new Date(year, month, 1), [year, month]);
  const lastDay = useMemo(() => new Date(year, month + 1, 0), [year, month]);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Local date strings to prevent UTC shift
  const monthStart = format(firstDay, 'yyyy-MM-dd');
  const monthEnd = format(lastDay, 'yyyy-MM-dd');

  // Load calendar availability and event counts
  const { data: calendarData = {}, isLoading: loadingStatus, error } = useCalendarMonth(year, month + 1);
  const { data: events = [], isLoading: loadingEvents } = useCalendarEvents(monthStart, monthEnd);

  const isLoading = loadingStatus || loadingEvents;

  // Map events by date (day field returned by get_calendar_events RPC)
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent>();
    events.forEach((event) => {
      const dateKey = event.day || event.event_date;
      if (!dateKey) return;
      map.set(dateKey, event);
    });
    return map;
  }, [events]);

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const formatDateString = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getDateStatus = (dateStr: string) => {
    const dayData: CalendarDaySlots | undefined = calendarData[dateStr];
    const dayEvent = eventsByDate.get(dateStr);
    const eventCount = dayEvent?.bookings_count || 0;
    const hasEvent = eventCount > 0;

    if (!dayData) {
      return { status: 'available' as const, hasEvent, eventCount };
    }

    if (dayData.full_day || (!dayData.morning && !dayData.evening && !dayData.night)) {
      return { status: 'full' as const, hasEvent, eventCount };
    }

    if (!dayData.morning || !dayData.evening || !dayData.night) {
      return { status: 'partial' as const, hasEvent, eventCount };
    }

    return { status: 'available' as const, hasEvent, eventCount };
  };

  const handleDayClick = (day: number) => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
    setShowActionModal(true);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isLoading) {
    return (
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 4px 20px rgba(27, 34, 27, 0.05)',
          border: '1px solid #E8E3DA',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CalendarLoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E8E3DA' }}>
        <CalendarIcon size={40} style={{ color: '#A1342C', margin: '0 auto 12px' }} />
        <p style={{ color: '#A1342C', fontWeight: 600 }}>Error loading availability calendar</p>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 8px 30px rgba(27, 34, 27, 0.05)',
          border: '1px solid #E8E3DA',
        }}
      >
        {/* Month Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.35rem',
                fontWeight: 600,
                color: '#1B221B',
                margin: 0,
              }}
            >
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: '#737E72' }}>
              Select a date to manage bookings or block slots
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={previousMonth}
              aria-label="Previous Month"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                border: '1px solid #E8E3DA',
                background: '#FAF8F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#1B221B',
                transition: 'all 0.2s ease',
              }}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={nextMonth}
              aria-label="Next Month"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                border: '1px solid #E8E3DA',
                background: '#FAF8F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#1B221B',
                transition: 'all 0.2s ease',
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Weekday Headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          {weekDays.map((day) => (
            <div
              key={day}
              style={{
                textAlign: 'center',
                fontSize: '0.75rem',
                fontWeight: 650,
                color: '#737E72',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '6px 0',
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Day Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dateStr = formatDateString(day);
            const { status, hasEvent, eventCount } = getDateStatus(dateStr);
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

            return (
              <AdminCalendarDayCell
                key={day}
                day={day}
                dateStr={dateStr}
                status={status}
                hasEvent={hasEvent}
                eventCount={eventCount}
                isToday={isToday}
                onClick={() => handleDayClick(day)}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #F0EBE2',
            flexWrap: 'wrap',
            justifyContent: 'center',
            fontSize: '0.8125rem',
            color: '#485247',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#EBF2DE', border: '1px solid #C6DDA4' }} />
            <span>Open (Available)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#FBF6EE', border: '1px dashed #B88B52' }} />
            <span>Partial (1+ Slots Free)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#FDF1EE', border: '1px solid #F0C4B8' }} />
            <span>Blocked / Reserved</span>
          </div>
        </div>
      </div>

      {showActionModal && selectedDate && (
        <AdminDateActionModal
          date={selectedDate}
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
        />
      )}
    </>
  );
}
