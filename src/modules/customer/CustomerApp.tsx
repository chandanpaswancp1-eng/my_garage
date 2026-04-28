import React from 'react';
import { Layout } from '../../components/LayoutShell';
import { LayoutDashboard, CalendarPlus, History, Banknote, Landmark } from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Modular Components
import { CustomerDashboard } from './components/CustomerDashboard';
import { ServiceBookingForm } from './components/ServiceBookingForm';
import { ServiceHistory } from './components/ServiceHistory';
import { PaymentHistoryPanel } from './components/PaymentHistoryPanel';
import { PaymentSettings } from './components/PaymentSettings';

const customerSidebar = [
  { id: 'dashboard', label: 'Dashboard',       icon: LayoutDashboard, path: '/' },
  { id: 'book',      label: 'Book Service',    icon: CalendarPlus,    path: '/book' },
  { id: 'history',   label: 'Service History', icon: History,         path: '/history' },
  { id: 'payments',  label: 'Payment History', icon: Banknote,        path: '/payments' },
  { id: 'bank',      label: 'Payment Settings', icon: Landmark,        path: '/settings' },
];

export const CustomerApp: React.FC = () => {
  return (
    <Layout sidebarItems={customerSidebar} basePath="/">
      <Routes>
        <Route path="/" element={<CustomerDashboard />} />
        <Route path="/book" element={<ServiceBookingForm />} />
        <Route path="/history" element={<ServiceHistory />} />
        <Route path="/payments" element={<PaymentHistoryPanel />} />
        <Route path="/settings" element={<PaymentSettings />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};

// ==================== End of CustomerApp ====================
