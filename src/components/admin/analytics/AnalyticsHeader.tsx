// src/components/admin/analytics/AnalyticsHeader.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Calendar, Sparkles, SlidersHorizontal, BarChart3 } from 'lucide-react';
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
    <div className="flex flex-col gap-6 mb-8">
      {/* Top Banner with Luxury Glass Accent */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-[#E0C097]/30 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#C29A5D]/20 via-[#B6F500]/20 to-[#FFFADC] flex items-center justify-center border border-[#C29A5D]/30 shadow-inner">
            <Sparkles className="w-6 h-6 text-[#C29A5D]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A] font-serif">
                Analytics & Insights
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#B6F500]/30 text-[#476000] border border-[#B6F500]/60">
                <span className="w-1.5 h-1.5 rounded-full bg-[#75A000] animate-pulse mr-1.5" />
                Live
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comprehensive real-time business performance & website showcase statistics
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {activeTab === 'bi' && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground hidden sm:block" />
              <Select
                value={dateFilter.preset}
                onValueChange={(val) => onDateFilterChange(val as DateRangePreset)}
              >
                <SelectTrigger className="w-[140px] h-9 bg-white/80 border-[#E0C097]/40 text-xs font-medium shadow-none hover:border-[#C29A5D] transition-colors">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border-[#E0C097]/40">
                  <SelectItem value="today" className="text-xs">Today</SelectItem>
                  <SelectItem value="7d" className="text-xs">Last 7 Days</SelectItem>
                  <SelectItem value="30d" className="text-xs">Last 30 Days</SelectItem>
                  <SelectItem value="90d" className="text-xs">Last Quarter</SelectItem>
                  <SelectItem value="year" className="text-xs">This Year</SelectItem>
                  <SelectItem value="all" className="text-xs">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {activeTab === 'bi' && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="h-9 gap-1.5 text-xs font-medium bg-white/80 border-[#E0C097]/40 text-[#1A1A1A] hover:bg-[#FFFADC]/60 hover:text-[#C29A5D] shadow-none"
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
            className="h-9 w-9 p-0 text-muted-foreground hover:text-[#1A1A1A] hover:bg-white/60"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#C29A5D]' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Tabs Bar using shadcn Tabs */}
      <div className="flex items-center justify-between border-b border-[#E0C097]/20 pb-2">
        <Tabs value={activeTab} onValueChange={(val) => onTabChange(val as 'bi' | 'showcase')} className="w-full">
          <TabsList className="bg-white/60 backdrop-blur-md p-1 border border-[#E0C097]/30 rounded-xl h-11">
            <TabsTrigger
              value="bi"
              className="gap-2 text-xs font-semibold px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-sm transition-all"
            >
              <BarChart3 className="w-4 h-4 text-[#C29A5D]" />
              Executive BI Performance
            </TabsTrigger>
            <TabsTrigger
              value="showcase"
              className="gap-2 text-xs font-semibold px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-sm transition-all"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#B6F500]" />
              Public Showcase Editor
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
