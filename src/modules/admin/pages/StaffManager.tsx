import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardHeader, CardContent, Button, Badge, Input, Modal, formatNPR } from '../../../components/UI';
import { UserPlus, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import { Staff } from '../../../types';

export const StaffManager: React.FC = () => {
  const { staff, addStaff, payslips, addPayslip, leaves, updateLeaveStatus, advances, updateAdvanceRequest } = useApp();
  const [activeSection, setActiveSection] = useState<'directory' | 'payroll' | 'leaves' | 'advances'>('directory');
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [newStaff, setNewStaff] = useState({ name: '', phone: '', email: '', position: '', salary: 0, joinedDate: '' });
  const [payslipForm, setPayslipForm] = useState({ allowance: 0, deductions: 0, month: '', year: new Date().getFullYear(), issueDate: new Date().toISOString().split('T')[0] });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    addStaff({ ...newStaff, weeklyOff: 'Saturday' });
    setShowAddStaff(false);
    setNewStaff({ name: '', phone: '', email: '', position: '', salary: 0, joinedDate: '' });
  };

  const handleGeneratePayslip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;
    const netSalary = selectedStaff.salary + Number(payslipForm.allowance) - Number(payslipForm.deductions);
    addPayslip({ staffId: selectedStaff.id, month: payslipForm.month, year: Number(payslipForm.year), basicSalary: selectedStaff.salary, allowance: Number(payslipForm.allowance), deductions: Number(payslipForm.deductions), netSalary, issueDate: payslipForm.issueDate, status: 'Paid' });
    setShowPayslipModal(false);
  };

  const tabs = [
    { id: 'directory', label: 'Staff Directory' },
    { id: 'payroll', label: 'Payslips' },
    { id: 'leaves', label: `Leave Requests (${leaves.filter(l => l.status === 'Pending').length})` },
    { id: 'advances', label: `Advance Requests (${advances.filter(a => a.status === 'Pending').length})` },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Staff & Payroll</h2>
        <Button onClick={() => setShowAddStaff(true)} className="w-full sm:w-auto">
          <UserPlus className="w-4 h-4 mr-2" /> Add Staff
        </Button>
      </div>

      {/* Tab Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 flex overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveSection(t.id as typeof activeSection)}
            className={`px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeSection === t.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Staff Directory */}
      {activeSection === 'directory' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                    <th className="p-4 font-medium">Name & Contact</th>
                    <th className="p-4 font-medium">Position</th>
                    <th className="p-4 font-medium">Monthly Salary</th>
                    <th className="p-4 font-medium">Joined Date</th>
                    <th className="p-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staff.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-slate-900">{s.name}</p>
                        <p className="text-xs text-slate-500">{s.phone} · {s.email}</p>
                      </td>
                      <td className="p-4"><Badge variant="info">{s.position}</Badge></td>
                      <td className="p-4 font-bold text-slate-900">{formatNPR(s.salary)}</td>
                      <td className="p-4 text-sm text-slate-500">{new Date(s.joinedDate).toLocaleDateString()}</td>
                      <td className="p-4">
                        <Button size="sm" variant="outline" onClick={() => { setSelectedStaff(s); setShowPayslipModal(true); }}>
                          <Download className="w-4 h-4 mr-1" /> Payslip
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {staff.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">No staff members added yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payslips */}
      {activeSection === 'payroll' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                    <th className="p-4 font-medium">Staff</th><th className="p-4 font-medium">Period</th><th className="p-4 font-medium">Basic</th><th className="p-4 font-medium">Allowance</th><th className="p-4 font-medium">Deductions</th><th className="p-4 font-medium">Net</th><th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...payslips].sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()).map(ps => {
                    const s = staff.find(m => m.id === ps.staffId);
                    return (
                      <tr key={ps.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-semibold text-slate-900">{s?.name ?? 'Unknown'}</td>
                        <td className="p-4 text-sm text-slate-500">{ps.month} {ps.year}</td>
                        <td className="p-4 text-sm">{formatNPR(ps.basicSalary)}</td>
                        <td className="p-4 text-sm text-emerald-600">+{formatNPR(ps.allowance)}</td>
                        <td className="p-4 text-sm text-red-500">-{formatNPR(ps.deductions)}</td>
                        <td className="p-4 font-bold text-slate-900">{formatNPR(ps.netSalary)}</td>
                        <td className="p-4"><Badge variant={ps.status === 'Paid' ? 'success' : 'warning'}>{ps.status}</Badge></td>
                      </tr>
                    );
                  })}
                  {payslips.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-slate-500">No payslips generated yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leave Requests */}
      {activeSection === 'leaves' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                    <th className="p-4 font-medium">Staff</th><th className="p-4 font-medium">Type</th><th className="p-4 font-medium">Dates</th><th className="p-4 font-medium">Reason</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaves.map(l => {
                    const s = staff.find(m => m.id === l.staffId);
                    return (
                      <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-semibold text-slate-900">{s?.name ?? 'Unknown'}</td>
                        <td className="p-4"><Badge variant="info">{l.type}</Badge></td>
                        <td className="p-4 text-sm text-slate-500">{new Date(l.startDate).toLocaleDateString()} – {new Date(l.endDate).toLocaleDateString()}</td>
                        <td className="p-4 text-sm text-slate-700 max-w-[150px] truncate" title={l.reason}>{l.reason}</td>
                        <td className="p-4"><Badge variant={l.status === 'Approved' ? 'success' : l.status === 'Rejected' ? 'danger' : 'warning'}>{l.status}</Badge></td>
                        <td className="p-4 flex space-x-2">
                          {l.status === 'Pending' && (
                            <>
                              <Button variant="success" size="sm" onClick={() => updateLeaveStatus(l.id, 'Approved')}><CheckCircle className="w-4 h-4" /></Button>
                              <Button variant="danger" size="sm" onClick={() => updateLeaveStatus(l.id, 'Rejected')}><XCircle className="w-4 h-4" /></Button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {leaves.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-slate-500">No leave requests.</td></tr>}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advance Salary */}
      {activeSection === 'advances' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                    <th className="p-4 font-medium">Staff</th><th className="p-4 font-medium">Requested</th><th className="p-4 font-medium">Reason</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {advances.map(a => {
                    const s = staff.find(m => m.id === a.staffId);
                    return (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-semibold text-slate-900">{s?.name ?? 'Unknown'}</td>
                        <td className="p-4 font-bold text-slate-900">{formatNPR(a.amountRequested)}</td>
                        <td className="p-4 text-sm text-slate-700 max-w-[150px] truncate" title={a.reason}>{a.reason}</td>
                        <td className="p-4"><Badge variant={a.status === 'Approved' ? 'success' : a.status === 'Rejected' ? 'danger' : 'warning'}>{a.status}</Badge></td>
                        <td className="p-4 flex space-x-2">
                          {a.status === 'Pending' && (
                            <>
                              <Button variant="success" size="sm" onClick={() => updateAdvanceRequest(a.id, 'Approved', a.amountRequested)}><CheckCircle className="w-4 h-4" /></Button>
                              <Button variant="danger" size="sm" onClick={() => updateAdvanceRequest(a.id, 'Rejected')}><XCircle className="w-4 h-4" /></Button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {advances.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">No advance requests.</td></tr>}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Staff Modal */}
      <Modal isOpen={showAddStaff} onClose={() => setShowAddStaff(false)} title="Add New Staff Member">
        <form onSubmit={handleAddStaff} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" required value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} />
            <Input label="Phone" required value={newStaff.phone} onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })} />
            <Input label="Email" type="email" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} />
            <Input label="Position" required value={newStaff.position} onChange={e => setNewStaff({ ...newStaff, position: e.target.value })} />
            <Input label="Monthly Salary (NPR)" type="number" required value={newStaff.salary || ''} onChange={e => setNewStaff({ ...newStaff, salary: Number(e.target.value) })} />
            <Input label="Date Joined" type="date" required value={newStaff.joinedDate} onChange={e => setNewStaff({ ...newStaff, joinedDate: e.target.value })} />
          </div>
          <Button type="submit" className="w-full">Save Staff Member</Button>
        </form>
      </Modal>

      {/* Generate Payslip Modal */}
      <Modal isOpen={showPayslipModal} onClose={() => setShowPayslipModal(false)} title={`Generate Payslip – ${selectedStaff?.name ?? ''}`}>
        <form onSubmit={handleGeneratePayslip} className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-900 space-y-1">
            <p><span className="font-medium">Position:</span> {selectedStaff?.position}</p>
            <p><span className="font-medium">Basic Salary:</span> {formatNPR(selectedStaff?.salary ?? 0)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Month" placeholder="e.g. April" required value={payslipForm.month} onChange={e => setPayslipForm({ ...payslipForm, month: e.target.value })} />
            <Input label="Year" type="number" required value={payslipForm.year} onChange={e => setPayslipForm({ ...payslipForm, year: Number(e.target.value) })} />
            <Input label="Allowance (NPR)" type="number" value={payslipForm.allowance || ''} onChange={e => setPayslipForm({ ...payslipForm, allowance: Number(e.target.value) })} />
            <Input label="Deductions (NPR)" type="number" value={payslipForm.deductions || ''} onChange={e => setPayslipForm({ ...payslipForm, deductions: Number(e.target.value) })} />
          </div>
          <Input label="Issue Date" type="date" required value={payslipForm.issueDate} onChange={e => setPayslipForm({ ...payslipForm, issueDate: e.target.value })} />
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
            <p className="text-sm text-emerald-700 font-medium">Net Salary</p>
            <p className="text-3xl font-extrabold text-emerald-700">{formatNPR((selectedStaff?.salary ?? 0) + Number(payslipForm.allowance) - Number(payslipForm.deductions))}</p>
          </div>
          <Button type="submit" variant="success" className="w-full">Generate & Mark Paid</Button>
        </form>
      </Modal>
    </div>
  );
};
