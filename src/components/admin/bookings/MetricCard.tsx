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
      className="relative overflow-hidden rounded-xl bg-white p-5 border border-slate-200 shadow-sm transition-shadow hover:shadow-md group"
    >
      {/* Top accent glow line */}
      <div 
        className="absolute inset-x-0 top-0 h-0.5 transition-all duration-300"
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
        <span className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
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
