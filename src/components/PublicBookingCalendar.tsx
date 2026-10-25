import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useCalendarMonth } from '../src/hooks/useCalendar';
import type { CalendarDaySlots } from '../src/api/calendar';
import { CalendarLoadingSpinner } from './LoadingFallback';

interface PublicBookingCalendarProps {
  selectedDate?: string;
  onDateSelect: (date: string) => void;
  minDate?: Date;
}

export function PublicBookingCalendar({
  selectedDate,
  onDateSelect,
  minDate = new Date(),
}: PublicBookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { year, month, daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const { data: calendarData = {}, isLoading, error } = useCalendarMonth(year, month + 1);

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const formatDateString = (day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const getDateStatus = (dateStr: string, date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return 'past';
    }

    const dayData: CalendarDaySlots | undefined = calendarData[dateStr];
    if (!dayData) {
      return 'available';
    }

    if (dayData.full_day) {
      return 'full';
    }

    if (dayData.morning || dayData.evening || dayData.night || dayData.short_duration) {
      return 'partial';
    }

    return 'available';
  };

  const isDateDisabled = (day: number, status: string) => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || status === 'full' || status === 'past';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isLoading) {
    return (
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid #E8E3DA',
          boxShadow: '0 4px 16px rgba(27, 34, 27, 0.04)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '280px',
        }}
      >
        <CalendarLoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid #E8E3DA',
          textAlign: 'center',
        }}
      >
        <CalendarIcon size={40} style={{ color: '#737E72', margin: '0 auto 12px' }} />
        <p style={{ color: '#ef4444', marginBottom: '8px' }}>
          Unable to refresh calendar availability.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '24px 20px',
        border: '1px solid #E8E3DA',
        boxShadow: '0 4px 16px rgba(27, 34, 27, 0.04)',
      }}
    >
      {/* Month Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <button
          type="button"
          onClick={previousMonth}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid #E8E3DA',
            background: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1B221B',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#537517')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E8E3DA')}
        >
          <ChevronLeft size={18} />
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            fontSize: '1.2rem',
            color: '#1B221B',
          }}
        >
          <CalendarIcon size={18} style={{ color: '#537517' }} />
          <span>
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>

        <button
          type="button"
          onClick={nextMonth}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid #E8E3DA',
            background: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1B221B',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#537517')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E8E3DA')}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Week day headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '6px',
          marginBottom: '10px',
        }}
      >
        {weekDays.map((day) => (
          <div
            key={day}
            style={{
              textAlign: 'center',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: '#737E72',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '6px',
        }}
      >
        {/* Empty cells */}
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dateStr = formatDateString(day);
          const date = new Date(year, month, day);
          const isSelected = selectedDate === dateStr;
          const status = getDateStatus(dateStr, date);
          const isDisabled = isDateDisabled(day, status);

          let backgroundColor = 'transparent';
          let borderColor = 'transparent';
          let textColor = '#1B221B';

          if (isSelected) {
            backgroundColor = '#537517';
            borderColor = '#537517';
            textColor = '#FFFFFF';
          } else if (status === 'full') {
            backgroundColor = '#FAF4EB';
            borderColor = '#DFCAAB';
            textColor = '#A67B43';
          } else if (status === 'partial') {
            backgroundColor = '#F6F8ED';
            borderColor = '#537517';
            textColor = '#537517';
          } else if (status === 'available') {
            backgroundColor = '#EDF6DE';
            borderColor = '#C6DDA4';
            textColor = '#3E5811';
          } else if (status === 'past') {
            backgroundColor = '#F5F5F3';
            borderColor = '#EAE6DF';
            textColor = '#A5AFA4';
          }

          return (
            <motion.button
              key={day}
              type="button"
              onClick={() => {
                if (!isDisabled) {
                  onDateSelect(dateStr);
                }
              }}
              whileHover={!isDisabled ? { scale: 1.08 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              disabled={isDisabled}
              style={{
                aspectRatio: '1 / 1',
                borderRadius: '8px',
                border: isSelected ? '2px solid #537517' : (status === 'partial' ? '1px dashed #537517' : `1px solid ${borderColor}`),
                background: backgroundColor,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                fontWeight: isSelected ? 700 : 500,
                color: textColor,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit',
              }}
            >
              {day}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid #F0EBE2',
          fontSize: '0.75rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          color: '#485247',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#EDF6DE', border: '1px solid #C6DDA4' }} />
          <span>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#F6F8ED', border: '1px dashed #537517' }} />
          <span>Partial</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#FAF4EB', border: '1px solid #DFCAAB' }} />
          <span>Reserved</span>
        </div>
      </div>
    </div>
  );
}