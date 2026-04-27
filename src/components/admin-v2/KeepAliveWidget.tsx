import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../utils/supabase/client';

export function KeepAliveWidget() {
  const [lastPing, setLastPing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [clicks, setClicks] = useState(0);

  const fetchLastPing = async () => {
    try {
      const { data, error } = await supabase
        .from('system_health')
        .select('created_at, ping_source')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        setLastPing(`${new Date(data[0].created_at).toLocaleString()} (${data[0].ping_source})`);
      } else {
        setLastPing('No pings yet');
      }
    } catch (error) {
      console.error('Error fetching last ping:', error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchLastPing();
    }
  }, [isVisible]);

  const handleManualPing = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('system_health')
        .insert([{ ping_source: 'manual_admin' }]);

      if (error) throw error;
      toast.success('Database ping successful!');
      fetchLastPing();
    } catch (error) {
      console.error('Error pinging database:', error);
      toast.error('Failed to ping database');
    } finally {
      setIsLoading(false);
    }
  };

  // Secret click handler to show the widget
  const handleSecretClick = () => {
    setClicks(prev => prev + 1);
    if (clicks >= 4) {
      setIsVisible(true);
      setClicks(0);
    }
  };

  if (!isVisible) {
    return (
      <div 
        className="w-4 h-4 rounded-full opacity-5 hover:opacity-20 cursor-crosshair fixed bottom-2 right-2 z-50"
        onClick={handleSecretClick}
        title="Developer Only"
      />
    );
  }

  return (
    <div className="fixed bottom-12 right-2 p-3 bg-black/90 backdrop-blur-md rounded-lg border border-white/10 text-xs shadow-xl z-50 min-w-[200px]">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-semibold flex items-center gap-1">
          <Activity size={12} className="text-[#B6F500]" /> System Health
        </span>
        <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-white">✕</button>
      </div>
      <div className="text-gray-300 mb-3 space-y-1">
        <p>Last Ping:</p>
        <p className="font-mono text-[10px] text-[#A4DD00]">{lastPing || 'Loading...'}</p>
      </div>
      <button 
        onClick={handleManualPing}
        disabled={isLoading}
        className="w-full py-1.5 bg-[#B6F500]/20 text-[#B6F500] hover:bg-[#B6F500]/30 rounded transition-colors"
      >
        {isLoading ? 'Pinging...' : 'Ping Database Now'}
      </button>
    </div>
  );
}
