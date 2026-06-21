"use client";
import React from 'react';
import { Layout } from '../../../components/LayoutShell';
import { LayoutDashboard, Clock, FileText, HandCoins, History } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useRouter } from 'next/navigation';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  const router = useRouter();

  React.useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else if (currentUser.role !== 'staff') {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'staff') return null;

  const staffSidebar = [
    { id: 'dashboard',  label: 'Tasks',           icon: LayoutDashboard, path: '/staff' },
    { id: 'attendance', label: 'Attendance',      icon: Clock,           path: '/staff/attendance' },
    { id: 'requests',   label: 'Leave Requests',  icon: FileText,        path: '/staff/leaves' },
    { id: 'payslips',   label: 'Request Advance', icon: HandCoins,       path: '/staff/advance' },
    { id: 'history',    label: 'Payment History', icon: History,         path: '/staff/payments' },
  ];

  return (
    <Layout sidebarItems={staffSidebar} basePath="/staff">
      {children}
    </Layout>
  );
}
