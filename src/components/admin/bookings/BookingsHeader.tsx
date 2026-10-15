// src/components/admin/bookings/BookingsHeader.tsx
import React from 'react';
import { RefreshCw, Download, Calendar, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

interface BookingsHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  pendingCount: number;
  totalCount?: number;
  onExportCSV?: () => void;
}

export function BookingsHeader({ 
  isLoading, 
  onRefresh, 
  pendingCount,
  totalCount,
  onExportCSV,
}: BookingsHeaderProps) {
  return (
    <div className="relative z-10 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Status */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-[#B6F500] shadow-sm">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                Bookings Hub
              </h1>
              {pendingCount > 0 ? (
                <Badge variant="destructive" className="bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs px-2.5 py-0.5 animate-pulse">
                  <Sparkles className="mr-1 inline h-3 w-3" aria-hidden="true" />
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
