import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardHeader, CardContent, Button, Input, Badge, formatNPR, Modal, Select, formatNepaliDate } from '../../../components/UI';
import { UserPlus, Banknote, HandCoins, Trash2, Download } from 'lucide-react';
import { Staff, AdvanceSalaryRequest } from '../../../types';
import { exportToExcel } from '../../../utils/exportUtils';
import { calculateWorkDuration } from '../../../utils/finance';

export const StaffManager = () => {
  const { staff, leaves, payslips, advances, attendance, addStaff, updateLeaveStatus, addPayslip, updateAdvanceRequest } = useApp();
  const [activeTab, setActiveTab] = useState<'payroll' | 'attendance'>('payroll');
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', phone: '', email: '', position: '', salary: 0, joinedDate: '' });

  // Payslip Modal State
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [selectedStaffForPayslip, setSelectedStaffForPayslip] = useState<Staff | null>(null);
  const [psData, setPsData] = useState({ month: 'January', year: new Date().getFullYear(), basic: 0, allowance: 0, deductions: 0 });

  // Advance Modal State
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [selectedAdvance, setSelectedAdvance] = useState<AdvanceSalaryRequest | null>(null);
  const [advApprovedAmount, setAdvApprovedAmount] = useState<number>(0);
  const [advAdminNotes, setAdvAdminNotes] = useState('');

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    addStaff(newStaff);
    setShowAddStaff(false);
    setNewStaff({ name: '', phone: '', email: '', position: '', salary: 0, joinedDate: '' });
  };

  const openPayslipModal = (s: Staff) => {
    setSelectedStaffForPayslip(s);
    setPsData({ month: months[new Date().getMonth()], year: new Date().getFullYear(), basic: s.salary, allowance: 0, deductions: 0 });
    setShowPayslipModal(true);
  };

  const handleGeneratePayslip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffForPayslip) return;
    
    addPayslip({
      staffId: selectedStaffForPayslip.id,
      month: psData.month,
      year: psData.year,
      basicSalary: psData.basic,
      allowance: psData.allowance,
      deductions: psData.deductions,
      netSalary: psData.basic + psData.allowance - psData.deductions,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'Paid'
    });
    
    setShowPayslipModal(false);
  };

  const openAdvanceModal = (adv: AdvanceSalaryRequest) => {
    setSelectedAdvance(adv);
    setAdvApprovedAmount(adv.amountRequested);
    setAdvAdminNotes('');
    setShowAdvanceModal(true);
  };

  const handleAdvanceAction = (status: 'Approved' | 'Rejected') => {
    if (!selectedAdvance) return;
    updateAdvanceRequest(selectedAdvance.id, status, status === 'Approved' ? advApprovedAmount : undefined, advAdminNotes);
    setShowAdvanceModal(false);
  };

  const exportPayslipsCSV = () => {
    const headers = ['Staff Name', 'Phone', 'Position', 'Salary Month', 'Year', 'Basic Salary (NPR)', 'Allowance (NPR)', 'Deductions (NPR)', 'Net Payable (NPR)', 'Issue Date', 'Status'];
    const rows = payslips.map(ps => {
      const s = staff.find(st => st.id === ps.staffId);
      return [
        s?.name || 'N/A',
        s?.phone || 'N/A',
        s?.position || 'N/A',
        ps.month,
        ps.year,
        ps.basicSalary,
        ps.allowance,
        ps.deductions,
        ps.netSalary,
        ps.issueDate,
        ps.status
      ];
    });
    exportToExcel(headers, rows, `Staff_Payroll_Report_${new Date().toISOString().split('T')[0]}`);
  };

  const exportAttendanceCSV = () => {
    const headers = ['Staff Name', 'Date', 'Day', 'Check In', 'Check Out', 'Work Duration', 'Status'];
    const rows = attendance.map(att => {
      const s = staff.find(st => st.id === att.staffId);
      const day = new Date(att.date).toLocaleDateString('en-US', { weekday: 'long' });
      
      const duration = calculateWorkDuration(att.checkIn, att.checkOut);
      
      return [
        s?.name || 'N/A',
        att.date,
        day,
        att.checkIn,
        att.checkOut || 'Not Checked Out',
        duration,
        att.status
      ];
    });
    exportToExcel(headers, rows, `Staff_Attendance_Report_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex space-x-2 bg-slate-200 p-1 rounded-xl w-full sm:w-auto">
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap \${activeTab === 'payroll' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setActiveTab('payroll')}
          >
            Payroll & Staff
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap \${activeTab === 'attendance' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance Log
          </button>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          {activeTab === 'attendance' && (
            <Button variant="outline" onClick={exportAttendanceCSV}>
              <Download className="w-4 h-4 mr-2" /> Excel
            </Button>
          )}
          <Button onClick={() => setShowAddStaff(true)}><UserPlus className="w-4 h-4 mr-2" /> Add Staff</Button>
        </div>
      </div>

      {activeTab === 'payroll' ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="Pending Advance Requests" />
              <CardContent>
                <ul className="space-y-3">
                  {advances.filter(a => a.status === 'Pending').map(adv => {
                    const s = staff.find(st => st.id === adv.staffId);
                    return (
                      <li key={adv.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-bold text-slate-900">{s?.name}</span>
                            <p className="text-xs text-slate-500">{new Date(adv.requestDate).toLocaleDateString()}</p>
                          </div>
                          <span className="font-extrabold text-blue-600">{formatNPR(adv.amountRequested)}</span>
                        </div>
                        <p className="text-sm text-slate-600 italic mb-4">"{adv.reason}"</p>
                        <Button size="sm" className="w-full" onClick={() => openAdvanceModal(adv)}>Review Request</Button>
                      </li>
                    );
                  })}
                  {advances.filter(a => a.status === 'Pending').length === 0 && (
                    <div className="text-center py-6">
                      <HandCoins className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm italic">No pending requests.</p>
                    </div>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Pending Leave Requests" />
              <CardContent>
                <ul className="space-y-3">
                  {leaves.filter(l => l.status === 'Pending').map(l => {
                    const s = staff.find(st => st.id === l.staffId);
                    return (
                      <li key={l.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                        <div className="flex justify-between mb-2">
                          <span className="font-bold text-slate-900">{s?.name}</span>
                          <Badge variant="warning">{l.type}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{l.startDate} to {l.endDate}</p>
                        <p className="text-sm text-slate-600 mb-4 italic">"{l.reason}"</p>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1" onClick={() => updateLeaveStatus(l.id, 'Approved')}>Approve</Button>
                          <Button size="sm" variant="danger" className="flex-1" onClick={() => updateLeaveStatus(l.id, 'Rejected')}>Reject</Button>
                        </div>
                      </li>
                    );
                  })}
                  {leaves.filter(l => l.status === 'Pending').length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-slate-400 text-sm italic">No pending leaves.</p>
                    </div>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader title="Staff Directory" />
            <CardContent className="p-0">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Position</th>
                      <th className="p-4 font-semibold">Base Salary</th>
                      <th className="p-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {staff.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{s.name}</p>
                          <p className="text-xs text-slate-500">{s.phone}</p>
                        </td>
                        <td className="p-4 text-sm font-medium text-slate-700">{s.position}</td>
                        <td className="p-4 text-sm font-bold">{formatNPR(s.salary)}</td>
                        <td className="p-4 text-right">
                          <Button variant="outline" size="sm" onClick={() => openPayslipModal(s)}>
                            <Banknote className="w-4 h-4 mr-2" /> Payslip
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Recent Payslips</h3>
              <Button size="sm" variant="outline" onClick={exportPayslipsCSV}>
                <Download className="w-4 h-4 mr-2" /> Excel
              </Button>
            </div>
            <CardContent className="p-0">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                      <th className="p-4 font-semibold">Staff Name</th>
                      <th className="p-4 font-semibold">Period</th>
                      <th className="p-4 font-semibold">Net Amount</th>
                      <th className="p-4 font-semibold">Issue Date</th>
                      <th className="p-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payslips.slice(0, 5).map(ps => {
                      const s = staff.find(st => st.id === ps.staffId);
                      return (
                        <tr key={ps.id} className="hover:bg-slate-50/50 text-sm">
                          <td className="p-4 font-semibold">{s?.name}</td>
                          <td className="p-4 font-medium">{ps.month} {ps.year}</td>
                          <td className="p-4 font-bold text-blue-600">{formatNPR(ps.netSalary)}</td>
                          <td className="p-4">
                            <span className="block">{new Date(ps.issueDate).toLocaleDateString()}</span>
                            <span className="text-[10px] font-bold text-slate-400">{formatNepaliDate(ps.issueDate)}</span>
                          </td>
                          <td className="p-4"><Badge variant="success">{ps.status}</Badge></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                    <th className="p-4 font-semibold">Staff Name</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Check In</th>
                    <th className="p-4 font-semibold">Check Out</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(att => {
                    const s = staff.find(st => st.id === att.staffId);
                    return (
                      <tr key={att.id} className="hover:bg-slate-50/50 text-sm">
                        <td className="p-4 font-semibold">{s?.name}</td>
                        <td className="p-4">
                          <span className="block">{new Date(att.date).toLocaleDateString()}</span>
                          <span className="text-[10px] font-bold text-slate-400">{formatNepaliDate(att.date)}</span>
                        </td>
                        <td className="p-4 font-medium text-slate-700">{att.checkIn}</td>
                        <td className="p-4 font-medium text-slate-700">{att.checkOut || '--:--'}</td>
                        <td className="p-4">
                          <Badge variant={att.status === 'Present' ? 'success' : 'warning'}>{att.status}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                  {attendance.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 italic">No attendance records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <Modal isOpen={showAddStaff} onClose={() => setShowAddStaff(false)} title="Register New Staff">
        <form onSubmit={handleAddStaff} className="space-y-4">
          <Input label="Full Name" required value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" required value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} />
            <Input label="Email" type="email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Position" required value={newStaff.position} onChange={e => setNewStaff({...newStaff, position: e.target.value})} />
            <Input label="Base Salary" type="number" required value={newStaff.salary || ''} onChange={e => setNewStaff({...newStaff, salary: Number(e.target.value)})} />
          </div>
          <Input label="Joined Date" type="date" required value={newStaff.joinedDate} onChange={e => setNewStaff({...newStaff, joinedDate: e.target.value})} />
          <Button type="submit" className="w-full">Register Staff</Button>
        </form>
      </Modal>

      <Modal isOpen={showPayslipModal} onClose={() => setShowPayslipModal(false)} title={`Generate Payslip: ${selectedStaffForPayslip?.name}`}>
        <form onSubmit={handleGeneratePayslip} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Month" value={psData.month} onChange={e => setPsData({...psData, month: e.target.value})} options={months.map(m => ({ value: m, label: m }))} />
            <Input label="Year" type="number" required value={psData.year} onChange={e => setPsData({...psData, year: Number(e.target.value)})} />
          </div>
          <Input label="Basic Salary" type="number" required value={psData.basic} onChange={e => setPsData({...psData, basic: Number(e.target.value)})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Allowances" type="number" value={psData.allowance} onChange={e => setPsData({...psData, allowance: Number(e.target.value)})} />
            <Input label="Deductions" type="number" value={psData.deductions} onChange={e => setPsData({...psData, deductions: Number(e.target.value)})} />
          </div>
          <div className="bg-blue-600 p-6 rounded-2xl text-center text-white shadow-xl shadow-blue-500/20">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Net Payable Amount</p>
            <p className="text-3xl font-black">{formatNPR(psData.basic + psData.allowance - psData.deductions)}</p>
          </div>
          <Button type="submit" className="w-full" variant="success">Confirm & Pay</Button>
        </form>
      </Modal>

      <Modal isOpen={showAdvanceModal} onClose={() => setShowAdvanceModal(false)} title="Review Advance Request">
        {selectedAdvance && (() => {
          const s = staff.find(st => st.id === selectedAdvance.staffId);
          return (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Request Information</p>
                <p className="font-bold text-slate-900">{s?.name} • {s?.position}</p>
                <p className="text-2xl font-black text-blue-600 mt-2">{formatNPR(selectedAdvance.amountRequested)}</p>
                <p className="text-sm text-slate-600 mt-2 italic">"{selectedAdvance.reason}"</p>
              </div>
              <Input label="Approved Amount" type="number" value={advApprovedAmount} onChange={e => setAdvApprovedAmount(Number(e.target.value))} />
              <div className="flex space-x-3">
                <Button variant="danger" className="flex-1" onClick={() => handleAdvanceAction('Rejected')}>Reject</Button>
                <Button variant="success" className="flex-1" onClick={() => handleAdvanceAction('Approved')}>Approve & Record</Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};
