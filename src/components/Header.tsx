import React from 'react';
import { Bell } from 'lucide-react';
import './Header.css';

export default function Header() {
  return (
    <header className="header flex items-center justify-between">
      <h1 className="text-xl font-bold">Dashboard</h1>
      
      <div className="header-actions flex items-center">
        <div className="notification-icon">
          <Bell size={24} className="text-muted" />
          <span className="notification-badge">3</span>
        </div>
      </div>
    </header>
  );
}
