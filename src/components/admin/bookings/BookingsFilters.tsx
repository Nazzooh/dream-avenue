import { Search } from 'lucide-react';
import { BookingStatus } from '../../../src/schemas/bookings';

interface BookingsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: BookingStatus | 'all';
  onStatusFilterChange: (status: BookingStatus | 'all') => void;
}

export function BookingsFilters({ 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange 
}: BookingsFiltersProps) {
  const filters: { value: BookingStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Bookings' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div 
      className="p-[clamp(1rem,2.5vw,1.5rem)] rounded-3xl mb-[clamp(1.5rem,3vw,2rem)]"
      style={{ 
        background: 'white',
        boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
        border: '1px solid rgba(0,0,0,0.05)'
      }}
    >
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-50 focus:border-[#B6F500]/50 outline-none transition-all text-sm"
            style={{ background: '#F9F9F9' }}
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onStatusFilterChange(filter.value)}
              className="px-5 py-2.5 rounded-xl transition-all text-sm font-medium whitespace-nowrap"
              style={{
                background: statusFilter === filter.value ? '#000' : '#F5F5F5',
                color: statusFilter === filter.value ? '#FFF' : '#666',
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
