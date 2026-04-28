import React from 'react';
import { Badge, Button, formatNPR } from '../../../components/UI';
import { Download, Edit } from 'lucide-react';
import { Invoice, User, Vehicle, ServiceBooking, Settings } from '../../../types';
import { printInvoice } from '../../../utils/printInvoice';

interface Props {
  invoices: Invoice[];
  users: User[];
  vehicles: Vehicle[];
  bookings: ServiceBooking[];
  settings: Settings;
  onEdit: (invoice: Invoice) => void;
}

export const InvoiceTable: React.FC<Props> = ({ invoices, users, vehicles, bookings, settings, onEdit }) => {
  return (
    <table className="w-full text-left border-collapse min-w-[800px]">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
          <th className="p-4 font-semibold">Invoice ID</th>
          <th className="p-4 font-semibold">Customer</th>
          <th className="p-4 font-semibold text-right">Total</th>
          <th className="p-4 font-semibold text-right">Paid</th>
          <th className="p-4 font-semibold text-right">Remaining</th>
          <th className="p-4 font-semibold">Status</th>
          <th className="p-4 font-semibold text-right">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {invoices.map(invoice => {
          const customer = users.find(u => u.id === invoice.customerId);
          return (
            <tr key={invoice.id} className="hover:bg-slate-50/50">
              <td className="p-4 font-mono text-xs font-bold text-slate-400">#{invoice.id}</td>
              <td className="p-4">
                <p className="font-semibold text-slate-900">{customer?.name}</p>
                <p className="text-xs text-slate-500">{customer?.phone}</p>
              </td>
              <td className="p-4 text-right font-bold text-slate-900">{formatNPR(invoice.total)}</td>
              <td className="p-4 text-right text-emerald-600 font-medium">{formatNPR(invoice.paid)}</td>
              <td className="p-4 text-right text-red-600 font-medium">{formatNPR(invoice.remaining)}</td>
              <td className="p-4">
                <Badge variant={invoice.status === 'Paid' ? 'success' : 'warning'}>{invoice.status}</Badge>
              </td>
              <td className="p-4 text-right">
                <Button size="sm" variant="outline" onClick={() => {
                  const booking = bookings.find(b => b.id === invoice.bookingId);
                  const vehicle = vehicles.find(v => v.id === booking?.vehicleId);
                  if (customer) printInvoice(invoice, customer, settings, booking, vehicle);
                }} className="mr-2">
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onEdit(invoice)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
