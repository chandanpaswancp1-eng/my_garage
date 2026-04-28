import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardHeader, CardContent, Button, Badge, Input, Select, formatNepaliDate } from '../../../components/UI';
import { CalendarDays, FileText } from 'lucide-react';
import { LeaveRequest } from '../../../types';

export const LeaveRequests: React.FC = () => {
  const { currentUser, staff, leaves, addLeaveRequest } = useApp();
  
  if (!currentUser) return null;

  const myStaff = staff.find(s => s.phone === currentUser.phone);
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
