const fs = require('fs');
const path = require('path');

const bookingsFile = 'c:/Users/Sabreena/Downloads/New folder (2)/dream-avenue/src/pages/admin/Bookings.tsx';
const content = fs.readFileSync(bookingsFile, 'utf8');

// The main AdminBookings function
const adminBookingsRegex = /export function AdminBookings\(\) {[\s\S]*?(?=\n\/\/ Booking Card Component)/;
const adminBookingsMatch = content.match(adminBookingsRegex);

if (!adminBookingsMatch) {
  console.error("Could not find AdminBookings component");
  process.exit(1);
}

const newImports = `import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  Calendar, CheckCircle, CalendarDays,
  Clock, Package, Search, Download, RefreshCw
} from 'lucide-react';
import AdminLayout from '../../components/admin-v2/AdminLayout';
import { useBookings, useCancelBooking, useUpdateBookingStatus, useDeleteBooking } from '../../src/hooks/useBookings';
import { Booking, BookingStatus } from '../../src/schemas/bookings';
import { toast } from 'sonner';

import { MetricCard } from '../../components/admin/bookings/MetricCard';
import { BookingCard } from '../../components/admin/bookings/BookingCard';
import { BookingDetailsModal } from '../../components/admin/bookings/BookingDetailsModal';
import { ConfirmationModal } from '../../components/admin-v2/ConfirmationModal';

`;

const finalFileContent = newImports + adminBookingsMatch[0] + '\n\nexport default AdminBookings;\n';

fs.writeFileSync(bookingsFile, finalFileContent);
console.log('Successfully refactored Bookings.tsx');

// Also delete extract_modal.js
if (fs.existsSync('c:/Users/Sabreena/Downloads/New folder (2)/dream-avenue/extract_modal.js')) {
  fs.unlinkSync('c:/Users/Sabreena/Downloads/New folder (2)/dream-avenue/extract_modal.js');
}
