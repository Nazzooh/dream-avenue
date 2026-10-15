// src/components/admin/analytics/AnalyticsHeader.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Calendar, SlidersHorizontal, BarChart3 } from 'lucide-react';
import { Button } from '../../ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../ui/select';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { DateRangeFilter, DateRangePreset } from './types';

interface AnalyticsHeaderProps {
  activeTab: 'bi' | 'showcase';
  onTabChange: (tab: 'bi' | 'showcase') => void;
  dateFilter: DateRangeFilter;
  onDateFilterChange: (preset: DateRangePreset) => void;
  onExport: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  activeTab,
  onTabChange,
  dateFilter,
  onDateFilterChange,
  onExport,
  onRefresh,
  isLoading,
}) => {
  return (
    <div className="mb-8 flex flex-col gap-5">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-[#B6F500] shadow-sm">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Analytics & Insights
              </h1>
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-sm font-medium text-emerald-700">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
            </div>
            <p className="mt-0.5 text-sm text-slate-500">
              Track demand, revenue, and booking performance at a glance.
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {activeTab === 'bi' && (
            <div className="flex items-center gap-2">
              <Calendar className="hidden h-4 w-4 text-slate-400 sm:block" aria-hidden="true" />
              <Select
                value={dateFilter.preset}
                onValueChange={(val) => onDateFilterChange(val as DateRangePreset)}
              >
               <SelectTrigger className="h-10 w-[150px] border-slate-200 bg-white text-sm font-medium shadow-none hover:border-slate-400">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                 <SelectContent className="border-slate-200 bg-white">
                  <SelectItem value="today" className="text-sm">Today</SelectItem>
                  <SelectItem value="7d" className="text-sm">Last 7 Days</SelectItem>
                  <SelectItem value="30d" className="text-sm">Last 30 Days</SelectItem>
                  <SelectItem value="90d" className="text-sm">Last Quarter</SelectItem>
                  <SelectItem value="year" className="text-sm">This Year</SelectItem>
                  <SelectItem value="all" className="text-sm">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {activeTab === 'bi' && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="h-10 gap-1.5 border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-none hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
             className="h-9 w-9 p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Refresh analytics data"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-[#C29A5D]' : ''}`} aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Tabs Bar using shadcn Tabs */}
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={(val) => onTabChange(val as 'bi' | 'showcase')} className="w-full">
           <TabsList className="h-10 rounded-lg border border-slate-200 bg-slate-100 p-1">
            <TabsTrigger
              value="bi"
               className="gap-2 rounded-md px-4 py-2 text-sm font-semibold text-slate-500 transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
               <BarChart3 className="h-4 w-4" />
              Executive BI Performance
            </TabsTrigger>
            <TabsTrigger
              value="showcase"
               className="gap-2 rounded-md px-4 py-2 text-sm font-semibold text-slate-500 transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
               <SlidersHorizontal className="h-4 w-4" />
              Public Showcase Editor
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
