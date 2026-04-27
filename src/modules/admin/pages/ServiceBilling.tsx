import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardContent, Button, Badge, formatNPR, Input, Select, Modal } from '../../../components/UI';
import { Plus, Receipt, Edit, Trash2, BellRing, FileText } from 'lucide-react';
import { ServiceBooking, InvoiceType, PaymentType, InvoiceItem, Invoice } from '../../../types';

export const ServiceAndBillingManager = () => {
  const { bookings, users, staff, invoices, vehicles, updateBookingStatus, addInvoice, updateInvoice, addNotification, addBooking } = useApp();
  
  const [activeTab, setActiveTab] = useState<'bookings' | 'invoices'>('bookings');
  
  // Modals State
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isDirectInvoiceModalOpen, setIsDirectInvoiceModalOpen] = useState(false);
  
  // Shared Invoice Form State (Line Items)
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([{ id: Date.now().toString(), description: '', amount: 0 }]);
  const [isEditingInvoice, setIsEditingInvoice] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  
  // Manage Booking Invoice Form State
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('Normal');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>('Cash');
  const [customMessage, setCustomMessage] = useState('');

  // New Booking Form State
  const [nbCustomer, setNbCustomer] = useState('');
  const [nbVehicle, setNbVehicle] = useState('');
  const [nbType, setNbType] = useState('Full Servicing');
  const [nbDate, setNbDate] = useState('');
  const [nbNotes, setNbNotes] = useState('');

  // Direct Invoice Form State
  const [diCustomer, setDiCustomer] = useState('');
  const [diDesc, setDiDesc] = useState('');
  const [diType, setDiType] = useState<InvoiceType>('Normal');

  const customers = users.filter(u => u.role === 'customer');
  const subtotal = invoiceItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // --- Handlers ---

  const addInvoiceItem = () => setInvoiceItems([...invoiceItems, { id: Date.now().toString(), description: '', amount: 0 }]);
  const removeInvoiceItem = (id: string) => setInvoiceItems(invoiceItems.filter(i => i.id !== id));
  const updateInvoiceItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceItems(invoiceItems.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const handleManageClick = (booking: ServiceBooking) => {
    setSelectedBooking(booking);
    setIsEditingInvoice(false);
    setEditingInvoiceId(null);
    setInvoiceType('Normal');
    setPaidAmount(0);
    setInvoiceItems([{ id: Date.now().toString(), description: '', amount: 0 }]);
    setCustomMessage('');
  };

  const handleEditBookingInvoice = (invoice: Invoice) => {
    setIsEditingInvoice(true);
    setEditingInvoiceId(invoice.id);
    setInvoiceType(invoice.type);
    setPaidAmount(invoice.paid);
    setPaymentMethod(invoice.paymentMethod || 'Cash');
    setInvoiceItems(invoice.items.length > 0 ? invoice.items : [{ id: Date.now().toString(), description: '', amount: 0 }]);
  };

  const handleCreateBookingInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || subtotal <= 0) return alert('Please add items to the invoice');

    const vatAmount = invoiceType === 'VAT' ? subtotal * 0.13 : 0;
    const total = subtotal + vatAmount;
    const actualPaid = Math.min(paidAmount, total);
    const remaining = total - actualPaid;
    const status = remaining <= 0 ? 'Paid' : 'Pending';

    if (editingInvoiceId) {
      updateInvoice(editingInvoiceId, {
        items: invoiceItems,
        total, paid: actualPaid, remaining, type: invoiceType, status,
        paymentMethod: actualPaid > 0 ? paymentMethod : undefined
      });
    } else {
      addInvoice({
        bookingId: selectedBooking.id,
        customerId: selectedBooking.customerId,
        items: invoiceItems,
        total, paid: actualPaid, remaining, type: invoiceType, status,
        paymentMethod: actualPaid > 0 ? paymentMethod : undefined,
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsEditingInvoice(false);
    setEditingInvoiceId(null);
  };

  const handleCreateNewBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nbCustomer || !nbVehicle || !nbDate) return;
    
    addBooking({
      customerId: nbCustomer,
      vehicleId: nbVehicle,
      type: nbType,
      date: nbDate,
      notes: nbNotes,
      status: 'Pending'
    });
    
    setIsNewBookingModalOpen(false);
    setNbCustomer(''); setNbVehicle(''); setNbDate(''); setNbNotes('');
  };

  const handleOpenNewDirectInvoice = () => {
    setEditingInvoiceId(null);
    setDiCustomer('');
    setDiDesc('');
    setDiType('Normal');
    setPaidAmount(0);
    setPaymentMethod('Cash');
    setInvoiceItems([{ id: Date.now().toString(), description: '', amount: 0 }]);
    setIsDirectInvoiceModalOpen(true);
  };

  const handleEditDirectInvoice = (invoice: Invoice) => {
    setEditingInvoiceId(invoice.id);
    setDiCustomer(invoice.customerId);
    setDiDesc(invoice.description || '');
    setDiType(invoice.type);
    setPaidAmount(invoice.paid);
    setPaymentMethod(invoice.paymentMethod || 'Cash');
    setInvoiceItems(invoice.items.length > 0 ? invoice.items : [{ id: Date.now().toString(), description: '', amount: 0 }]);
    setIsDirectInvoiceModalOpen(true);
  };

  const handleCreateDirectInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diCustomer || !diDesc || subtotal <= 0) return;

    const vatAmount = diType === 'VAT' ? subtotal * 0.13 : 0;
    const total = subtotal + vatAmount;
    const actualPaid = Math.min(paidAmount, total);
    const remaining = total - actualPaid;
    const status = remaining <= 0 ? 'Paid' : 'Pending';

    if (editingInvoiceId) {
      updateInvoice(editingInvoiceId, {
        customerId: diCustomer,
        description: diDesc,
        items: invoiceItems,
        total, paid: actualPaid, remaining, type: diType, status,
        paymentMethod: actualPaid > 0 ? paymentMethod : undefined
      });
    } else {
      addInvoice({
        customerId: diCustomer,
        description: diDesc,
        items: invoiceItems,
        total, paid: actualPaid, remaining, type: diType, status,
        paymentMethod: actualPaid > 0 ? paymentMethod : undefined,
        date: new Date().toISOString().split('T')[0]
      });
      addNotification(diCustomer, `A new direct invoice of ${formatNPR(total)} has been generated for: ${diDesc}.`);
    }
    
    setIsDirectInvoiceModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex space-x-2 bg-slate-200 p-1 rounded-xl w-full sm:w-auto">
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'bookings' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setActiveTab('bookings')}
          >
            Service Bookings
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'invoices' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setActiveTab('invoices')}
          >
            All Invoices
          </button>
        </div>
        
        <div className="w-full sm:w-auto">
          {activeTab === 'bookings' ? (
            <Button onClick={() => setIsNewBookingModalOpen(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> New Booking
            </Button>
          ) : (
            <Button onClick={handleOpenNewDirectInvoice} className="w-full sm:w-auto" variant="success">
              <Receipt className="w-4 h-4 mr-2" /> Create Direct Invoice
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            {activeTab === 'bookings' ? (
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
                          <Button size="sm" onClick={() => handleManageClick(booking)}>Manage</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
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
                          <Button size="sm" variant="outline" onClick={() => handleEditDirectInvoice(invoice)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals - Integrated Logic */}
      <Modal 
        isOpen={!!selectedBooking} 
        onClose={() => setSelectedBooking(null)} 
        title={`Manage Service: ${selectedBooking?.type}`}
      >
        {selectedBooking && (() => {
          const customer = users.find(u => u.id === selectedBooking.customerId);
          const invoice = invoices.find(i => i.bookingId === selectedBooking.id);
          const currentTotal = invoiceType === 'VAT' ? subtotal * 1.13 : subtotal;
          const currentRemaining = Math.max(0, currentTotal - paidAmount);

          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 flex items-center"><FileText className="w-4 h-4 mr-2 text-blue-600"/> Service Details</h4>
                  <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
                    <p><span className="text-slate-500 font-medium">Customer:</span> {customer?.name}</p>
                    <p><span className="text-slate-500 font-medium">Phone:</span> {customer?.phone}</p>
                    <p><span className="text-slate-500 font-medium">Vehicle:</span> {vehicles.find(v => v.id === selectedBooking.vehicleId)?.model}</p>
                  </div>
                  <Select 
                    label="Update Status"
                    value={selectedBooking.status}
                    onChange={(e) => updateBookingStatus(selectedBooking.id, e.target.value as any)}
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
                  <Button size="sm" onClick={() => { addNotification(selectedBooking.customerId, customMessage); setCustomMessage(''); }} disabled={!customMessage.trim()}>Send Notification</Button>
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
                       <Button variant="secondary" size="sm" onClick={() => handleEditBookingInvoice(invoice)}>Edit</Button>
                       <Button variant="outline" size="sm">Print</Button>
                     </div>
                   </div>
                ) : (
                  <form onSubmit={handleCreateBookingInvoice} className="space-y-4">
                    <div className="space-y-2">
                      {invoiceItems.map((item) => (
                        <div key={item.id} className="flex space-x-2">
                          <input className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Work Description" value={item.description} onChange={e => updateInvoiceItem(item.id, 'description', e.target.value)} required />
                          <input className="w-24 sm:w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" type="number" placeholder="Amount" value={item.amount || ''} onChange={e => updateInvoiceItem(item.id, 'amount', Number(e.target.value))} required min="0" />
                          <Button type="button" variant="danger" size="sm" onClick={() => removeInvoiceItem(item.id)} disabled={invoiceItems.length === 1}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={addInvoiceItem} className="w-full">+ Add Item</Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Select label="Invoice Type" value={invoiceType} onChange={e => setInvoiceType(e.target.value as any)} options={[{value:'Normal', label:'Normal'}, {value:'VAT', label:'VAT (+13%)'}]} />
                      <div className="bg-blue-50 p-3 rounded-xl text-right">
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Total Amount</p>
                        <p className="text-xl font-black text-blue-900">{formatNPR(currentTotal)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <Input label="Amount Paid" type="number" value={paidAmount || ''} onChange={e => setPaidAmount(Number(e.target.value))} />
                       <Select label="Method" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)} options={[{value:'Cash', label:'Cash'}, {value:'QR', label:'QR'}, {value:'Bank Transfer', label:'Bank'}]} />
                    </div>
                    <Button type="submit" className="w-full" variant="success">{isEditingInvoice ? 'Save Changes' : 'Generate Invoice'}</Button>
                  </form>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* New Booking Modal */}
      <Modal isOpen={isNewBookingModalOpen} onClose={() => setIsNewBookingModalOpen(false)} title="Create New Booking">
        <form onSubmit={handleCreateNewBooking} className="space-y-4">
          <Select 
            label="Select Customer"
            value={nbCustomer}
            onChange={e => { setNbCustomer(e.target.value); setNbVehicle(''); }}
            options={[{ value: '', label: '-- Select Customer --' }, ...customers.map(c => ({ value: c.id, label: `${c.name} (${c.phone})` }))]}
            required
          />
          <Select 
            label="Select Vehicle"
            value={nbVehicle}
            onChange={e => setNbVehicle(e.target.value)}
            disabled={!nbCustomer}
            options={[{ value: '', label: '-- Select Vehicle --' }, ...vehicles.filter(v => v.customerId === nbCustomer).map(v => ({ value: v.id, label: `${v.model} (${v.number})` }))]}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Service Type" value={nbType} onChange={e => setNbType(e.target.value)} options={[{value:'Full Servicing', label:'Full Servicing'}, {value:'Oil Change', label:'Oil Change'}, {value:'Repair', label:'Repair'}]} />
            <Input label="Date" type="date" value={nbDate} onChange={e => setNbDate(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">Create Booking</Button>
        </form>
      </Modal>

      {/* Direct Invoice Modal */}
      <Modal isOpen={isDirectInvoiceModalOpen} onClose={() => setIsDirectInvoiceModalOpen(false)} title={editingInvoiceId ? "Edit Invoice" : "Create Direct Invoice"}>
        <form onSubmit={handleCreateDirectInvoice} className="space-y-4">
          <Select 
            label="Select Customer"
            value={diCustomer}
            onChange={e => setDiCustomer(e.target.value)}
            options={[{ value: '', label: '-- Select Customer --' }, ...customers.map(c => ({ value: c.id, label: `${c.name} (${c.phone})` }))]}
            required
          />
          <Input label="Description" value={diDesc} onChange={e => setDiDesc(e.target.value)} required />
          <div className="space-y-2 pt-2 border-t border-slate-100">
             <p className="text-sm font-bold text-slate-700">Items</p>
             {invoiceItems.map((item) => (
               <div key={item.id} className="flex space-x-2">
                 <input className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Item Name" value={item.description} onChange={e => updateInvoiceItem(item.id, 'description', e.target.value)} required />
                 <input className="w-24 sm:w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" type="number" placeholder="Amount" value={item.amount || ''} onChange={e => updateInvoiceItem(item.id, 'amount', Number(e.target.value))} required min="0" />
                 <Button type="button" variant="danger" size="sm" onClick={() => removeInvoiceItem(item.id)} disabled={invoiceItems.length === 1}><Trash2 className="w-4 h-4" /></Button>
               </div>
             ))}
             <Button type="button" variant="outline" size="sm" onClick={addInvoiceItem} className="w-full">+ Add Item</Button>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <Select label="Type" value={diType} onChange={e => setDiType(e.target.value as any)} options={[{value:'Normal', label:'Normal'}, {value:'VAT', label:'VAT (+13%)'}]} />
            <div className="bg-emerald-50 p-3 rounded-xl text-right">
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Total</p>
              <p className="text-xl font-black text-emerald-900">{formatNPR(diType === 'VAT' ? subtotal * 1.13 : subtotal)}</p>
            </div>
          </div>
          <Button type="submit" className="w-full" variant="success">Save Invoice</Button>
        </form>
      </Modal>
    </div>
  );
};
