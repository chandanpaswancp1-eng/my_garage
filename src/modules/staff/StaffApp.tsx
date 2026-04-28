import React from 'react';
import { Layout } from '../../components/LayoutShell';
import { LayoutDashboard, Clock, FileText, HandCoins, History } from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Modular Components
import { StaffDashboard } from './components/StaffDashboard';
import { AttendancePanel } from './components/AttendancePanel';
import { LeaveRequests } from './components/LeaveRequests';
import { PayslipsPanel } from './components/PayslipsPanel';
import { PaymentHistoryPanel } from './components/PaymentHistoryPanel';

const staffSidebar = [
  { id: 'dashboard',  label: 'Tasks',           icon: LayoutDashboard, path: '/' },
  { id: 'attendance', label: 'Attendance',      icon: Clock,           path: '/attendance' },
  { id: 'requests',   label: 'Leave Requests',  icon: FileText,        path: '/leaves' },
  { id: 'payslips',   label: 'Request Advance', icon: HandCoins,       path: '/advance' },
  { id: 'history',    label: 'Payment History', icon: History,         path: '/payments' },
];

export const StaffApp: React.FC = () => {
  return (
    <Layout sidebarItems={staffSidebar} basePath="/">
      <Routes>
        <Route path="/" element={<StaffDashboard />} />
        <Route path="/attendance" element={<AttendancePanel />} />
        <Route path="/leaves" element={<LeaveRequests />} />
        <Route path="/advance" element={<PayslipsPanel />} />
        <Route path="/payments" element={<PaymentHistoryPanel />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};
