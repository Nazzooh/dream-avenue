import { RefreshCw, Download } from 'lucide-react';

interface BookingsHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  pendingCount: number;
}

export function BookingsHeader({ isLoading, onRefresh, pendingCount }: BookingsHeaderProps) {
  return (
    <div 
      className="sticky top-0 z-30"
      style={{ 
        background: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        margin: '0 calc(clamp(1rem,5vw,3rem) * -1)',
        padding: 'clamp(1rem,2.5vw,1.5rem) clamp(1rem,5vw,3rem)'
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.5rem,3vw,1.875rem)] font-semibold" style={{ color: '#2A2A2A', fontFamily: 'Poppins, sans-serif' }}>
            Bookings Management
          </h1>
          <p className="text-[clamp(0.75rem,1.5vw,0.875rem)]" style={{ color: '#666' }}>
            {pendingCount > 0 ? `${pendingCount} bookings need your attention` : 'All bookings are up to date'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl transition-all hover:bg-black/5"
            style={{ border: '1px solid rgba(0,0,0,0.1)', color: '#666' }}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 transition-all shadow-lg shadow-black/10 text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
