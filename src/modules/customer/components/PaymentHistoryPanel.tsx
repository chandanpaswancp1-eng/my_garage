import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardContent, Button, Badge, formatNPR, formatNepaliDate } from '../../../components/UI';
import { Clock, Download, Banknote } from 'lucide-react';
import { printInvoice } from '../../../utils/printInvoice';
import { exportToExcel } from '../../../utils/exportUtils';

export const PaymentHistoryPanel: React.FC = () => {
  const { currentUser, invoices, settings, bookings, vehicles } = useApp();

  if (!currentUser) return null;

  const myInvoices = invoices
    .filter(i => i.customerId === currentUser.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleExportExcel = () => {
    const headers = ['Invoice ID', 'Date', 'Type', 'Total Amount (NPR)', 'Amount Paid (NPR)', 'Balance Due (NPR)', 'Status'];
    const rows = myInvoices.map(inv => [
      inv.id,
      inv.date,
      inv.type,
      inv.total,
      inv.paid,
      inv.remaining,
      inv.status
    ]);
    exportToExcel(headers, rows, `My_Payment_History_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Payment History</h2>
        <Button variant="outline" size="sm" onClick={handleExportExcel}>
          <Download className="w-4 h-4 mr-2" /> Excel
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {myInvoices.map(invoice => (
              <div key={invoice.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 hover:bg-slate-50 transition-colors">
                <div className="mb-4 md:mb-0 flex items-start">
                  <div className="p-3 bg-emerald-50 rounded-xl mr-4 hidden sm:block flex-shrink-0">
                    <Banknote className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <h4 className="font-bold text-lg text-slate-900">Invoice #{invoice.id}</h4>
                      <Badge variant={invoice.status === 'Paid' ? 'success' : 'danger'}>{invoice.status}</Badge>
                    </div>
                    <p className="text-sm text-slate-500 flex items-center">
                      <Clock className="w-4 h-4 mr-1.5" /> {formatNepaliDate(invoice.date)}
                    </p>
                  </div>
                </div>
                <div className="text-left md:text-right w-full md:w-auto bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-xl">
                  <p className="font-extrabold text-slate-900 text-xl">{formatNPR(invoice.total)}</p>
                  <div className="flex items-center md:justify-end mt-1 mb-3 gap-2">
                    <span className="text-sm text-slate-500">Paid:</span>
                    <span className="text-sm font-semibold text-emerald-600">{formatNPR(invoice.paid)}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                    const booking = bookings.find(b => b.id === invoice.bookingId);
                    const vehicle = vehicles.find(v => v.id === booking?.vehicleId);
                    printInvoice(invoice, currentUser, settings, booking, vehicle);
                  }} className="w-full md:w-auto">
                    <Download className="w-4 h-4 mr-2" /> Download Invoice
                  </Button>
                </div>
              </div>
            ))}
            {myInvoices.length === 0 && (
              <div className="p-12 text-center">
                <Banknote className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-lg">No payment history found.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
