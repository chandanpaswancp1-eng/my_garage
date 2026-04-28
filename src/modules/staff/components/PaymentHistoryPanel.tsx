import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardHeader, CardContent, Button, Badge, formatNPR, formatNepaliDate } from '../../../components/UI';
import { Banknote, Download } from 'lucide-react';
import { Payslip } from '../../../types';

export const PaymentHistoryPanel: React.FC = () => {
  const { currentUser, payslips, staff } = useApp();
  
  if (!currentUser) return null;

  const myStaff = staff.find(s => s.phone === currentUser.phone);
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
