import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardContent, Button, Badge, Input, Select, Modal, formatNPR } from '../../../components/UI';
import { Plus, Edit, Receipt } from 'lucide-react';
import { ServiceBooking, Invoice, InvoiceItem, InvoiceType, PaymentType } from '../../../types';

const VAT_RATE = 0.13;

export const ServiceAndBillingManager: React.FC = () => {
  const { users, vehicles, staff, bookings, addBooking, updateBookingStatus, invoices, addInvoice, updateInvoice } = useApp();
  const [activeTab, setActiveTab] = useState<'bookings' | 'invoices'>('bookings');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');

  const [newBooking, setNewBooking] = useState<Partial<ServiceBooking>>({
    customerId: '', vehicleId: '', type: 'Full Servicing', date: new Date().toISOString().split('T')[0], status: 'Pending', mechanicId: '', notes: '',
  });

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([{ id: '1', description: '', amount: 0 }]);
  const [invoiceMeta, setInvoiceMeta] = useState({ customerId: '', invoiceType: 'Normal' as InvoiceType, paymentMethod: 'Cash' as PaymentType, paid: 0, date: new Date().toISOString().split('T')[0] });

  const customers = users.filter(u => u.role === 'customer');

  const subtotal = useMemo(() => invoiceItems.reduce((s, i) => s + Number(i.amount), 0), [invoiceItems]);
  const vatAmount = invoiceMeta.invoiceType === 'VAT' ? Math.round(subtotal * VAT_RATE) : 0;
  const total = subtotal + vatAmount;

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.customerId || !newBooking.vehicleId || !newBooking.type || !newBooking.date) return;
    addBooking(newBooking as Omit<ServiceBooking, 'id'>);
    setShowBookingModal(false);
    setNewBooking({ customerId: '', vehicleId: '', type: 'Full Servicing', date: new Date().toISOString().split('T')[0], status: 'Pending', mechanicId: '', notes: '' });
  };

  const handleAddInvoiceItem = () => {
    setInvoiceItems(prev => [...prev, { id: String(Date.now()), description: '', amount: 0 }]);
  };

  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceMeta.customerId || invoiceItems.some(i => !i.description)) return;
    const paid = Math.min(Number(invoiceMeta.paid), total);
    addInvoice({
      bookingId: selectedBookingId || undefined,
      customerId: invoiceMeta.customerId,
      items: invoiceItems.filter(i => i.description.trim()),
      total,
      paid,
      remaining: total - paid,
      type: invoiceMeta.invoiceType,
      status: total - paid <= 0 ? 'Paid' : 'Pending',
      paymentMethod: invoiceMeta.paymentMethod,
      date: invoiceMeta.date,
    });
    setShowInvoiceModal(false);
    setInvoiceItems([{ id: '1', description: '', amount: 0 }]);
    setInvoiceMeta({ customerId: '', invoiceType: 'Normal', paymentMethod: 'Cash', paid: 0, date: new Date().toISOString().split('T')[0] });
    setSelectedBookingId('');
  };

  const openInvoiceFromBooking = (booking: ServiceBooking) => {
    setSelectedBookingId(booking.id);
    setInvoiceMeta(prev => ({ ...prev, customerId: booking.customerId }));
    setShowInvoiceModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Service & Billing</h2>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setShowInvoiceModal(true)} className="flex-1 sm:flex-none">
            <Receipt className="w-4 h-4 mr-2" /> New Invoice
          </Button>
          <Button onClick={() => setShowBookingModal(true)} className="flex-1 sm:flex-none">
            <Plus className="w-4 h-4 mr-2" /> New Booking
          </Button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 flex w-full sm:w-64">
        {(['bookings', 'invoices'] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${activeTab === t ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                    <th className="p-4 font-medium">Customer</th><th className="p-4 font-medium">Vehicle</th><th className="p-4 font-medium">Service Type</th><th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...bookings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(booking => {
                    const customer = users.find(u => u.id === booking.customerId);
                    const vehicle = vehicles.find(v => v.id === booking.vehicleId);
                    return (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-semibold text-slate-900">{customer?.name ?? '—'}</td>
                        <td className="p-4 text-sm text-slate-600">{vehicle ? `${vehicle.model} (${vehicle.number})` : '—'}</td>
                        <td className="p-4 text-sm font-medium text-slate-700">{booking.type}</td>
                        <td className="p-4 text-sm text-slate-500">{new Date(booking.date).toLocaleDateString()}</td>
                        <td className="p-4">
                          <select
                            className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            value={booking.status}
                            onChange={e => updateBookingStatus(booking.id, e.target.value as ServiceBooking['status'])}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <Button size="sm" variant="outline" onClick={() => openInvoiceFromBooking(booking)}>
                            <Receipt className="w-4 h-4 mr-1" /> Invoice
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {bookings.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-slate-500">No bookings yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                    <th className="p-4 font-medium">Invoice #</th><th className="p-4 font-medium">Customer</th><th className="p-4 font-medium">Date</th><th className="p-4 font-medium">Type</th><th className="p-4 font-medium">Total</th><th className="p-4 font-medium">Paid</th><th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((inv, idx) => {
                    const customer = users.find(u => u.id === inv.customerId);
                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-mono text-sm text-blue-600 font-semibold">#{String(idx + 1).padStart(4, '0')}</td>
                        <td className="p-4 font-semibold text-slate-900">{customer?.name ?? '—'}</td>
                        <td className="p-4 text-sm text-slate-500">{new Date(inv.date).toLocaleDateString()}</td>
                        <td className="p-4"><Badge variant={inv.type === 'VAT' ? 'info' : 'default'}>{inv.type}</Badge></td>
                        <td className="p-4 font-bold text-slate-900">{formatNPR(inv.total)}</td>
                        <td className="p-4 font-semibold text-emerald-600">{formatNPR(inv.paid)}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Badge variant={inv.status === 'Paid' ? 'success' : 'warning'}>{inv.status}</Badge>
                            {inv.status === 'Pending' && (
                              <Button size="sm" variant="success" onClick={() => updateInvoice(inv.id, { paid: inv.total, remaining: 0, status: 'Paid' })}>
                                Mark Paid
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {invoices.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-slate-500">No invoices yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Modal */}
      <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} title="Create New Booking">
        <form onSubmit={handleAddBooking} className="space-y-4">
          <Select
            label="Customer"
            required
            value={newBooking.customerId}
            onChange={e => setNewBooking({ ...newBooking, customerId: e.target.value, vehicleId: '' })}
            options={[{ value: '', label: 'Select Customer...' }, ...customers.map(c => ({ value: c.id, label: c.name }))]}
          />
          <Select
            label="Vehicle"
            required
            value={newBooking.vehicleId}
            onChange={e => setNewBooking({ ...newBooking, vehicleId: e.target.value })}
            options={[{ value: '', label: 'Select Vehicle...' }, ...vehicles.filter(v => v.customerId === newBooking.customerId).map(v => ({ value: v.id, label: `${v.model} (${v.number})` }))]}
          />
          <Select
            label="Service Type"
            value={newBooking.type}
            onChange={e => setNewBooking({ ...newBooking, type: e.target.value })}
            options={['Full Servicing', 'Oil Change', 'Brake Inspection', 'Tyre Rotation', 'Wheel Alignment', 'Battery Replacement', 'AC Service', 'Other'].map(s => ({ value: s, label: s }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" required value={newBooking.date} onChange={e => setNewBooking({ ...newBooking, date: e.target.value })} />
            <Select
              label="Mechanic"
              value={newBooking.mechanicId ?? ''}
              onChange={e => setNewBooking({ ...newBooking, mechanicId: e.target.value })}
              options={[{ value: '', label: 'Not Assigned' }, ...staff.map(s => ({ value: s.id, label: s.name }))]}
            />
          </div>
          <Input label="Notes (Optional)" value={newBooking.notes ?? ''} onChange={e => setNewBooking({ ...newBooking, notes: e.target.value })} placeholder="Additional service notes..." />
          <Button type="submit" className="w-full">Create Booking</Button>
        </form>
      </Modal>

      {/* Invoice Modal */}
      <Modal isOpen={showInvoiceModal} onClose={() => setShowInvoiceModal(false)} title="Generate Invoice">
        <form onSubmit={handleSubmitInvoice} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Customer"
              required
              value={invoiceMeta.customerId}
              onChange={e => setInvoiceMeta({ ...invoiceMeta, customerId: e.target.value })}
              options={[{ value: '', label: 'Select Customer...' }, ...customers.map(c => ({ value: c.id, label: c.name }))]}
            />
            <Select
              label="Invoice Type"
              value={invoiceMeta.invoiceType}
              onChange={e => setInvoiceMeta({ ...invoiceMeta, invoiceType: e.target.value as InvoiceType })}
              options={[{ value: 'Normal', label: 'Normal (No VAT)' }, { value: 'VAT', label: 'VAT Invoice (13%)' }]}
            />
          </div>

          {/* Line Items */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Service / Parts</label>
            <div className="space-y-2">
              {invoiceItems.map((item, idx) => (
                <div key={item.id} className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all"
                    placeholder="Description (e.g., Engine Oil Change)"
                    value={item.description}
                    required
                    onChange={e => setInvoiceItems(prev => prev.map((it, i) => i === idx ? { ...it, description: e.target.value } : it))}
                  />
                  <input
                    className="w-28 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all"
                    type="number" placeholder="Amount" min="0"
                    value={item.amount || ''}
                    onChange={e => setInvoiceItems(prev => prev.map((it, i) => i === idx ? { ...it, amount: Number(e.target.value) } : it))}
                  />
                  {invoiceItems.length > 1 && (
                    <button type="button" className="px-2 text-red-400 hover:text-red-600 transition-colors" onClick={() => setInvoiceItems(prev => prev.filter((_, i) => i !== idx))}>✕</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" className="mt-2 text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors flex items-center" onClick={handleAddInvoiceItem}>
              <Plus className="w-4 h-4 mr-1" /> Add Line Item
            </button>
          </div>

          {/* Totals */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span className="font-medium">{formatNPR(subtotal)}</span></div>
            {invoiceMeta.invoiceType === 'VAT' && <div className="flex justify-between text-slate-600"><span>VAT (13%)</span><span className="font-medium">{formatNPR(vatAmount)}</span></div>}
            <div className="flex justify-between font-bold text-slate-900 text-base border-t border-slate-200 pt-2"><span>Total</span><span>{formatNPR(total)}</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Payment Method"
              value={invoiceMeta.paymentMethod}
              onChange={e => setInvoiceMeta({ ...invoiceMeta, paymentMethod: e.target.value as PaymentType })}
              options={[{ value: 'Cash', label: 'Cash' }, { value: 'QR', label: 'QR Code' }, { value: 'Bank Transfer', label: 'Bank Transfer' }, { value: 'Cheque', label: 'Cheque' }]}
            />
            <Input label="Amount Paid" type="number" min="0" max={total} value={invoiceMeta.paid || ''} onChange={e => setInvoiceMeta({ ...invoiceMeta, paid: Number(e.target.value) })} />
          </div>
          <Input label="Invoice Date" type="date" required value={invoiceMeta.date} onChange={e => setInvoiceMeta({ ...invoiceMeta, date: e.target.value })} />

          <Button type="submit" variant="success" className="w-full" disabled={subtotal <= 0}>Generate Invoice</Button>
        </form>
      </Modal>
    </div>
  );
};
