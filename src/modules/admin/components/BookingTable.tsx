import React from 'react';
import { Badge, Button } from '../../../components/UI';
import { ServiceBooking, User, Invoice } from '../../../types';

interface Props {
  bookings: ServiceBooking[];
  users: User[];
  invoices: Invoice[];
  onManage: (booking: ServiceBooking) => void;
}

export const BookingTable: React.FC<Props> = ({ bookings, users, invoices, onManage }) => {
  return (
    <table className="w-full text-left border-collapse min-w-[800px]">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
          <th className="p-4 font-semibold">Customer</th>
          <th className="p-4 font-semibold">Service Type</th>
          <th className="p-4 font-semibold">Date</th>
          <th className="p-4 font-semibold">Service Status</th>
          <th className="p-4 font-semibold">Billing Status</th>
          <th className="p-4 font-semibold text-right">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {bookings.map(booking => {
          const customer = users.find(u => u.id === booking.customerId);
          const invoice = invoices.find(i => i.bookingId === booking.id);
          return (
            <tr key={booking.id} className="hover:bg-slate-50/50">
              <td className="p-4">
                <p className="font-semibold text-slate-900">{customer?.name}</p>
                <p className="text-xs text-slate-500">{customer?.phone}</p>
              </td>
              <td className="p-4 text-sm font-medium text-slate-700">{booking.type}</td>
              <td className="p-4 text-sm text-slate-500">{new Date(booking.date).toLocaleDateString()}</td>
              <td className="p-4">
                <Badge variant={booking.status === 'Completed' ? 'success' : booking.status === 'In Progress' ? 'warning' : 'default'}>
                  {booking.status}
                </Badge>
              </td>
              <td className="p-4">
                {invoice ? (
                  <Badge variant={invoice.status === 'Paid' ? 'success' : 'warning'}>{invoice.status}</Badge>
                ) : (
                  <span className="text-sm text-slate-400 italic">Not Billed</span>
                )}
              </td>
              <td className="p-4 text-right">
                <Button size="sm" onClick={() => onManage(booking)}>Manage</Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
