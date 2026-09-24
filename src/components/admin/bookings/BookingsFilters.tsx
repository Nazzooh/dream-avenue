// src/components/admin/bookings/BookingsFilters.tsx
import React from 'react';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';
import { BookingStatus } from '../../../src/schemas/bookings';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';

interface BookingsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: BookingStatus | 'all';
  onStatusFilterChange: (status: BookingStatus | 'all') => void;
  counts?: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}

export function BookingsFilters({ 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  counts
}: BookingsFiltersProps) {
  const filters: { value: BookingStatus | 'all'; label: string; countKey?: keyof NonNullable<typeof counts> }[] = [
    { value: 'all', label: 'All Bookings', countKey: 'total' },
    { value: 'pending', label: 'Pending', countKey: 'pending' },
    { value: 'confirmed', label: 'Confirmed', countKey: 'confirmed' },
    { value: 'completed', label: 'Completed', countKey: 'completed' },
    { value: 'cancelled', label: 'Cancelled', countKey: 'cancelled' }
  ];

  const hasActiveFilters = searchQuery.trim().length > 0 || statusFilter !== 'all';

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] mb-6 transition-all">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search input with icon & clear button */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by client name, mobile, email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-9 h-10 rounded-xl bg-slate-50/80 border-slate-200 focus:bg-white text-xs text-slate-900 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-900"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/60"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {filters.map((filter) => {
            const isActive = statusFilter === filter.value;
            const count = counts && filter.countKey ? counts[filter.countKey] : null;

            return (
              <button
                key={filter.value}
                onClick={() => onStatusFilterChange(filter.value)}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <span>{filter.label}</span>
                {count !== null && count !== undefined && (
                  <span 
                    className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full transition-colors ${
                      isActive 
                        ? 'bg-slate-700 text-[#B6F500]' 
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSearchChange('');
                onStatusFilterChange('all');
              }}
              className="h-8 px-2.5 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
