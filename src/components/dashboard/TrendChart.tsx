import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', income: 45000, expenses: 32000 },
  { name: 'Feb', income: 52000, expenses: 34000 },
  { name: 'Mar', income: 48000, expenses: 29000 },
  { name: 'Apr', income: 61000, expenses: 35000 },
  { name: 'May', income: 59000, expenses: 31000 },
  { name: 'Jun', income: 72000, expenses: 40000 },
  { name: 'Jul', income: 68000, expenses: 38000 },
  { name: 'Aug', income: 85000, expenses: 42000 },
  { name: 'Sep', income: 91000, expenses: 45000 },
  { name: 'Oct', income: 88000, expenses: 43000 },
  { name: 'Nov', income: 94000, expenses: 46000 },
  { name: 'Dec', income: 105000, expenses: 50000 },
];

export default function TrendChart() {
  return (
    <div className="card h-full flex-col p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="chart-header flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Revenue & Expense Trend</h3>
        <div className="legend flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-xs font-semibold text-gray-600">Expenses</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-xs font-semibold text-gray-600">Income</span>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0BC175" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#0BC175" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F94144" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#F94144" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value) => `Rs.${value/1000}k`} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ fontSize: '13px', fontWeight: 600 }}
              labelStyle={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}
            />
            <Area type="monotone" dataKey="expenses" stroke="#F94144" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
            <Area type="monotone" dataKey="income" stroke="#0BC175" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
