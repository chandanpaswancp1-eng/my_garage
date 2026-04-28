import React from 'react';
import { Layout } from '../../components/LayoutShell';
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  Package, 
  Briefcase, 
  CalendarDays, 
  Calculator, 
  Landmark 
} from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AdminDashboard } from './pages/AdminDashboard';
import { CustomerManager } from './pages/Customers';
import { ServiceAndBillingManager } from './pages/ServiceBilling';
import { InventoryManager } from './pages/Inventory';
import { StaffManager } from './pages/StaffPayroll';
import { ScheduleManager } from './pages/ScheduleHolidays';
import { ExpenseManager } from './pages/Expenses';
import { BankAndTransactions } from './pages/BankTransactions';

export const AdminApp = () => {
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { id: 'customers', label: 'Customers & Vehicles', icon: Car, path: '/customers' },
    { id: 'service_billing', label: 'Service & Billing', icon: Calendar, path: '/service-billing' },
    { id: 'inventory', label: 'Inventory', icon: Package, path: '/inventory' },
    { id: 'staff', label: 'Staff & Payroll', icon: Briefcase, path: '/staff' },
    { id: 'schedule', label: 'Schedule & Holidays', icon: CalendarDays, path: '/schedule' },
    { id: 'expenses', label: 'Expenses & P&L', icon: Calculator, path: '/expenses' },
    { id: 'bank', label: 'Bank & Transactions', icon: Landmark, path: '/bank' },
  ];

  return (
    <Layout sidebarItems={sidebarItems} basePath="/">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/customers" element={<CustomerManager />} />
        <Route path="/service-billing" element={<ServiceAndBillingManager />} />
        <Route path="/inventory" element={<InventoryManager />} />
        <Route path="/staff" element={<StaffManager />} />
        <Route path="/schedule" element={<ScheduleManager />} />
        <Route path="/expenses" element={<ExpenseManager />} />
        <Route path="/bank" element={<BankAndTransactions />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};
