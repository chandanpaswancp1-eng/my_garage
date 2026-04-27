import React, { useState } from 'react';
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

import { AdminDashboard } from './pages/AdminDashboard';
import { CustomerManager } from './pages/Customers';
import { ServiceAndBillingManager } from './pages/ServiceBilling';
import { InventoryManager } from './pages/Inventory';
import { StaffManager } from './pages/StaffPayroll';
import { ScheduleManager } from './pages/ScheduleHolidays';
import { ExpenseManager } from './pages/Expenses';
import { BankAndTransactions } from './pages/BankTransactions';

export const AdminApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers & Vehicles', icon: Car },
    { id: 'service_billing', label: 'Service & Billing', icon: Calendar },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'staff', label: 'Staff & Payroll', icon: Briefcase },
    { id: 'schedule', label: 'Schedule & Holidays', icon: CalendarDays },
    { id: 'expenses', label: 'Expenses & P&L', icon: Calculator },
    { id: 'bank', label: 'Bank & Transactions', icon: Landmark },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'customers': return <CustomerManager />;
      case 'service_billing': return <ServiceAndBillingManager />;
      case 'inventory': return <InventoryManager />;
      case 'staff': return <StaffManager />;
      case 'schedule': return <ScheduleManager />;
      case 'expenses': return <ExpenseManager />;
      case 'bank': return <BankAndTransactions />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <Layout sidebarItems={sidebarItems} activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};
