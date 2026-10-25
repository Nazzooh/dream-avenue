// pages/admin/AnalyticsSettings.tsx — Analytics & Insights Admin Page
import React from 'react';
import AdminLayout from '../../components/admin-v2/AdminLayout';
import { BusinessAnalyticsDashboard } from '../../components/admin/analytics/BusinessAnalyticsDashboard';

export function AnalyticsSettings() {
  return (
    <AdminLayout>
      <div className="da-analytics-page">
        <BusinessAnalyticsDashboard />
      </div>
    </AdminLayout>
  );
}
