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
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: amount >= 1000 ? 1 : 0,
    notation: amount >= 1000 ? 'compact' : 'standard',
  }).format(amount);
}

export const AnalyticsKPICards: React.FC<AnalyticsKPICardsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-8 sm:grid-cols-2 xl:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-[168px] animate-pulse rounded-xl border border-slate-200 bg-white" />
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
      iconColor: 'text-[#C29A5D]',
      badgeText: stats.totalBookings > 0 ? `${stats.totalBookings} bookings` : 'No data',
      badgeClass: 'bg-[#E0C097]/20 text-[#7A6036] border-[#C29A5D]/30',
    },
    {
      title: 'Confirmed Bookings',
      value: stats.confirmedBookings.toString(),
      tooltip: 'Bookings currently confirmed and awaiting completion',
      icon: CalendarCheck,
      iconColor: 'text-[#75A000]',
      badgeText: `${stats.pendingBookings} pending`,
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      tooltip: 'Percentage of bookings that became confirmed or completed',
      icon: Percent,
      iconColor: 'text-emerald-700',
      progress: stats.conversionRate,
      progressColor: 'bg-[#10B981]',
    },
    {
      title: 'Avg Booking Value',
      value: formatCurrency(stats.averageBookingValue),
      tooltip: 'Average revenue per confirmed/completed booking',
      icon: TrendingUp,
      iconColor: 'text-[#C29A5D]',
      badgeText: `${stats.activeGuests} guests`,
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    },
    {
      title: 'Active Guests',
      value: stats.activeGuests.toLocaleString('en-IN'),
      tooltip: 'Guests associated with bookings in the selected period',
      icon: Users,
      iconColor: 'text-[#75A000]',
      badgeText: stats.totalBookings > 0 ? `${stats.totalBookings} bookings` : 'No data',
      badgeClass: 'bg-[#B6F500]/10 text-[#476000] border-[#B6F500]/30',
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 gap-3 mb-8 sm:grid-cols-2 xl:grid-cols-5"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {cards.map((card) => (
        <motion.div key={card.title} variants={cardVariants} className={card.title === 'Gross Revenue' ? 'col-span-2 xl:col-span-1' : undefined}>
          <Card className="group relative cursor-default overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">

            <CardHeader className="flex flex-row items-start justify-between pb-2 pt-5 px-5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                  <card.icon className={`w-[18px] h-[18px] ${card.iconColor}`} />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <button aria-label={`More information about ${card.title}`} className="text-slate-400 transition-colors hover:text-slate-700">
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px] bg-[#1A1A1A] text-white border-none">
                    {card.tooltip}
                  </TooltipContent>
                </Tooltip>
              </div>
              {card.badgeText && (
                <Badge variant="outline" className={`text-xs font-semibold px-2 py-0.5 rounded-full ${card.badgeClass}`}>
                  {card.badgeText}
                </Badge>
              )}
            </CardHeader>

            <CardContent className="px-5 pb-5 pt-0">
              <CardTitle className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-600">
                {card.title}
              </CardTitle>
               <p className="font-sans text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
                {card.value}
              </p>

              {card.progress !== undefined && (
                <div className="mt-3">
                  <Progress
                    value={card.progress}
                    className="h-1.5 bg-[#E0C097]/20"
                  />
                  <p className="mt-1 text-xs font-medium text-slate-600">
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
