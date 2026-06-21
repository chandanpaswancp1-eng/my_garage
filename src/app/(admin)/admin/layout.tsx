"use client";
import React from 'react';
import { Layout } from '../../../components/LayoutShell';
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
import { useApp } from '../../../context/AppContext';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  const router = useRouter();

  // Route Protection
  React.useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else if (currentUser.role !== 'admin') {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'admin') return null;

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'customers', label: 'Customers & Vehicles', icon: Car, path: '/admin/customers' },
    { id: 'service_billing', label: 'Service & Billing', icon: Calendar, path: '/admin/service-billing' },
    { id: 'inventory', label: 'Inventory', icon: Package, path: '/admin/inventory' },
    { id: 'staff', label: 'Staff & Payroll', icon: Briefcase, path: '/admin/staff' },
    { id: 'schedule', label: 'Schedule & Holidays', icon: CalendarDays, path: '/admin/schedule' },
    { id: 'expenses', label: 'Expenses & P&L', icon: Calculator, path: '/admin/expenses' },
    { id: 'bank', label: 'Bank & Transactions', icon: Landmark, path: '/admin/bank' },
  ];

  return (
    <Layout sidebarItems={sidebarItems} basePath="/admin">
      {children}
    </Layout>
  );
}
