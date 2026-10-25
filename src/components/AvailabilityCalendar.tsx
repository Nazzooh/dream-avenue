import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCalendarMonth } from '../src/hooks/useCalendar';
import type { CalendarDaySlots } from '../src/api/calendar';

interface DateCellProps {
  date: Date;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  status: 'available' | 'booked' | 'partial' | null;
  onSelectDate: (dateStr: string) => void;
}

function DateCell({ date, dateStr, isCurrentMonth, isToday, isPast, status, onSelectDate }: DateCellProps) {
  const day = date.getDate();

  let cellStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '10px',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    cursor: 'default',
    position: 'relative',
    boxSizing: 'border-box',
  };

  if (!isCurrentMonth) {
    cellStyles.color = '#C5CEB8';
    cellStyles.opacity = '0.35';
    cellStyles.background = 'transparent';
  } else if (isPast) {
    cellStyles.color = '#A5AFA4';
    cellStyles.opacity = '0.45';
    cellStyles.background = 'transparent';
  } else if (status === 'booked') {
    // Soft sand/gold for fully booked
    cellStyles.background = '#FAF4EB';
    cellStyles.color = '#A67B43';
    cellStyles.border = '1px solid #DFCAAB';
    cellStyles.fontWeight = '600';
  } else if (status === 'partial') {
    // Partial slots available
    cellStyles.background = '#F6F8ED';
    cellStyles.color = '#537517';
    cellStyles.border = '1px dashed #537517';
    cellStyles.fontWeight = '600';
    cellStyles.cursor = 'pointer';
  } else if (status === 'available') {
    // Full day available - Warm Olive Tint
    cellStyles.background = '#EDF6DE';
    cellStyles.color = '#3E5811';
    cellStyles.border = '1px solid #C6DDA4';
    cellStyles.fontWeight = '600';
    cellStyles.cursor = 'pointer';
  } else {
    cellStyles.color = '#1B221B';
    cellStyles.background = 'transparent';
  }

  // Today indicator ring
  if (isToday) {
    cellStyles.boxShadow = '0 0 0 2px #537517';
    cellStyles.fontWeight = '700';
  }

  const isClickable = !isPast && isCurrentMonth && (status === 'available' || status === 'partial');

  return (
    <motion.button
      type="button"
      onClick={() => isClickable && onSelectDate(dateStr)}
      disabled={!isClickable}
      style={{
        ...cellStyles,
        border: cellStyles.border || 'none',
        outline: 'none',
        fontFamily: 'inherit',
      }}
      whileHover={isClickable ? { scale: 1.08, boxShadow: '0 4px 12px rgba(83, 117, 23, 0.25)' } : {}}
      whileTap={isClickable ? { scale: 0.95 } : {}}
    >
      {day}
    </motion.button>
  );
}

function CalendarGrid({ 
  currentDate, 
  availabilityData,
  onSelectDate,
}: { 
  currentDate: Date;
  availabilityData: Record<string, CalendarDaySlots>;
  onSelectDate: (dateStr: string) => void;
}) {
  const today = useMemo(() => new Date(), []);
  
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const dayOfWeek = firstDay.getDay(); // 0 = Sunday
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - dayOfWeek);
    
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  }, [currentDate]);

  return (
    <div style={{ width: '100%' }}>
      {/* Day headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          marginBottom: '12px',
          textAlign: 'center',
        }}
      >
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
          <div
            key={day}
            style={{
              fontSize: '0.75rem',
              color: '#737E72',
              fontWeight: 600,
              letterSpacing: '1px',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar dates */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
        }}
      >
        {calendarDays.map((date, idx) => {
          const dateStr = date.toISOString().split('T')[0];
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = 
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
          const isPast = date < today && !isToday;
          
          let status: 'available' | 'booked' | 'partial' | null = null;
          if (availabilityData && availabilityData[dateStr]) {
            const dayData: CalendarDaySlots = availabilityData[dateStr];
            if (dayData.full_day) {
              status = 'booked';
            } else if (dayData.morning || dayData.evening || dayData.night || dayData.short_duration) {
              status = 'partial';
            } else {
              status = 'available';
            }
          } else if (isCurrentMonth && !isPast) {
            status = 'available';
          }

          return (
            <DateCell
              key={idx}
              date={date}
              dateStr={dateStr}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              isPast={isPast}
              status={status}
              onSelectDate={onSelectDate}
            />
          );
        })}
      </div>
    </div>
  );
}

function CalendarHeader({ 
  currentDate, 
  onPrevMonth, 
  onNextMonth 
}: {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  const monthYear = useMemo(() => {
    return currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }, [currentDate]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        width: '100%',
      }}
    >
      <button
        onClick={onPrevMonth}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          background: '#FFFFFF',
          border: '1px solid #E8E3DA',
          borderRadius: '50%',
          cursor: 'pointer',
          color: '#1B221B',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#537517')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E8E3DA')}
      >
        <ChevronLeft size={20} />
      </button>

      <h3
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '1.35rem',
          fontWeight: 700,
          color: '#1B221B',
          margin: 0,
        }}
      >
        {monthYear}
      </h3>

      <button
        onClick={onNextMonth}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          background: '#FFFFFF',
          border: '1px solid #E8E3DA',
          borderRadius: '50%',
          cursor: 'pointer',
          color: '#1B221B',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#537517')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E8E3DA')}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

export function AvailabilityCalendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data: availabilityData = {} } = useCalendarMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const handleSelectDate = (dateStr: string) => {
    navigate(`/booking?date=${dateStr}`);
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '32px 28px',
        border: '1px solid #E8E3DA',
        boxShadow: '0 12px 36px rgba(27, 34, 27, 0.06)',
        maxWidth: '720px',
        margin: '0 auto',
      }}
    >
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
      />

      <CalendarGrid
        currentDate={currentDate}
        availabilityData={availabilityData}
        onSelectDate={handleSelectDate}
      />

      {/* Legend & Help */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid #F0EBE2',
          fontSize: '0.8125rem',
          color: '#485247',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#EDF6DE', border: '1px solid #C6DDA4' }} />
          <span>Available (Click to Book)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#F6F8ED', border: '1px dashed #537517' }} />
          <span>Partial Slots Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#FAF4EB', border: '1px solid #DFCAAB' }} />
          <span>Reserved</span>
        </div>
      </div>
    </div>
  );
}