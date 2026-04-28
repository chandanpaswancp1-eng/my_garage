import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, Input, formatNPR } from '../../../components/UI';
import { FileText, BellRing, Receipt, Trash2 } from 'lucide-react';
import { ServiceBooking, User, Invoice, Vehicle, InvoiceItem, InvoiceType, PaymentType, Settings } from '../../../types';
import { calculateTotalWithVAT, calculateVATAmount } from '../../../utils/finance';
import { printInvoice } from '../../../utils/printInvoice';

interface Props {
  booking: ServiceBooking | null;
  onClose: () => void;
  users: User[];
  invoices: Invoice[];
  vehicles: Vehicle[];
  settings: Settings;
  updateBookingStatus: (id: string, status: ServiceBooking['status']) => void;
  addInvoice: (invoice: any) => void;
  updateInvoice: (id: string, invoice: any) => void;
  addNotification: (userId: string, message: string) => void;
}

export const ManageBookingModal: React.FC<Props> = ({ 
  booking, onClose, users, invoices, vehicles, settings, 
  updateBookingStatus, addInvoice, updateInvoice, addNotification 
}) => {
  const [isEditingInvoice, setIsEditingInvoice] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([{ id: Date.now().toString(), description: '', amount: 0 }]);
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('Normal');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>('Cash');
  const [customMessage, setCustomMessage] = useState('');

  const invoice = booking ? invoices.find(i => i.bookingId === booking.id) : null;
  const customer = booking ? users.find(u => u.id === booking.customerId) : null;
  const vehicle = booking ? vehicles.find(v => v.id === booking.vehicleId) : null;

  useEffect(() => {
    if (booking) {
      setIsEditingInvoice(false);
      setInvoiceItems([{ id: Date.now().toString(), description: '', amount: 0 }]);
      setInvoiceType('Normal');
      setPaidAmount(0);
      setPaymentMethod('Cash');
      setCustomMessage('');
    }
  }, [booking]);

  const handleEditClick = (inv: Invoice) => {
    setIsEditingInvoice(true);
    setInvoiceItems(inv.items.length > 0 ? inv.items : [{ id: Date.now().toString(), description: '', amount: 0 }]);
    setInvoiceType(inv.type);
    setPaidAmount(inv.paid);
    setPaymentMethod(inv.paymentMethod || 'Cash');
  };

  const subtotal = invoiceItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const total = calculateTotalWithVAT(subtotal, invoiceType === 'VAT');
  
  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking || subtotal <= 0) return;

    const actualPaid = Math.min(paidAmount, total);
    const remaining = total - actualPaid;
    const status = remaining <= 0 ? 'Paid' : 'Pending';

    if (invoice) {
      updateInvoice(invoice.id, {
        items: invoiceItems,
        total, paid: actualPaid, remaining, type: invoiceType, status,
        paymentMethod: actualPaid > 0 ? paymentMethod : undefined
      });
    } else {
      addInvoice({
        bookingId: booking.id,
        customerId: booking.customerId,
        items: invoiceItems,
        total, paid: actualPaid, remaining, type: invoiceType, status,
        paymentMethod: actualPaid > 0 ? paymentMethod : undefined,
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsEditingInvoice(false);
  };

  if (!booking) return null;

  return (
    <Modal isOpen={!!booking} onClose={onClose} title={`Manage Service: ${booking.type}`}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 flex items-center"><FileText className="w-4 h-4 mr-2 text-blue-600"/> Service Details</h4>
            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
              <p><span className="text-slate-500 font-medium">Customer:</span> {customer?.name}</p>
              <p><span className="text-slate-500 font-medium">Phone:</span> {customer?.phone}</p>
              <p><span className="text-slate-500 font-medium">Vehicle:</span> {vehicle?.model}</p>
            </div>
            <Select 
              label="Update Status"
              value={booking.status}
              onChange={(e) => updateBookingStatus(booking.id, e.target.value as any)}
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Completed', label: 'Completed' }
              ]}
            />
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 flex items-center"><BellRing className="w-4 h-4 mr-2 text-blue-600"/> Quick Notification</h4>
            <textarea 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/50 text-sm"
              rows={4}
              placeholder="Message to customer..."
              value={customMessage}
              onChange={e => setCustomMessage(e.target.value)}
            ></textarea>
            <Button size="sm" onClick={() => { addNotification(booking.customerId, customMessage); setCustomMessage(''); }} disabled={!customMessage.trim()}>Send Notification</Button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <h4 className="font-bold text-slate-900 mb-4 flex items-center"><Receipt className="w-4 h-4 mr-2 text-emerald-600"/> Billing & Invoice</h4>
          {invoice && !isEditingInvoice ? (
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
               <div>
                 <p className="font-bold text-slate-900">Invoice #{invoice.id}</p>
                 <p className="text-sm text-slate-500">{formatNPR(invoice.total)} • {invoice.status}</p>
               </div>
               <div className="flex space-x-2">
                 <Button variant="secondary" size="sm" onClick={() => handleEditClick(invoice)}>Edit</Button>
                 <Button variant="outline" size="sm" onClick={() => {
                   if (customer) printInvoice(invoice, customer, settings, booking, vehicle || undefined);
                 }}>Print</Button>
               </div>
             </div>
          ) : (
            <form onSubmit={handleSaveInvoice} className="space-y-4">
              <div className="space-y-2">
                {invoiceItems.map((item) => (
                  <div key={item.id} className="flex space-x-2">
                    <input className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Work Description" value={item.description} onChange={e => setInvoiceItems(invoiceItems.map(i => i.id === item.id ? {...i, description: e.target.value} : i))} required />
                    <input className="w-24 sm:w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" type="number" step="0.01" placeholder="Amount" value={item.amount || ''} onChange={e => setInvoiceItems(invoiceItems.map(i => i.id === item.id ? {...i, amount: Number(e.target.value)} : i))} required min="0" />
                    <Button type="button" variant="danger" size="sm" onClick={() => setInvoiceItems(invoiceItems.filter(i => i.id !== item.id))} disabled={invoiceItems.length === 1}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setInvoiceItems([...invoiceItems, { id: Date.now().toString(), description: '', amount: 0 }])} className="w-full">+ Add Item</Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Select label="Invoice Type" value={invoiceType} onChange={e => setInvoiceType(e.target.value as any)} options={[{value:'Normal', label:'Normal'}, {value:'VAT', label:'VAT (+13%)'}, {value:'Special', label:'Special Bill'}]} />
                <div className="bg-blue-50 p-3 rounded-xl text-right">
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Total Amount</p>
                  <p className="text-xl font-black text-blue-900">{formatNPR(total)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <Input label="Amount Paid" type="number" step="0.01" value={paidAmount || ''} onChange={e => setPaidAmount(Number(e.target.value))} />
                 <Select label="Method" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)} options={[{value:'Cash', label:'Cash'}, {value:'QR', label:'QR'}, {value:'Bank Transfer', label:'Bank'}]} />
              </div>
              <Button type="submit" className="w-full" variant="success">{invoice ? 'Save Changes' : 'Generate Invoice'}</Button>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};
