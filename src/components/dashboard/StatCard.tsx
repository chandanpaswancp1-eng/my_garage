import React from 'react';
import './StatCard.css';

export default function StatCard({ 
  icon: Icon, 
  title, 
  amount, 
  badgeLabel, 
  badgeColor,
  amountColor = 'var(--text-main)'
}) {
  return (
    <div className="card stat-card flex-col justify-between">
      <div className="stat-card-header flex items-center justify-between">
        <div className={`icon-container bg-${badgeColor}-light`}>
          <Icon className={`text-${badgeColor}`} size={20} />
        </div>
        <div className={`badge badge-${badgeColor}`}>
          {badgeLabel}
        </div>
      </div>
      <div className="stat-card-body flex-col gap-1">
        <span className="text-sm font-medium text-muted">{title}</span>
        <span className="text-2xl font-bold" style={{ color: amountColor }}>{amount}</span>
      </div>
    </div>
  );
}
