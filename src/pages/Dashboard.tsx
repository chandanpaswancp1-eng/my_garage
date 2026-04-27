import React from 'react';
import { Wallet, TrendingDown, TrendingUp, Clock, Filter, MoreVertical, CheckCircle, Clock3, AlertCircle } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import TrendChart from '../components/dashboard/TrendChart';
import ExpenseChart from '../components/dashboard/ExpenseChart';

// Comprehensive mock data
const recentBookings = [
  { id: 'SRV-001', customer: 'Rahul Sharma', vehicle: 'Hyundai Creta', type: 'Full Servicing', date: 'Oct 26, 2026', status: 'In Progress', amount: 8500 },
  { id: 'SRV-002', customer: 'Priya Patel', vehicle: 'Maruti Swift', type: 'Oil Change', date: 'Oct 26, 2026', status: 'Pending', amount: 3200 },
  { id: 'SRV-003', customer: 'Amit Kumar', vehicle: 'Honda City', type: 'Brake Pad Repair', date: 'Oct 25, 2026', status: 'Completed', amount: 4500 },
  { id: 'SRV-004', customer: 'Sita Devi', vehicle: 'Toyota Innova', type: 'Engine Diagnostics', date: 'Oct 25, 2026', status: 'Completed', amount: 2100 },
  { id: 'SRV-005', customer: 'Bikash Thapa', vehicle: 'Kia Seltos', type: 'Washing & Cleaning', date: 'Oct 24, 2026', status: 'Pending', amount: 800 },
];

const pendingPayments = [
  { invoice: 'INV-1042', customer: 'Sunil Shrestha', dueDate: 'Oct 28, 2026', amount: 12500 },
  { invoice: 'INV-1039', customer: 'Anjali Gurung', dueDate: 'Oct 27, 2026', amount: 4200 },
  { invoice: 'INV-1025', customer: 'Transport Co.', dueDate: 'Oct 20, 2026', amount: 45000 },
];

export default function Dashboard() {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Completed': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={12}/> Completed</span>;
      case 'In Progress': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock3 size={12}/> In Progress</span>;
      case 'Pending': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><AlertCircle size={12}/> Pending</span>;
      default: return null;
    }
  };

  return (
    <div className="w-full flex-col gap-6">
      
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Comprehensive view of your garage's performance.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          <button className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-md transition-colors">This Month</button>
          <button className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-md transition-colors">This Year</button>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-sewa-blue rounded-md shadow-sm">All Time</button>
          <button className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2 border-l border-gray-200 ml-1 pl-4">
            <Filter size={14} /> Custom
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={Wallet} title="Total Income (Paid)" amount="NPR 8,68,590.00" badgeLabel="Revenue" badgeColor="blue" />
        <StatCard icon={TrendingDown} title="Total Expenses" amount="NPR 4,22,500.00" badgeLabel="Outflow" badgeColor="red" />
        <StatCard icon={TrendingUp} title="Net Profit" amount="NPR 4,46,090.00" badgeLabel="Margin" badgeColor="green" amountColor="#0BC175"/>
        <StatCard icon={Clock} title="Receivables" amount="NPR 61,700.00" badgeLabel="Pending" badgeColor="yellow" amountColor="#F8961E"/>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
        <div className="lg:col-span-1">
          <ExpenseChart />
        </div>
      </div>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Service Bookings</h3>
            <button className="text-sm font-semibold text-sewa-blue hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-lg transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500">
                  <th className="pb-3 font-semibold">Service ID</th>
                  <th className="pb-3 font-semibold">Customer & Vehicle</th>
                  <th className="pb-3 font-semibold">Service Type</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-bold text-gray-900">{booking.id}</td>
                    <td className="py-4">
                      <div className="font-semibold">{booking.customer}</div>
                      <div className="text-xs text-gray-500">{booking.vehicle}</div>
                    </td>
                    <td className="py-4 font-medium text-gray-700">{booking.type}</td>
                    <td className="py-4 text-gray-500">{booking.date}</td>
                    <td className="py-4 font-bold">NPR {booking.amount.toLocaleString()}</td>
                    <td className="py-4">{getStatusBadge(booking.status)}</td>
                    <td className="py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Payments Alert */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Pending Payments</h3>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-md">Action Needed</span>
          </div>
          <div className="flex flex-col gap-4">
            {pendingPayments.map((payment) => (
              <div key={payment.invoice} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer">
                <div>
                  <div className="font-bold text-gray-900 text-sm mb-1">{payment.customer}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">{payment.invoice}</span>
                    <span>•</span>
                    <span className="text-red-500 font-medium flex items-center gap-1"><Clock3 size={10}/> Due {payment.dueDate}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">NPR {payment.amount.toLocaleString()}</div>
                  <button className="text-xs font-bold text-sewa-blue mt-1 hover:underline">Send Reminder</button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:border-sewa-blue hover:text-sewa-blue transition-colors">
            View All Receivables
          </button>
        </div>

      </div>
    </div>
  );
}
