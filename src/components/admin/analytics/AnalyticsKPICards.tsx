// src/components/admin/analytics/AnalyticsKPICards.tsx
// Premium KPI cards with shadcn Card, Badge, Progress, and Tooltip
import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, CalendarCheck, TrendingUp, Users,
  Percent, BarChart3, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
import { AnalyticsSummaryStats } from './types';

interface AnalyticsKPICardsProps {
  stats: AnalyticsSummaryStats;
  isLoading: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

function formatCurrency(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export const AnalyticsKPICards: React.FC<AnalyticsKPICardsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[168px] rounded-2xl bg-white/60 animate-pulse border border-[#E0C097]/20" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Gross Revenue',
      value: formatCurrency(stats.grossRevenue),
      tooltip: 'Total revenue from all non-cancelled bookings in selected period',
      icon: DollarSign,
      gradient: 'from-[#C29A5D]/15 to-[#E0C097]/10',
      iconBg: 'bg-[#C29A5D]/20',
      iconColor: 'text-[#C29A5D]',
      badgeText: stats.totalBookings > 0 ? `${stats.totalBookings} bookings` : 'No data',
      badgeClass: 'bg-[#C29A5D]/15 text-[#9A7B48] border-[#C29A5D]/30',
    },
    {
      title: 'Confirmed Bookings',
      value: stats.confirmedBookings.toString(),
      tooltip: 'Bookings currently confirmed and awaiting completion',
      icon: CalendarCheck,
      gradient: 'from-[#B6F500]/15 to-[#D9F8C4]/10',
      iconBg: 'bg-[#B6F500]/20',
      iconColor: 'text-[#75A000]',
      badgeText: `${stats.pendingBookings} pending`,
      badgeClass: 'bg-[#FFE59D]/40 text-[#8B6914] border-[#FFE59D]/60',
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      tooltip: 'Percentage of bookings that became confirmed or completed',
      icon: Percent,
      gradient: 'from-[#10B981]/15 to-[#D1FAE5]/10',
      iconBg: 'bg-[#10B981]/20',
      iconColor: 'text-[#059669]',
      progress: stats.conversionRate,
      progressColor: 'bg-[#10B981]',
    },
    {
      title: 'Avg Booking Value',
      value: formatCurrency(stats.averageBookingValue),
      tooltip: 'Average revenue per confirmed/completed booking',
      icon: TrendingUp,
      gradient: 'from-[#6366F1]/15 to-[#E0E7FF]/10',
      iconBg: 'bg-[#6366F1]/20',
      iconColor: 'text-[#6366F1]',
      badgeText: `${stats.activeGuests} guests`,
      badgeClass: 'bg-[#6366F1]/15 text-[#4F46E5] border-[#6366F1]/30',
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {cards.map((card) => (
        <motion.div key={card.title} variants={cardVariants}>
          <Card className={`relative overflow-hidden border-[#E0C097]/25 bg-gradient-to-br ${card.gradient} backdrop-blur-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default group`}>
            {/* Subtle shimmer accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C29A5D]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardHeader className="flex flex-row items-start justify-between pb-2 pt-5 px-5">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  <card.icon className={`w-[18px] h-[18px] ${card.iconColor}`} />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px] bg-[#1A1A1A] text-white border-none">
                    {card.tooltip}
                  </TooltipContent>
                </Tooltip>
              </div>
              {card.badgeText && (
                <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${card.badgeClass}`}>
                  {card.badgeText}
                </Badge>
              )}
            </CardHeader>

            <CardContent className="px-5 pb-5 pt-0">
              <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-1.5">
                {card.title}
              </CardTitle>
              <p className="text-3xl font-bold tracking-tight text-[#1A1A1A] font-sans tabular-nums">
                {card.value}
              </p>

              {card.progress !== undefined && (
                <div className="mt-3">
                  <Progress
                    value={card.progress}
                    className="h-1.5 bg-[#E0C097]/20"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {card.progress}% of inquiries converted
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
