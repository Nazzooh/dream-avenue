// src/components/admin/analytics/AnalyticsCharts.tsx
// Revenue & Booking trend charts + Category donut using Recharts + shadcn Card
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
  Tooltip as RechartsTooltip, Legend
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
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
}

/* Custom frosted tooltip for Area chart */
function CustomAreaTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-md border border-[#E0C097]/40 rounded-xl px-4 py-3 shadow-lg">
      <p className="text-xs font-semibold text-[#1A1A1A] mb-1.5">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold text-[#1A1A1A]">
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
    <div className="bg-white/95 backdrop-blur-md border border-[#E0C097]/40 rounded-xl px-4 py-3 shadow-lg">
      <p className="text-xs font-semibold text-[#1A1A1A]">{d.name}</p>
      <p className="text-xs text-muted-foreground">{d.value} bookings · {formatRevenue(d.payload.revenue)}</p>
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
      <Card className="xl:col-span-2 border-[#E0C097]/25 bg-white/70 backdrop-blur-xl overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-[#1A1A1A]">
                Performance Trend
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {chartMetric === 'revenue' ? 'Revenue flow' : 'Booking volume'} over time
              </CardDescription>
            </div>
            <Tabs value={chartMetric} onValueChange={(v) => setChartMetric(v as 'revenue' | 'bookings')}>
              <TabsList className="h-8 bg-[#FAFAF7] border border-[#E0C097]/20 p-0.5 rounded-lg">
                <TabsTrigger value="revenue" className="text-[10px] px-3 h-7 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold">
                  Revenue
                </TabsTrigger>
                <TabsTrigger value="bookings" className="text-[10px] px-3 h-7 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold">
                  Bookings
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-4 px-4">
          {noData ? (
            <div className="flex items-center justify-center h-[240px] text-sm text-muted-foreground">
              No booking data available for the selected period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C29A5D" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#C29A5D" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B6F500" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#B6F500" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0C097" strokeOpacity={0.2} vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#999', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#999', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => chartMetric === 'revenue' ? formatRevenue(v) : v}
                />
                <RechartsTooltip content={<CustomAreaTooltip />} />
                {chartMetric === 'revenue' ? (
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#C29A5D"
                    strokeWidth={2.5}
                    fill="url(#gradRevenue)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#C29A5D', stroke: '#fff', strokeWidth: 2 }}
                  />
                ) : (
                  <Area
                    type="monotone"
                    dataKey="bookingsCount"
                    name="Bookings"
                    stroke="#75A000"
                    strokeWidth={2.5}
                    fill="url(#gradBookings)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#75A000', stroke: '#fff', strokeWidth: 2 }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* ── Category Donut (1/3 width) ── */}
      <Card className="border-[#E0C097]/25 bg-white/70 backdrop-blur-xl overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-[#1A1A1A]">
            Package Distribution
          </CardTitle>
          <CardDescription className="text-xs">
            Revenue & volume split by category
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 pb-4">
          {categoryBreakdown.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
              No category data
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
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
                </ResponsiveContainer>
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
      <Card className="xl:col-span-3 border-[#E0C097]/25 bg-white/70 backdrop-blur-xl overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-[#1A1A1A]">
                Peak Booking Days
              </CardTitle>
              <CardDescription className="text-xs">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#E0C097" strokeOpacity={0.15} vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: '#999', fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#999', fontSize: 10 }}
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
