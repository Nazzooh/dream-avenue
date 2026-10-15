// src/components/admin/analytics/AnalyticsCharts.tsx
// Revenue & Booking trend charts + Category donut using Recharts + shadcn Card
import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
  Tooltip as RechartsTooltip
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import { ChartDataPoint, CategoryBreakdown, DayOfWeekDistribution } from './types';

interface AnalyticsChartsProps {
  chartData: ChartDataPoint[];
  categoryBreakdown: CategoryBreakdown[];
  dayOfWeekDistribution: DayOfWeekDistribution[];
  totalRevenue: number;
  totalBookings: number;
}

function formatRevenue(value: number): string {
  if (value >= 100000) return `INR ${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `INR ${(value / 1000).toFixed(0)}K`;
  return `INR ${value.toLocaleString('en-IN')}`;
}

/* Keep the tooltip explicit because the x-axis uses numeric timestamps. */
function CustomAreaTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  const displayLabel = point?.label || label;
  return (
    <div className="border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-1.5 text-xs font-semibold text-slate-900">{displayLabel}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-600">{entry.name}:</span>
          <span className="font-semibold text-slate-900">
            {entry.name === 'Revenue' ? formatRevenue(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* Custom frosted tooltip for Pie chart */
function CustomPieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-xs font-semibold text-slate-900">{d.name}</p>
      <p className="text-xs text-slate-600">{d.value} bookings - {formatRevenue(d.payload.revenue)}</p>
    </div>
  );
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  chartData,
  categoryBreakdown,
  dayOfWeekDistribution,
  totalRevenue,
  totalBookings,
}) => {
  const [chartMetric, setChartMetric] = useState<'revenue' | 'bookings'>('revenue');

  const noData = chartData.length === 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">
      {/* ── Main Trend Chart (2/3 width) ── */}
      <Card className="xl:col-span-2 overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Performance Trend
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs text-slate-500">
                {chartMetric === 'revenue' ? 'Revenue flow' : 'Booking volume'} over time
              </CardDescription>
            </div>
            <Tabs value={chartMetric} onValueChange={(v) => setChartMetric(v as 'revenue' | 'bookings')}>
               <TabsList className="h-8 rounded-lg border border-slate-200 bg-slate-100 p-0.5">
                 <TabsTrigger value="revenue" className="h-7 rounded-md px-3 text-[10px] font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Revenue
                </TabsTrigger>
                 <TabsTrigger value="bookings" className="h-7 rounded-md px-3 text-[10px] font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Bookings
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-4 px-4">
          {noData ? (
            <div className="flex h-[240px] flex-col items-center justify-center px-6 text-center">
              <p className="text-sm font-semibold text-slate-700">No booking data for this period</p>
              <p className="mt-1 max-w-xs text-xs text-slate-500">Try a wider date range or check back after new bookings arrive.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData.filter((point) => point.timestamp !== null)} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#E2E8F0" strokeOpacity={0.8} vertical={false} />
                <XAxis
                  dataKey="timestamp"
                  type="number"
                  scale="time"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={chartMetric === 'revenue'}
                  domain={chartMetric === 'bookings' ? [0, 'dataMax'] : ['auto', 'auto']}
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => chartMetric === 'revenue' ? formatRevenue(v) : v}
                />
                <RechartsTooltip content={<CustomAreaTooltip />} />
                {chartMetric === 'revenue' ? (
                  <Line
                    type="linear"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#C29A5D"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#C29A5D', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 5, fill: '#C29A5D', stroke: '#fff', strokeWidth: 2 }}
                  />
                ) : (
                  <Line
                    type="linear"
                    dataKey="bookingsCount"
                    name="Bookings"
                    stroke="#75A000"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#75A000', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 5, fill: '#75A000', stroke: '#fff', strokeWidth: 2 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* ── Category Donut (1/3 width) ── */}
      <Card className="overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-slate-900">
            Package Distribution
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Revenue & volume split by category
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 pb-4">
          {categoryBreakdown.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center px-6 text-center">
              <p className="text-sm font-semibold text-slate-700">No package data yet</p>
              <p className="mt-1 text-xs text-slate-500">Package distribution will appear here once bookings are recorded.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <PieChart width={180} height={180}>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="count"
                      nameKey="name"
                      stroke="none"
                    >
                      {categoryBreakdown.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomPieTooltip />} />
                </PieChart>
              </div>

              {/* Legend */}
              <div className="space-y-2 mt-2 px-2">
                {categoryBreakdown.slice(0, 5).map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat.color }} />
                      <span className="text-[#1A1A1A] truncate font-medium">{cat.name}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-[#E0C097]/30 text-muted-foreground shrink-0 ml-2">
                      {cat.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Day-of-Week Distribution (full width) ── */}
      <Card className="xl:col-span-3 overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Peak Booking Days
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Demand distribution across the week
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] border-[#E0C097]/30 text-muted-foreground">
              {totalBookings} total
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-4 px-4">
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={dayOfWeekDistribution} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#E2E8F0" strokeOpacity={0.8} vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                domain={[0, 'dataMax']}
                tick={{ fill: '#475569', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <RechartsTooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-white/95 backdrop-blur-md border border-[#E0C097]/40 rounded-xl px-4 py-3 shadow-lg">
                      <p className="text-xs font-semibold text-[#1A1A1A]">{label}</p>
                      <p className="text-xs text-muted-foreground">{payload[0].value} bookings</p>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="bookings"
                fill="#C29A5D"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
