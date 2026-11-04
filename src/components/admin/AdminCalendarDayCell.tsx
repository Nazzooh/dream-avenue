import { motion } from 'motion/react';

interface AdminCalendarDayCellProps {
  day: number;
  dateStr: string;
  status: 'available' | 'partial' | 'full';
  hasEvent: boolean;
  eventCount: number;
  isToday: boolean;
  onClick: () => void;
}

export function AdminCalendarDayCell({
  day,
  status,
  hasEvent,
  eventCount,
  isToday,
  onClick,
}: AdminCalendarDayCellProps) {
  let bg = '#FAF8F5';
  let border = '1px solid #E8E3DA';
  let text = '#1B221B';
  let badgeBg = '#EBF2DE';
  let badgeText = '#415D10';
  let badgeLabel = 'Open';

  if (status === 'full') {
    bg = '#FDF1EE';
    border = '1px solid #F0C4B8';
    text = '#8B2C1F';
    badgeBg = '#FCE3DD';
    badgeText = '#A1342C';
    badgeLabel = 'Blocked';
  } else if (status === 'partial') {
    bg = '#FBF6EE';
    border = '1px dashed #B88B52';
    text = '#7A5420';
    badgeBg = '#F6EBDD';
    badgeText = '#8C5E24';
    badgeLabel = eventCount > 0 ? `${eventCount} Booked` : 'Partial';
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.96 }}
      style={{
        aspectRatio: '1',
        borderRadius: '12px',
        border,
        background: bg,
        color: text,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 4px 6px',
        position: 'relative',
        boxSizing: 'border-box',
        boxShadow: isToday ? '0 0 0 2px #537517, 0 4px 12px rgba(83, 117, 23, 0.15)' : '0 2px 4px rgba(27, 34, 27, 0.02)',
        transition: 'all 0.2s ease',
      }}
    >
      {hasEvent && (
        <span
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#B88B52',
          }}
        />
      )}
      <span
        style={{
          fontSize: '0.9375rem',
          fontWeight: isToday ? 700 : 600,
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          lineHeight: 1,
        }}
      >
        {day}
      </span>
      <span
        style={{
          fontSize: '0.625rem',
          fontWeight: 650,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          padding: '2px 5px',
          borderRadius: '4px',
          background: badgeBg,
          color: badgeText,
          lineHeight: 1.1,
          maxWidth: '90%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {badgeLabel}
      </span>
    </motion.button>
  );
}

