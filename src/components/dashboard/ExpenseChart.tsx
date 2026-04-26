import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Payroll', value: 73000, color: '#3158f6' },
  { name: 'Utilities', value: 4500, color: '#F94144' },
  { name: 'Rent', value: 45000, color: '#0BC175' },
];

export default function ExpenseChart() {
  return (
    <div className="card h-full flex-col">
      <h3 className="text-lg font-semibold" style={{ marginBottom: '24px' }}>Expense Distribution</h3>
      <div className="flex-col justify-between" style={{ flex: 1 }}>
        <div style={{ height: '220px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `NPR ${value.toLocaleString()}`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="expense-legend flex-col gap-3" style={{ marginTop: 'auto', paddingTop: '16px' }}>
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="dot" style={{ backgroundColor: item.color, width: 10, height: 10, borderRadius: '50%' }}></span>
                <span className="text-sm font-medium text-muted">{item.name}</span>
              </div>
              <span className="text-sm font-bold">NPR {item.value.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
