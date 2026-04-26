import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'May', income: 10000, expenses: 80000 },
  { name: 'Jun', income: 0, expenses: 36000 },
  { name: 'Oct', income: 8000, expenses: 5000 },
];

export default function TrendChart() {
  return (
    <div className="card h-full flex-col">
      <div className="chart-header flex items-center justify-between" style={{ marginBottom: '24px' }}>
        <h3 className="text-lg font-semibold">Revenue & Expense Trend</h3>
        <div className="legend flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="dot" style={{ backgroundColor: 'var(--danger-red)', width: 10, height: 10, borderRadius: '50%' }}></span>
            <span className="text-xs font-medium text-danger">Expenses</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="dot" style={{ backgroundColor: 'var(--success-green)', width: 10, height: 10, borderRadius: '50%' }}></span>
            <span className="text-xs font-medium text-success">Income</span>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--success-green)" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="var(--success-green)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--danger-red)" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="var(--danger-red)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6EBED" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickFormatter={(value) => `Rs.${value/1000}k`} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              itemStyle={{ fontSize: '12px', fontWeight: 500 }}
              labelStyle={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}
            />
            <Area type="monotone" dataKey="expenses" stroke="var(--danger-red)" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
            <Area type="monotone" dataKey="income" stroke="var(--success-green)" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
