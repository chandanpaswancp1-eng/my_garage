import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardHeader, CardContent, Button, Badge, Input, formatNPR } from '../../../components/UI';
import { CheckCircle2, HandCoins } from 'lucide-react';

export const PayslipsPanel: React.FC = () => {
  const { currentUser, staff, advances, addAdvanceRequest } = useApp();
  
  if (!currentUser) return null;

  const myStaff = staff.find(s => s.phone === currentUser.phone);
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
