// src/components/admin/analytics/AnalyticsDashboard.tsx
// Main composing component for the Analytics suite
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsKPICards } from './AnalyticsKPICards';
import { AnalyticsCharts } from './AnalyticsCharts';
import { AnalyticsShowcaseEditor } from './AnalyticsShowcaseEditor';
import { useAnalyticsData } from './useAnalyticsData';
import { exportAnalyticsCSV } from './exportUtils';
import { DateRangeFilter, DateRangePreset } from './types';
import { toast } from 'sonner';

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

export const AnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bi' | 'showcase'>('bi');
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>({
    preset: 'all',
  });

  const {
    stats,
    chartData,
    categoryBreakdown,
    dayOfWeekDistribution,
    isLoading,
    handleRefresh,
  } = useAnalyticsData(dateFilter);

  const handleDateFilterChange = (preset: DateRangePreset) => {
    setDateFilter({ preset });
  };

  const handleExport = () => {
    try {
      exportAnalyticsCSV(stats, chartData, categoryBreakdown);
      toast.success('Analytics report exported as CSV');
    } catch {
      toast.error('Failed to export analytics');
    }
  };

  return (
    <div className="space-y-0">
      <AnalyticsHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        dateFilter={dateFilter}
        onDateFilterChange={handleDateFilterChange}
        onExport={handleExport}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <AnimatePresence mode="wait">
        {activeTab === 'bi' ? (
          <motion.div key="bi" {...pageTransition}>
            <AnalyticsKPICards stats={stats} isLoading={isLoading} />
            <AnalyticsCharts
              chartData={chartData}
              categoryBreakdown={categoryBreakdown}
              dayOfWeekDistribution={dayOfWeekDistribution}
              totalRevenue={stats.grossRevenue}
              totalBookings={stats.totalBookings}
            />
          </motion.div>
        ) : (
          <motion.div key="showcase" {...pageTransition}>
            <AnalyticsShowcaseEditor />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
