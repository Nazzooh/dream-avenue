import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

interface SatisfactionRateCardProps {
  value: number; // 0-100
  delay?: number;
}

export function SatisfactionRateCard({ value, delay = 0 }: SatisfactionRateCardProps) {
  // Progress ring calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '32px 24px',
        border: '1px solid #E8E3DA',
        boxShadow: '0 4px 16px rgba(27, 34, 27, 0.04)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
      }}
      whileHover={{
        borderColor: '#DFCAAB',
        boxShadow: '0 12px 28px rgba(27, 34, 27, 0.08)',
        y: -4,
      }}
    >
      {/* Content container */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Heart Icon */}
        <motion.div
          style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 16px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#B88B52',
            background: '#FAF4EB',
            borderRadius: '50%',
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.1 }}
        >
          <Heart size={24} fill="#B88B52" strokeWidth={1} />
        </motion.div>

        {/* Circular Progress Ring with centered percentage */}
        <motion.div
          style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            margin: '0 auto 16px auto',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            style={{
              transform: 'rotate(-90deg)',
            }}
          >
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#F0EBE2"
              strokeWidth="6"
            />
            {/* Progress circle */}
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="url(#satisfactionEditorialGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              whileInView={{ strokeDashoffset }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: delay + 0.3 }}
            />
            <defs>
              <linearGradient id="satisfactionEditorialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#537517" />
                <stop offset="100%" stopColor="#B88B52" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Centered percentage text */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1B221B',
            }}
          >
            {value}%
          </div>
        </motion.div>

        {/* Label */}
        <div
          style={{
            fontWeight: 600,
            fontSize: '1.0625rem',
            color: '#1B221B',
            marginBottom: '4px',
          }}
        >
          Client Satisfaction
        </div>
        <div style={{ fontSize: '0.875rem', color: '#737E72' }}>
          Positive host feedback
        </div>
      </div>
    </motion.div>
  );
}