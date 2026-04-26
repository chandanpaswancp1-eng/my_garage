import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  ClipboardList, 
  Package, 
  Users, 
  Calendar, 
  Receipt, 
  Landmark,
  Wrench,
  ChevronDown
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Customers & Vehicles', path: '/customers', icon: Car },
  { name: 'Service & Billing', path: '/service', icon: ClipboardList },
  { name: 'Inventory', path: '/inventory', icon: Package },
  { name: 'Staff & Payroll', path: '/staff', icon: Users },
  { name: 'Schedule & Holidays', path: '/schedule', icon: Calendar },
  { name: 'Expenses & P&L', path: '/expenses', icon: Receipt },
  { name: 'Bank & Transactions', path: '/bank', icon: Landmark },
];

export default function Sidebar() {
  return (
    <div className="sidebar flex-col">
      <div className="sidebar-logo flex items-center gap-3">
        <div className="logo-icon-bg">
          <Wrench size={20} className="logo-icon" />
        </div>
        <span className="font-bold text-xl text-white">SEWA AUTO</span>
      </div>

      <div className="sidebar-menu flex-col">
        <span className="menu-label text-xs font-semibold text-muted">MENU</span>
        <nav className="nav-list flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `nav-item flex items-center gap-3 ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile flex items-center gap-3">
          <div className="avatar">A</div>
          <div className="user-info flex-col">
            <span className="text-sm font-semibold text-white">Admin Owner</span>
            <span className="text-xs text-muted">Admin Account</span>
          </div>
        </div>
        <div className="switch-account flex items-center justify-between">
          <span className="text-sm">Switch to Admin</span>
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
}
