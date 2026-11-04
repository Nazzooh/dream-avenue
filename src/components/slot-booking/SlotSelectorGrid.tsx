import { motion } from 'motion/react';
import { Sun, Sunset, Moon, Clock, Check, Sparkles } from 'lucide-react';

export type TimeSlotOption = {
  key: string;
  label: string;
  time: string;
  discount: number;
  icon: typeof Sun;
  color: string;
  bgColor: string;
};

export const SLOT_OPTIONS: TimeSlotOption[] = [
  {
    key: 'full_day',
    label: 'Full Day',
    time: '10 AM – 6 PM',
    discount: 0,
    icon: Clock,
    color: '#537517',
    bgColor: '#EDF6DE',
  },
  {
    key: 'morning',
    label: 'Half Day (Morning)',
    time: '10 AM – 2 PM',
    discount: 0,
    icon: Sun,
    color: '#B88B52',
    bgColor: '#FAF4EB',
  },
  {
    key: 'evening',
    label: 'Half Day (Evening)',
    time: '2 PM – 6 PM',
    discount: 0,
    icon: Sunset,
    color: '#C27D38',
    bgColor: '#FAF0E6',
  },
  {
    key: 'night',
    label: 'Night Gala',
    time: '6 PM – 10 PM',
    discount: 0,
    icon: Moon,
    color: '#4A5B6E',
    bgColor: '#EEF2F6',
  },
];

export const SHORT_DURATION_SLOT: TimeSlotOption = {
  key: 'short_duration',
  label: 'Short Duration',
  time: '4–5 Hours (Flexible)',
  discount: 0,
  icon: Sparkles,
  color: '#8C6228',
  bgColor: '#FAF4EB',
};

// Event types that qualify for short duration booking
export const SHORT_DURATION_EVENT_TYPES = ['birthday', 'meeting', 'get_together', 'get-together', 'awareness_class', 'awareness-class'];

interface SlotSelectorGridProps {
  selectedSlot: string;
  onSlotChange: (slot: string) => void;
  basePrice?: number;
  eventType?: string;
}

export function SlotSelectorGrid({ selectedSlot, onSlotChange, eventType }: SlotSelectorGridProps) {
  // Check if event type qualifies for short duration
  const showShortDuration = eventType && SHORT_DURATION_EVENT_TYPES.includes(eventType);
  
  const slotsToShow = showShortDuration 
    ? [SHORT_DURATION_SLOT, ...SLOT_OPTIONS]
    : [SHORT_DURATION_SLOT, ...SLOT_OPTIONS]; // Show as flexible option for transparency

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.125rem', fontWeight: 700, color: '#1B221B', margin: '0 0 6px 0' }}>
          Select Event Time Slot
        </h4>
        <p style={{ fontSize: '0.875rem', color: '#737E72', margin: 0 }}>
          Choose the schedule that best accommodates your celebration.
        </p>

        {showShortDuration && (
          <div
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              background: '#FAF4EB',
              borderRadius: '10px',
              borderLeft: '4px solid #B88B52',
              fontSize: '0.8125rem',
              color: '#8C6228',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Sparkles size={16} />
            <span>
              <strong>Special Plan:</strong> Short Duration 4–5 Hour Slot available at ₹26,000 for qualifying events!
            </span>
          </div>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
        }}
      >
        {slotsToShow.map((slot, index) => {
          const isSelected = selectedSlot === slot.key;
          const Icon = slot.icon;

          return (
            <motion.button
              key={slot.key}
              type="button"
              onClick={() => onSlotChange(slot.key)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                position: 'relative',
                padding: '16px 14px',
                background: isSelected ? slot.bgColor : '#FFFFFF',
                border: isSelected
                  ? `2px solid ${slot.color}`
                  : '1px solid #E8E3DA',
                borderRadius: '14px',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: isSelected
                  ? '0 6px 16px rgba(83, 117, 23, 0.15)'
                  : '0 2px 6px rgba(0, 0, 0, 0.02)',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: slot.color,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
              )}

              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: isSelected ? '#FFFFFF' : slot.bgColor,
                  color: slot.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                }}
              >
                <Icon size={16} />
              </div>

              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1B221B', marginBottom: '2px' }}>
                {slot.label}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#737E72' }}>
                {slot.time}
              </div>

              {slot.key === 'short_duration' && (
                <div style={{ marginTop: '6px', fontSize: '0.6875rem', color: '#537517', fontWeight: 700 }}>
                  ₹26,000 Special Rate
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}