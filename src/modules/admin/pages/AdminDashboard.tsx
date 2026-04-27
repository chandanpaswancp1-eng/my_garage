import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardHeader, CardContent, Badge, formatNPR } from '../../../components/UI';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Clock, 
  Filter 
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

export const AdminDashboard = () => {
  const { invoices, payslips, expenses, bookings, users } = useApp();
  const [timeRange, setTimeRange] = useState<'all' | 'year' | 'month' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  // Memoize calculations for performance and filtering
  const { 
    totalIncome, 
    pendingPayments, 
    totalExpenses, 
    netProfit,
    incomeByMonth,
    expenseByCategory
  } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const isWithinCustomRange = (dateString: string) => {
      if (timeRange !== 'custom' || !customStartDate || !customEndDate) return true;
      const d = new Date(dateString).getTime();
      const start = new Date(customStartDate).getTime();
      const end = new Date(customEndDate).getTime() + 86400000; // Include the end day fully
      return d >= start && d < end;
    };

    // Filter data based on selected time range
    const filteredInvoices = invoices.filter(i => {
      if (timeRange === 'all') return true;
      if (timeRange === 'custom') return isWithinCustomRange(i.date);
      const d = new Date(i.date);
      if (timeRange === 'year') return d.getFullYear() === currentYear;
      if (timeRange === 'month') return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      return true;
    });

    const filteredExpenses = expenses.filter(e => {
      if (timeRange === 'all') return true;
      if (timeRange === 'custom') return isWithinCustomRange(e.date);
      const d = new Date(e.date);
      if (timeRange === 'year') return d.getFullYear() === currentYear;
      if (timeRange === 'month') return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      return true;
    });

    const filteredPayslips = payslips.filter(p => {
      if (timeRange === 'all') return true;
      if (timeRange === 'custom') return isWithinCustomRange(p.issueDate);
      const d = new Date(p.issueDate);
      if (timeRange === 'year') return d.getFullYear() === currentYear;
      if (timeRange === 'month') return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      return true;
    });

    // Calculate Totals
    const income = filteredInvoices.reduce((sum, i) => sum + i.paid, 0);
    const pending = filteredInvoices.reduce((sum, i) => sum + i.remaining, 0);
    const payroll = filteredPayslips.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.netSalary, 0);
    const otherExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalExp = payroll + otherExpenses;

    // Prepare Chart Data: Income by Month
    const monthlyData: Record<string, { income: number, expense: number }> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (timeRange === 'all' || timeRange === 'year') {
      months.forEach(m => monthlyData[m] = { income: 0, expense: 0 });
    }

    filteredInvoices.forEach(i => {
      const d = new Date(i.date);
      const monthName = months[d.getMonth()];
      if (!monthlyData[monthName]) monthlyData[monthName] = { income: 0, expense: 0 };
      monthlyData[monthName].income += i.paid;
    });

    filteredExpenses.forEach(e => {
      const d = new Date(e.date);
      const monthName = months[d.getMonth()];
      if (!monthlyData[monthName]) monthlyData[monthName] = { income: 0, expense: 0 };
      monthlyData[monthName].expense += e.amount;
    });

    filteredPayslips.filter(p => p.status === 'Paid').forEach(p => {
      const d = new Date(p.issueDate);
      const monthName = months[d.getMonth()];
      if (!monthlyData[monthName]) monthlyData[monthName] = { income: 0, expense: 0 };
      monthlyData[monthName].expense += p.netSalary;
    });

    const trendData = Object.keys(monthlyData).map(key => ({
      name: key,
      income: monthlyData[key].income,
      expense: monthlyData[key].expense
    })).filter(d => d.income > 0 || d.expense > 0 || timeRange === 'year');

    // Prepare Chart Data: Expenses by Category
    const expCategories: Record<string, number> = { 'Payroll': payroll };
    filteredExpenses.forEach(e => {
      expCategories[e.category] = (expCategories[e.category] || 0) + e.amount;
    });
    
    const pieData = Object.keys(expCategories)
      .filter(key => expCategories[key] > 0)
      .map(key => ({ name: key, value: expCategories[key] }));

    return {
      totalIncome: income,
      pendingPayments: pending,
      totalExpenses: totalExp,
      netProfit: income - totalExp,
      incomeByMonth: trendData,
      expenseByCategory: pieData
    };
  }, [invoices, payslips, expenses, timeRange, customStartDate, customEndDate]);

  const recentBookings = bookings.slice(-5).reverse();
  const COLORS = ['#3158f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Financial Overview</h2>
          <p className="text-slate-500 mt-1 text-sm">Comprehensive view of your garage's performance.</p>
        </div>
        <div className="flex flex-col items-start sm:items-end space-y-3 w-full sm:w-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 flex w-full sm:w-auto overflow-x-auto custom-scrollbar">
            {['month', 'year', 'all', 'custom'].map((range) => (
              <button 
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap capitalize ${timeRange === range ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {range === 'custom' ? <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 inline" /> : ''}
                {range === 'month' ? 'This Month' : range === 'year' ? 'This Year' : range === 'all' ? 'All Time' : 'Custom'}
              </button>
            ))}
          </div>
          
          {timeRange === 'custom' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 bg-white p-2 rounded-xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-2 w-full sm:w-auto">
              <input 
                type="date" 
                className="text-sm border border-slate-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-600/50 text-slate-600 w-full sm:w-auto"
                value={customStartDate}
                onChange={e => setCustomStartDate(e.target.value)}
              />
              <span className="text-slate-400 hidden sm:inline">to</span>
              <input 
                type="date" 
                className="text-sm border border-slate-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-600/50 text-slate-600 w-full sm:w-auto"
                value={customEndDate}
                onChange={e => setCustomEndDate(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Total Income', value: totalIncome, icon: Wallet, badge: 'Revenue', color: 'blue' },
          { label: 'Total Expenses', value: totalExpenses, icon: TrendingDown, badge: 'Outflow', color: 'red' },
          { label: 'Net Profit', value: netProfit, icon: TrendingUp, badge: 'Margin', color: 'emerald' },
          { label: 'Receivables', value: pendingPayments, icon: Clock, badge: 'Pending', color: 'amber' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-${stat.color}-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out`}></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 sm:p-3 bg-${stat.color}-100 text-${stat.color}-600 rounded-xl`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <Badge variant={stat.badge.toLowerCase() as any} className={`bg-${stat.color}-50 text-${stat.color}-700 border-none`}>{stat.badge}</Badge>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm font-medium mb-1">{stat.label}</p>
                <h3 className={`text-2xl sm:text-3xl font-extrabold text-slate-900 truncate ${stat.label === 'Net Profit' && netProfit < 0 ? 'text-red-600' : ''}`}>
                  {formatNPR(stat.value)}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader title="Revenue & Expense Trend" />
          <CardContent className="p-2 sm:p-6">
            {incomeByMonth.length > 0 ? (
              <div className="h-64 sm:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={incomeByMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `Rs.${value/1000}k`} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Tooltip 
                      formatter={(value: number) => formatNPR(value)} 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Area type="monotone" name="Income" dataKey="income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" name="Expenses" dataKey="expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 sm:h-80 flex items-center justify-center text-slate-400 text-sm">No data available for selected period.</div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader title="Expense Distribution" />
          <CardContent className="flex flex-col items-center justify-center h-[calc(100%-60px)] sm:h-[calc(100%-73px)]">
            {expenseByCategory.length > 0 ? (
              <>
                <div className="h-48 sm:h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {expenseByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatNPR(value)} contentStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full space-y-2 mt-2 sm:mt-4">
                  {expenseByCategory.map((entry, index) => (
                    <div key={entry.name} className="flex justify-between items-center text-xs sm:text-sm">
                      <div className="flex items-center">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-slate-600 truncate max-w-[100px] sm:max-w-none">{entry.name}</span>
                      </div>
                      <span className="font-semibold text-slate-900">{formatNPR(entry.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-slate-400 text-sm">No expenses recorded.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader title="Recent Service Bookings" />
        <CardContent className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-3 sm:p-4 font-semibold">Customer</th>
                  <th className="p-3 sm:p-4 font-semibold">Service</th>
                  <th className="p-3 sm:p-4 font-semibold">Date</th>
                  <th className="p-3 sm:p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map(booking => {
                  const customer = users.find(u => u.id === booking.customerId);
                  return (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 sm:p-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mr-3 border border-blue-200 flex-shrink-0 text-xs">
                            {customer?.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">{customer?.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{customer?.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 text-xs sm:text-sm font-medium text-slate-700">{booking.type}</td>
                      <td className="p-3 sm:p-4 text-xs sm:text-sm text-slate-500">{new Date(booking.date).toLocaleDateString()}</td>
                      <td className="p-3 sm:p-4">
                        <Badge variant={booking.status === 'Completed' ? 'success' : booking.status === 'In Progress' ? 'warning' : 'default'}>
                          {booking.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
                {recentBookings.length === 0 && (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-500 text-sm">No recent bookings.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
