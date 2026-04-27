import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layout } from '../../components/LayoutShell';
import { Card, CardHeader, CardContent, Button, Badge, Input, Select, formatNPR, formatNepaliDate } from '../../components/UI';
import { LayoutDashboard, Clock, FileText, CheckCircle2, Wrench, Banknote, Download, CalendarDays, HandCoins, History } from 'lucide-react';
import { Payslip, Attendance, LeaveRequest, AdvanceSalaryRequest } from '../../types';

// ==================== Staff Dashboard (Tasks) ====================

const StaffDashboard: React.FC = () => {
  const { currentUser, bookings, vehicles, users, staff, updateBookingStatus } = useApp();
  
  // Find staff record for current user
  const myStaff = staff.find(s => s.phone === currentUser?.phone);
  const staffId = myStaff?.id || 's1';
  const myTasks = bookings.filter(b => b.mechanicId === staffId && b.status !== 'Completed');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Workspace</h2>
        <p className="text-slate-500 mt-1">Manage your assigned tasks and daily activities.</p>
      </div>
      
      <Card className="border-t-4 border-t-blue-600">
        <CardHeader title="Today's Assigned Services" />
        <CardContent className="p-0">
          {myTasks.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {myTasks.map(task => {
                const vehicle = vehicles.find(v => v.id === task.vehicleId);
                const customer = users.find(u => u.id === task.customerId);
                return (
                  <div key={task.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-slate-50 transition-colors">
                    <div className="mb-5 md:mb-0 w-full md:w-auto">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Wrench className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="font-bold text-lg text-slate-900">{task.type}</h4>
                        <Badge variant={task.status === 'In Progress' ? 'warning' : 'default'}>{task.status}</Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                          <p className="text-slate-500 font-medium mb-1 text-xs uppercase tracking-wider">Vehicle</p>
                          <p className="font-semibold text-slate-900">{vehicle?.model}</p>
                          <p className="text-slate-600">{vehicle?.number}</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                          <p className="text-slate-500 font-medium mb-1 text-xs uppercase tracking-wider">Customer</p>
                          <p className="font-semibold text-slate-900">{customer?.name}</p>
                          <p className="text-slate-600">{customer?.phone}</p>
                        </div>
                      </div>
                      {task.notes && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                          <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Customer Notes</p>
                          <p className="text-sm text-amber-900 font-medium italic">"{task.notes}"</p>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-3 w-full md:w-auto mt-4 md:mt-0">
                      {task.status === 'Pending' && (
                        <Button onClick={() => updateBookingStatus(task.id, 'In Progress')} className="w-full md:w-auto">Start Work</Button>
                      )}
                      {task.status === 'In Progress' && (
                        <Button variant="success" onClick={() => updateBookingStatus(task.id, 'Completed')} className="w-full md:w-auto">
                          <CheckCircle2 className="w-5 h-5 mr-2" /> Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <p className="text-slate-800 font-bold text-xl">All caught up!</p>
              <p className="text-slate-500 mt-2">You have no pending tasks assigned.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ==================== Attendance Panel ====================

const AttendancePanel: React.FC = () => {
  const { currentUser, staff, attendance, checkInStaff, checkOutStaff } = useApp();
  const myStaff = staff.find(s => s.phone === currentUser?.phone);
  const staffId = myStaff?.id || 's1';
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find(a => a.staffId === staffId && a.date === today);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md shadow-2xl border-none bg-gradient-to-b from-white to-slate-50">
        <CardHeader title="Daily Attendance" />
        <CardContent className="text-center py-10 px-8">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
            <div className="relative bg-white rounded-full w-full h-full flex items-center justify-center shadow-lg border border-slate-100 z-10">
              <Clock className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          <p className="text-sm font-semibold text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full mb-8">
            {formatNepaliDate(new Date())}
          </p>
          
          {!todayRecord ? (
            <Button size="lg" className="w-full py-4 text-lg" onClick={() => checkInStaff(staffId)}>
              Check In Now
            </Button>
          ) : !todayRecord.checkOut ? (
            <div className="space-y-6">
              <div className="p-6 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl">
                <p className="text-sm font-medium uppercase tracking-wider mb-1 opacity-70">Checked In At</p>
                <p className="text-4xl font-extrabold">{todayRecord.checkIn}</p>
              </div>
              <Button size="lg" variant="danger" className="w-full py-4 text-lg" onClick={() => checkOutStaff(staffId)}>
                Check Out
              </Button>
            </div>
          ) : (
            <div className="p-8 bg-slate-100 border border-slate-200 text-slate-800 rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <p className="font-bold text-xl mb-6">Shift Completed</p>
              <div className="flex justify-center items-center space-x-8 text-sm font-bold">
                <div className="text-center">
                  <p className="text-slate-500 uppercase tracking-wider text-[10px] mb-1">In</p>
                  <p className="text-slate-900 text-lg">{todayRecord.checkIn}</p>
                </div>
                <div className="h-10 w-px bg-slate-300"></div>
                <div className="text-center">
                  <p className="text-slate-500 uppercase tracking-wider text-[10px] mb-1">Out</p>
                  <p className="text-slate-900 text-lg">{todayRecord.checkOut}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ==================== Leave Requests ====================

const LeaveRequests: React.FC = () => {
  const { currentUser, staff, leaves, addLeaveRequest } = useApp();
  const myStaff = staff.find(s => s.phone === currentUser?.phone);
  const staffId = myStaff?.id || 's1';
  const myLeaves = leaves.filter(l => l.staffId === staffId);
  
  const [type, setType] = useState<LeaveRequest['type']>('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLeaveRequest({ staffId, type, startDate, endDate, reason });
    setStartDate(''); setEndDate(''); setReason('');
    alert("Leave request submitted successfully.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="h-fit">
        <CardHeader title="Apply for Leave" />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select 
              label="Leave Type" 
              value={type} 
              onChange={e => setType(e.target.value as any)}
              options={[
                { value: 'Annual', label: 'Annual Leave' },
                { value: 'Paid',   label: 'Paid Leave' },
                { value: 'Sick',   label: 'Sick Leave' },
                { value: 'Unpaid', label: 'Unpaid Leave' }
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Date" type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} />
              <Input label="End Date" type="date" required value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason</label>
              <textarea 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all text-sm"
                rows={4} required value={reason} onChange={e => setReason(e.target.value)}
                placeholder="Brief description of why you need leave..."
              />
            </div>
            <Button type="submit" className="w-full py-3 text-base">Submit Leave Request</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="My Leave History" />
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto custom-scrollbar">
            {myLeaves.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map(l => (
              <div key={l.id} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <CalendarDays className="w-5 h-5 text-slate-400 mr-2" />
                    <span className="font-bold text-slate-900">{l.type} Leave</span>
                  </div>
                  <Badge variant={l.status === 'Approved' ? 'success' : l.status === 'Rejected' ? 'danger' : 'warning'}>{l.status}</Badge>
                </div>
                <div className="ml-7">
                  <p className="text-sm font-semibold text-slate-700">
                    {new Date(l.startDate).toLocaleDateString()} to {new Date(l.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-tighter">
                    {formatNepaliDate(l.startDate)} - {formatNepaliDate(l.endDate)}
                  </p>
                  <p className="text-sm text-slate-500 mt-2 italic">"{l.reason}"</p>
                </div>
              </div>
            ))}
            {myLeaves.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">No leave records found.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ==================== Payslips & Advances ====================

const PayslipsPanel: React.FC = () => {
  const { currentUser, staff, advances, addAdvanceRequest } = useApp();
  const myStaff = staff.find(s => s.phone === currentUser?.phone);
  const staffId = myStaff?.id || 's1';
  const myAdvances = advances.filter(a => a.staffId === staffId);

  const [advAmount, setAdvAmount] = useState<number | ''>('');
  const [advReason, setAdvReason] = useState('');

  const handleAdvanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advAmount || advAmount <= 0) return;
    addAdvanceRequest({
      staffId,
      amountRequested: Number(advAmount),
      reason: advReason,
      requestDate: new Date().toISOString().split('T')[0]
    });
    setAdvAmount('');
    setAdvReason('');
    alert('Advance salary request submitted successfully.');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader title="Request Advance Salary" />
        <CardContent>
          <form onSubmit={handleAdvanceSubmit} className="space-y-5">
            <Input 
              label="Amount Requested (NPR)" 
              type="number" 
              required 
              min="1"
              value={advAmount} 
              onChange={e => setAdvAmount(Number(e.target.value))} 
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason</label>
              <textarea 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all text-sm"
                rows={3} required value={advReason} onChange={e => setAdvReason(e.target.value)}
                placeholder="Explain the urgent need for advance..."
              />
            </div>
            <Button type="submit" className="w-full py-3 text-base">Submit Advance Request</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Advance Request History" />
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto custom-scrollbar">
            {myAdvances.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()).map(adv => (
              <div key={adv.id} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-900 text-lg">{formatNPR(adv.amountRequested)}</span>
                  <Badge variant={adv.status === 'Approved' ? 'success' : adv.status === 'Rejected' ? 'danger' : 'warning'}>{adv.status}</Badge>
                </div>
                <p className="text-xs text-slate-500 mb-2 font-medium">Requested: {new Date(adv.requestDate).toLocaleDateString()}</p>
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm mb-3">
                  <p className="text-sm text-slate-600 italic">"{adv.reason}"</p>
                </div>
                {adv.status === 'Approved' && adv.amountApproved && (
                  <div className="flex items-center text-emerald-600 font-bold bg-emerald-50 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    <span>Approved Amount: {formatNPR(adv.amountApproved)}</span>
                  </div>
                )}
                {adv.adminNotes && (
                  <p className="text-xs text-slate-400 mt-2 bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="font-bold">Admin Notes:</span> {adv.adminNotes}
                  </p>
                )}
              </div>
            ))}
            {myAdvances.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                <HandCoins className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">No advance requests found.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ==================== Payment History (Payslips) ====================

const PaymentHistoryPanel: React.FC = () => {
  const { currentUser, payslips, staff } = useApp();
  const myStaff = staff.find(s => s.phone === currentUser?.phone);
  const staffId = myStaff?.id || 's1';
  const myPayslips = payslips.filter(p => p.staffId === staffId);
  const myStaffInfo = myStaff;

  const handleDownloadPayslip = (payslip: Payslip) => {
    let content = `SEWA AUTOMOBILE - OFFICIAL PAYSLIP\n`;
    content += `========================================\n`;
    content += `Employee Name: ${myStaffInfo?.name || currentUser.name}\n`;
    content += `Position: ${myStaffInfo?.position || 'Staff'}\n`;
    content += `Salary Month: ${payslip.month} ${payslip.year}\n`;
    content += `Issue Date: ${new Date(payslip.issueDate).toLocaleDateString()}\n`;
    content += `========================================\n`;
    content += `Earnings Breakdown:\n`;
    content += `- Basic Salary: ${formatNPR(payslip.basicSalary)}\n`;
    content += `- Allowances: ${formatNPR(payslip.allowance)}\n`;
    content += `----------------------------------------\n`;
    content += `Deductions:\n`;
    content += `- Total Deductions: ${formatNPR(payslip.deductions)}\n`;
    content += `========================================\n`;
    content += `NET SALARY PAYABLE: ${formatNPR(payslip.netSalary)}\n`;
    content += `========================================\n`;
    content += `This is a computer generated document.\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `Payslip_${payslip.month}_${payslip.year}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-900">Payment History</h2>
      
      <Card>
        <CardHeader title="Salary Payslips" />
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {myPayslips.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()).map(payslip => (
              <div key={payslip.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 hover:bg-slate-50 transition-colors">
                <div className="mb-4 md:mb-0 flex items-start">
                  <div className="p-3 bg-emerald-50 rounded-xl mr-4 hidden sm:block">
                    <Banknote className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1.5">
                      <h4 className="font-bold text-lg text-slate-900">{payslip.month} {payslip.year}</h4>
                      <Badge variant={payslip.status === 'Paid' ? 'success' : 'warning'}>{payslip.status}</Badge>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Issued: {new Date(payslip.issueDate).toLocaleDateString()}</p>
                    <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-tight">{formatNepaliDate(payslip.issueDate)}</p>
                  </div>
                </div>
                <div className="text-left md:text-right w-full md:w-auto bg-slate-50 md:bg-transparent p-5 md:p-0 rounded-2xl border border-slate-100 md:border-none">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Net Payable</p>
                  <p className="font-extrabold text-slate-900 text-3xl mb-4">{formatNPR(payslip.netSalary)}</p>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadPayslip(payslip)} className="w-full md:w-auto">
                    <Download className="w-4 h-4 mr-2" /> Download Payslip
                  </Button>
                </div>
              </div>
            ))}
            {myPayslips.length === 0 && (
              <div className="p-16 text-center text-slate-400">
                <Banknote className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">No payslips issued yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ==================== StaffApp Shell ====================

const staffSidebar = [
  { id: 'dashboard',  label: 'Tasks',           icon: LayoutDashboard },
  { id: 'attendance', label: 'Attendance',      icon: Clock },
  { id: 'requests',   label: 'Leave Requests',  icon: FileText },
  { id: 'payslips',   label: 'Request Advance', icon: HandCoins },
  { id: 'history',    label: 'Payment History', icon: History },
];

export const StaffApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':  return <StaffDashboard />;
      case 'attendance': return <AttendancePanel />;
      case 'requests':   return <LeaveRequests />;
      case 'payslips':   return <PayslipsPanel />;
      case 'history':    return <PaymentHistoryPanel />;
      default:           return <StaffDashboard />;
    }
  };

  return (
    <Layout sidebarItems={staffSidebar} activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};
