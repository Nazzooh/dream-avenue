import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export function MetricCard({ title, value, change, icon, trend = 'up', delay = 0, color = '#B6F500' }: {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  delay?: number;
  color?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: "easeOut" }}
      className="admin-metric-card"
      style={{
        padding: 'clamp(1rem,2.5vw,1.5rem)',
        borderRadius: 'clamp(0.75rem,2vw,1rem)',
        borderLeft: `4px solid ${color}`
      }}
    >
      <div className="admin-metric-header">
        <span 
          className="admin-metric-label"
          style={{
            fontSize: 'clamp(0.75rem,1.5vw,0.875rem)'
          }}
        >
          {title}
        </span>
        <div 
          className="admin-metric-icon"
          style={{
            width: 'clamp(2.5rem,6vw,3rem)',
            height: 'clamp(2.5rem,6vw,3rem)',
            fontSize: 'clamp(1rem,2vw,1.25rem)',
            background: `${color}15`,
            color: color
          }}
        >
          {icon}
        </div>
      </div>
      
      <div 
        className="admin-metric-value"
        style={{
          fontSize: 'clamp(1.75rem,4vw,2.5rem)'
        }}
      >
        {value}
      </div>
      
      {change && (
        <div 
          className={`admin-metric-change ${trend === 'up' ? 'positive' : 'negative'}`}
          style={{
            fontSize: 'clamp(0.75rem,1.25vw,0.875rem)'
          }}
        >
          <TrendingUp className="w-[1em] h-[1em]" style={{ 
            transform: trend === 'down' ? 'rotate(180deg)' : 'rotate(0deg)' 
          }} />
          <span>{change}</span>
        </div>
      )}
    </motion.div>
  );
}
