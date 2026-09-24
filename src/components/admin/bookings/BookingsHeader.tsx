// src/components/admin/bookings/BookingsHeader.tsx
import React from 'react';
import { RefreshCw, Download, Calendar, ListFilter, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

interface BookingsHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  pendingCount: number;
  totalCount?: number;
  onExportCSV?: () => void;
  viewMode?: 'list' | 'compact';
  onViewModeChange?: (mode: 'list' | 'compact') => void;
}

export function BookingsHeader({ 
  isLoading, 
  onRefresh, 
  pendingCount,
  totalCount,
  onExportCSV,
  viewMode = 'list',
  onViewModeChange
}: BookingsHeaderProps) {
  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-6 py-4 transition-all">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-[#B6F500] flex items-center justify-center shadow-md">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                Bookings Hub
              </h1>
              {pendingCount > 0 ? (
                <Badge variant="destructive" className="bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs px-2.5 py-0.5 animate-pulse">
                  <Sparkles className="w-3 h-3 mr-1 inline" />
                  {pendingCount} Pending Action
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium text-xs">
                  All Up To Date
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage, review, and handle all event venue reservations & client schedules
            </p>
          </div>
        </div>

        {/* Actions & View Controls */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/70 mr-1">
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === 'list' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                Detailed
              </button>
              <button
                onClick={() => onViewModeChange('compact')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === 'compact' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Compact
              </button>
            </div>
          )}

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-9 px-3 rounded-xl border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          {/* Export CSV Button */}
          {onExportCSV && (
            <Button
              size="sm"
              onClick={onExportCSV}
              className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs gap-2 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
