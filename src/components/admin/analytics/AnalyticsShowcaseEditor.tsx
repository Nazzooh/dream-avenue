// src/components/admin/analytics/AnalyticsShowcaseEditor.tsx
// Redesigned public website showcase stats editor using shadcn components
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Users, Heart, Save, RotateCcw, Sparkles,
  History, Clock, Trash2, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Slider } from '../../ui/slider';
import { Separator } from '../../ui/separator';
import {
  Tooltip, TooltipTrigger, TooltipContent
} from '../../ui/tooltip';
import {
  useLatestAnalytics,
  useAnalyticsHistory,
  useInsertAnalyticsSnapshot
} from '../../../src/hooks/useAnalyticsAppendOnly';
import { supabase } from '../../../utils/supabase/client';
import { toast } from 'sonner';

const METRIC_CONFIG = [
  {
    key: 'events_hosted' as const,
    label: 'Events Hosted',
    icon: Calendar,
    color: '#C29A5D',
    bgColor: 'bg-[#C29A5D]/10',
    borderColor: 'border-[#C29A5D]/30',
    unit: '+',
    max: 5000,
  },
  {
    key: 'guests_served' as const,
    label: 'Guests Served',
    icon: Users,
    color: '#75A000',
    bgColor: 'bg-[#B6F500]/10',
    borderColor: 'border-[#B6F500]/30',
    unit: '+',
    max: 50000,
  },
  {
    key: 'client_satisfaction' as const,
    label: 'Client Satisfaction',
    icon: Heart,
    color: '#EC4899',
    bgColor: 'bg-[#EC4899]/10',
    borderColor: 'border-[#EC4899]/30',
    unit: '%',
    max: 100,
    isSlider: true,
  },
];

export const AnalyticsShowcaseEditor: React.FC = () => {
  const { data: latestAnalytics, isLoading } = useLatestAnalytics();
  const { data: history = [] } = useAnalyticsHistory(5);
  const insertMutation = useInsertAnalyticsSnapshot();

  const [formData, setFormData] = useState({
    events_hosted: 0,
    guests_served: 0,
    client_satisfaction: 100,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);

  useEffect(() => {
    if (latestAnalytics) {
      setFormData({
        events_hosted: latestAnalytics.events_hosted,
        guests_served: latestAnalytics.guests_served,
        client_satisfaction: latestAnalytics.client_satisfaction,
      });
    }
  }, [latestAnalytics]);

  useEffect(() => {
    if (!latestAnalytics) { setHasChanges(true); return; }
    setHasChanges(
      formData.events_hosted !== latestAnalytics.events_hosted ||
      formData.guests_served !== latestAnalytics.guests_served ||
      formData.client_satisfaction !== latestAnalytics.client_satisfaction
    );
  }, [formData, latestAnalytics]);

  const handleSave = async () => {
    try {
      await insertMutation.mutateAsync({ updates: formData, updatedBy: 'dream-avenue' });
      toast.success('Analytics snapshot saved — website updated');
      setHasChanges(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    }
  };

  const handleReset = () => {
    if (latestAnalytics) {
      setFormData({
        events_hosted: latestAnalytics.events_hosted,
        guests_served: latestAnalytics.guests_served,
        client_satisfaction: latestAnalytics.client_satisfaction,
      });
      setHasChanges(false);
      toast.info('Changes discarded');
    }
  };

  const handleCleanup = async () => {
    setCleanupLoading(true);
    try {
      const { error } = await supabase.rpc('safe_cleanup_analytics');
      if (error) {
        toast.error(`Cleanup failed: ${error.message}`);
      } else {
        toast.success('Old analytics records cleaned up');
      }
    } catch (err: any) {
      toast.error(err.message || 'Cleanup failed');
    }
    setCleanupLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-3 border-[#C29A5D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* ── Metric Editor Cards ── */}
      <div className="xl:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1A1A1A]">
              Public Website Statistics
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              These numbers are displayed on the main website's statistics showcase
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={!hasChanges}
              className="h-8 text-xs text-muted-foreground hover:text-[#1A1A1A]"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Discard
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges || insertMutation.isPending}
              className="h-8 text-xs bg-[#1A1A1A] text-white hover:bg-[#333] gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {insertMutation.isPending ? 'Saving...' : 'Save Snapshot'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {METRIC_CONFIG.map((metric) => {
            const Icon = metric.icon;
            const value = formData[metric.key];
            return (
              <motion.div
                key={metric.key}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`border ${metric.borderColor} bg-white/80 backdrop-blur-md hover:shadow-md transition-all`}>
                  <CardContent className="p-5">
                    <div className={`w-10 h-10 rounded-xl ${metric.bgColor} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5" style={{ color: metric.color }} />
                    </div>

                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
                      {metric.label}
                    </p>

                    {metric.isSlider ? (
                      <div className="space-y-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-3xl font-bold text-[#1A1A1A] tabular-nums">
                            {value}
                          </span>
                          <span className="text-lg text-muted-foreground/60">{metric.unit}</span>
                        </div>
                        <Slider
                          value={[value]}
                          onValueChange={([val]) => setFormData(p => ({ ...p, [metric.key]: val }))}
                          min={0}
                          max={metric.max}
                          step={1}
                          className="w-full"
                        />
                        <Progress value={value} className="h-1 bg-[#E0C097]/20" />
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => {
                            const num = parseInt(e.target.value) || 0;
                            if (num >= 0 && num <= metric.max) {
                              setFormData(p => ({ ...p, [metric.key]: num }));
                            }
                          }}
                          className="w-full text-3xl font-bold text-[#1A1A1A] bg-transparent border-none outline-none p-0 tabular-nums"
                          min={0}
                          max={metric.max}
                        />
                        {metric.unit && (
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xl text-muted-foreground/40">
                            {metric.unit}
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Change indicator */}
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FFE59D]/30 border border-[#FFE59D]/60 text-xs">
                <AlertTriangle className="w-4 h-4 text-[#8B6914]" />
                <span className="text-[#8B6914] font-medium">
                  Unsaved changes — a new snapshot will be created when you save
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── History & Cleanup Panel ── */}
      <div className="space-y-4">
        <Card className="border-[#E0C097]/25 bg-white/70 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#C29A5D]" />
              <CardTitle className="text-sm font-bold text-[#1A1A1A]">
                Snapshot History
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Recent changes to public statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {history.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No history available</p>
            ) : (
              <div className="space-y-3">
                {history.map((entry: any, idx: number) => (
                  <div key={entry.id || idx} className="flex items-start gap-3 group">
                    <div className="relative flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1 ${idx === 0 ? 'bg-[#C29A5D]' : 'bg-[#E0C097]/50'}`} />
                      {idx < history.length - 1 && (
                        <div className="w-px flex-1 bg-[#E0C097]/30 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pb-3">
                      <div className="flex items-center gap-2 mb-1">
                        {idx === 0 && (
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-[#B6F500]/40 text-[#476000] bg-[#B6F500]/10">
                            Current
                          </Badge>
                        )}
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {entry.updated_at
                            ? new Date(entry.updated_at).toLocaleString('en-US', {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })
                            : 'Unknown date'
                          }
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        <div className="text-[10px]">
                          <span className="text-muted-foreground">Events:</span>{' '}
                          <span className="font-semibold text-[#1A1A1A]">{entry.events_hosted}</span>
                        </div>
                        <div className="text-[10px]">
                          <span className="text-muted-foreground">Guests:</span>{' '}
                          <span className="font-semibold text-[#1A1A1A]">{entry.guests_served}</span>
                        </div>
                        <div className="text-[10px]">
                          <span className="text-muted-foreground">Sat:</span>{' '}
                          <span className="font-semibold text-[#1A1A1A]">{entry.client_satisfaction}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cleanup Action */}
        <Card className="border-[#E0C097]/25 bg-white/70 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1A1A1A] mb-0.5">Database Cleanup</p>
                <p className="text-[10px] text-muted-foreground mb-3">
                  Remove old snapshots, keeping only the latest record
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCleanup}
                  disabled={cleanupLoading}
                  className="h-7 text-[10px] border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  {cleanupLoading ? 'Running...' : 'Run Cleanup'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
