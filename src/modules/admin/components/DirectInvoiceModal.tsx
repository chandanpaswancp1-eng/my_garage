import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, Input, formatNPR } from '../../../components/UI';
import { Trash2 } from 'lucide-react';
import { User, Invoice, InvoiceItem, InvoiceType, PaymentType } from '../../../types';
import { calculateTotalWithVAT } from '../../../utils/finance';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  customers: User[];
  addInvoice: (invoice: any) => void;
  updateInvoice: (id: string, invoice: any) => void;
  addNotification: (userId: string, message: string) => void;
}

export const DirectInvoiceModal: React.FC<Props> = ({ 
  isOpen, onClose, invoice, customers, addInvoice, updateInvoice, addNotification 
}) => {
  const [diCustomer, setDiCustomer] = useState('');
  const [diDesc, setDiDesc] = useState('');
  const [diType, setDiType] = useState<InvoiceType>('Normal');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([{ id: Date.now().toString(), description: '', amount: 0 }]);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>('Cash');

  useEffect(() => {
    if (invoice) {
      setDiCustomer(invoice.customerId);
      setDiDesc(invoice.description || '');
      setDiType(invoice.type);
      setInvoiceItems(invoice.items.length > 0 ? invoice.items : [{ id: Date.now().toString(), description: '', amount: 0 }]);
      setPaidAmount(invoice.paid);
      setPaymentMethod(invoice.paymentMethod || 'Cash');
    } else {
      setDiCustomer('');
      setDiDesc('');
      setDiType('Normal');
      setInvoiceItems([{ id: Date.now().toString(), description: '', amount: 0 }]);
      setPaidAmount(0);
      setPaymentMethod('Cash');
    }
  }, [invoice, isOpen]);

  const subtotal = invoiceItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const total = calculateTotalWithVAT(subtotal, diType === 'VAT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diCustomer || !diDesc || subtotal <= 0) return;

    const actualPaid = Math.min(paidAmount, total);
    const remaining = total - actualPaid;
    const status = remaining <= 0 ? 'Paid' : 'Pending';

    if (invoice) {
      updateInvoice(invoice.id, {
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
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={invoice ? "Edit Invoice" : "Create Direct Invoice"}>
      <form onSubmit={handleSubmit} className="space-y-4">
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
               <input className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Item Name" value={item.description} onChange={e => setInvoiceItems(invoiceItems.map(i => i.id === item.id ? {...i, description: e.target.value} : i))} required />
               <input className="w-24 sm:w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" type="number" step="0.01" placeholder="Amount" value={item.amount || ''} onChange={e => setInvoiceItems(invoiceItems.map(i => i.id === item.id ? {...i, amount: Number(e.target.value)} : i))} required min="0" />
               <Button type="button" variant="danger" size="sm" onClick={() => setInvoiceItems(invoiceItems.filter(i => i.id !== item.id))} disabled={invoiceItems.length === 1}><Trash2 className="w-4 h-4" /></Button>
             </div>
           ))}
           <Button type="button" variant="outline" size="sm" onClick={() => setInvoiceItems([...invoiceItems, { id: Date.now().toString(), description: '', amount: 0 }])} className="w-full">+ Add Item</Button>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <Select label="Type" value={diType} onChange={e => setDiType(e.target.value as any)} options={[{value:'Normal', label:'Normal'}, {value:'VAT', label:'VAT (+13%)'}, {value:'Special', label:'Special Bill'}]} />
          <div className="bg-emerald-50 p-3 rounded-xl text-right">
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Total</p>
            <p className="text-xl font-black text-emerald-900">{formatNPR(total)}</p>
          </div>
        </div>
        <Button type="submit" className="w-full" variant="success">Save Invoice</Button>
      </form>
    </Modal>
  );
};
