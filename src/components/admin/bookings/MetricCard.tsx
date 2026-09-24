// src/components/admin/bookings/MetricCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  delay?: number;
  color?: string;
  subtitle?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  icon, 
  trend = 'up', 
  delay = 0, 
  color = '#B6F500',
  subtitle
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md p-5 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.08)] transition-all group"
    >
      {/* Top accent glow line */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-300"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
          {title}
        </span>
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110"
          style={{ 
            backgroundColor: `${color}18`,
            color: color === '#B6F500' ? '#4A6B00' : color
          }}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-bold tracking-tight text-slate-900 font-sans">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {change && (
          <span 
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend === 'up' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                : 'bg-amber-50 text-amber-700 border border-amber-200/60'
            }`}
          >
            {trend === 'up' ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
      )}
    </motion.div>
  );
}
