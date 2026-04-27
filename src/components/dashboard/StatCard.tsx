import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  amount: string;
  badgeLabel: string;
  badgeColor: 'blue' | 'red' | 'green' | 'yellow';
  amountColor?: string;
}

const colorStyles = {
  blue: { bg: 'bg-blue-50', text: 'text-sewa-blue', badgeBg: 'bg-blue-100' },
  red: { bg: 'bg-red-50', text: 'text-red-600', badgeBg: 'bg-red-100' },
  green: { bg: 'bg-green-50', text: 'text-green-600', badgeBg: 'bg-green-100' },
  yellow: { bg: 'bg-orange-50', text: 'text-orange-600', badgeBg: 'bg-orange-100' }
};

export default function StatCard({ 
  icon: Icon, 
  title, 
  amount, 
  badgeLabel, 
  badgeColor,
  amountColor = '#111827'
}: StatCardProps) {
  
  const styles = colorStyles[badgeColor];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-[150px]">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles.bg}`}>
          <Icon className={styles.text} size={24} />
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${styles.badgeBg} ${styles.text}`}>
          {badgeLabel}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-gray-500">{title}</span>
        <span className="text-2xl font-black" style={{ color: amountColor }}>{amount}</span>
      </div>
    </div>
  );
}
