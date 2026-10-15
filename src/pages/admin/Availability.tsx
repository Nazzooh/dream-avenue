import AdminLayout from '../../components/admin-v2/AdminLayout';
import { AdminAvailabilityCalendar } from '../../components/admin/AdminAvailabilityCalendar';

export function AdminAvailability() {
  return (
    <AdminLayout>
      <section className="workspace-page availability-workspace">
        <header className="workspace-page-header">
          <div>
            <p className="workspace-eyebrow">Venue operations</p>
            <h1>Calendar & Availability</h1>
            <p>Review venue capacity, block dates, and manage the availability behind every booking.</p>
          </div>
        </header>
        <div className="availability-calendar-shell">
          <AdminAvailabilityCalendar />
        </div>
      </section>
    </AdminLayout>
  );
}
