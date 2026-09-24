// pages/admin/AnalyticsSettings.tsx — Analytics & Insights Admin Page
import React from 'react';
import AdminLayout from '../../components/admin-v2/AdminLayout';
import { AnalyticsDashboard } from '../../components/admin/analytics/AnalyticsDashboard';

export function AnalyticsSettings() {
  return (
    <AdminLayout>
      <div className="p-6 md:p-8 lg:p-10 max-w-[1400px] mx-auto">
        <AnalyticsDashboard />
      </div>
    </AdminLayout>
  );
}
