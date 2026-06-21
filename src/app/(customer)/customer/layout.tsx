"use client";
import React from 'react';
import { Layout } from '../../../components/LayoutShell';
import { LayoutDashboard, CalendarPlus, History, Banknote, Landmark } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useRouter } from 'next/navigation';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  const router = useRouter();

  React.useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else if (currentUser.role !== 'customer') {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'customer') return null;

  const customerSidebar = [
    { id: 'dashboard', label: 'Dashboard',       icon: LayoutDashboard, path: '/customer' },
    { id: 'book',      label: 'Book Service',    icon: CalendarPlus,    path: '/customer/book' },
    { id: 'history',   label: 'Service History', icon: History,         path: '/customer/history' },
    { id: 'payments',  label: 'Payment History', icon: Banknote,        path: '/customer/payments' },
    { id: 'bank',      label: 'Payment Settings', icon: Landmark,        path: '/customer/settings' },
  ];

  return (
    <Layout sidebarItems={customerSidebar} basePath="/customer">
      {children}
    </Layout>
  );
}
