import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Payroll', value: 75000, color: '#3158f6' },
  { name: 'Spare Parts', value: 35000, color: '#F8961E' },
  { name: 'Rent', value: 45000, color: '#0BC175' },
  { name: 'Utilities', value: 12500, color: '#F94144' },
  { name: 'Marketing', value: 8000, color: '#8B5CF6' },
];

export default function ExpenseChart() {
  return (
    <div className="card h-full flex-col p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Expense Distribution</h3>
      <div className="flex-col justify-between flex-1">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={65}
                outerRadius={85}
                paddingAngle={6}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `NPR ${value.toLocaleString()}`}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="expense-legend flex-col gap-3 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-sm font-semibold text-gray-600">{item.name}</span>
              </div>
              <span className="text-sm font-bold text-gray-900">NPR {item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
