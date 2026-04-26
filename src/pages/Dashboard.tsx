import React from 'react';
import { Wallet, TrendingDown, TrendingUp, Clock, Filter } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import TrendChart from '../components/dashboard/TrendChart';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard flex-col gap-6">
      
      {/* Dashboard Header */}
      <div className="dashboard-header flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Financial Overview</h2>
          <p className="text-sm text-muted" style={{ marginTop: '4px' }}>Comprehensive view of your garage's performance.</p>
        </div>
        
        <div className="date-filters flex items-center gap-2">
          <button className="filter-btn">This Month</button>
          <button className="filter-btn">This Year</button>
          <button className="filter-btn active">All Time</button>
          <button className="filter-btn flex items-center gap-2">
            <Filter size={14} />
            Custom
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard 
          icon={Wallet} 
          title="Total Income (Paid)" 
          amount="NPR 17,590.00" 
          badgeLabel="Revenue" 
          badgeColor="blue" 
        />
        <StatCard 
          icon={TrendingDown} 
          title="Total Expenses" 
          amount="NPR 1,22,500.00" 
          badgeLabel="Outflow" 
          badgeColor="red" 
        />
        <StatCard 
          icon={TrendingUp} 
          title="Net Profit" 
          amount="NPR -1,04,910.00" 
          badgeLabel="Margin" 
          badgeColor="green" 
          amountColor="var(--danger-red)"
        />
        <StatCard 
          icon={Clock} 
          title="Receivables" 
          amount="NPR 0.00" 
          badgeLabel="Pending" 
          badgeColor="yellow" 
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-wrapper trend">
          <TrendChart />
        </div>
        <div className="chart-wrapper expense">
          <ExpenseChart />
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card recent-bookings">
        <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
          <h3 className="text-lg font-semibold">Recent Service Bookings</h3>
          <button className="view-all-btn">View All</button>
        </div>
        <div className="table-placeholder">
          {/* Table will go here in future */}
          <p className="text-sm text-muted text-center" style={{ padding: '32px 0' }}>No recent bookings to display.</p>
        </div>
      </div>

    </div>
  );
}
