import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layout } from '../../components/LayoutShell';
import { Card, CardHeader, CardContent, Button, Badge, formatNPR, Input, Select, Modal } from '../../components/UI';
import {
  LayoutDashboard, CalendarPlus, Wrench, History, Car, CheckCircle2,
  Clock, Download, ChevronRight, QrCode, Building, Banknote, Package,
  Landmark, Plus, Trash2, CheckCircle, Wallet
} from 'lucide-react';
import { Invoice, ServiceBooking, LinkedBank, LinkedWallet } from '../../types';

// ==================== Payment Settings ====================

const PaymentSettings: React.FC = () => {
  const { currentUser, linkBank, unlinkBank, linkWallet, unlinkWallet } = useApp();
  const [showAddBank, setShowAddBank] = useState(false);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [newBank, setNewBank] = useState({ bankName: '', accountHolder: '', accountNumber: '', isDefault: false });
  const [newWallet, setNewWallet] = useState({ provider: 'eSewa' as LinkedWallet['provider'], phone: '', isDefault: false });

  const handleLinkBank = (e: React.FormEvent) => {
    e.preventDefault();
    linkBank(currentUser.id, newBank);
    setShowAddBank(false);
    setNewBank({ bankName: '', accountHolder: '', accountNumber: '', isDefault: false });
  };

  const handleLinkWallet = (e: React.FormEvent) => {
    e.preventDefault();
    linkWallet(currentUser.id, newWallet);
    setShowAddWallet(false);
    setNewWallet({ provider: 'eSewa', phone: '', isDefault: false });
  };

  return (
    <div className="space-y-10 fade-in-up">
      {/* Linked Banks Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Bank Accounts</h2>
            <p className="text-sm text-slate-500">Manage your linked bank accounts for secure payments.</p>
          </div>
          <Button onClick={() => setShowAddBank(true)}>
            <Plus className="w-4 h-4 mr-2" /> Link Bank
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentUser.linkedBanks?.map((bank: LinkedBank) => (
            <Card key={bank.id} className="relative group border-slate-200 hover:border-primary/50 transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Landmark className="w-6 h-6 text-primary" />
                  </div>
                  <button onClick={() => unlinkBank(currentUser.id, bank.id)} className="text-slate-300 hover:text-red-500 p-1">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-900">{bank.bankName}</p>
                  <p className="text-sm text-slate-500 font-medium mb-4">{bank.accountNumber.replace(/.(?=.{4})/g, '*')}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{bank.accountHolder}</p>
                    {bank.isDefault && <Badge variant="success">Default</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!currentUser.linkedBanks || currentUser.linkedBanks.length === 0) && (
            <div className="md:col-span-2 py-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400">No bank accounts linked.</p>
            </div>
          )}
        </div>
      </section>

      {/* Linked Wallets Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Digital Wallets</h2>
            <p className="text-sm text-slate-500">Fast and easy payments via mobile wallets.</p>
          </div>
          <Button variant="outline" onClick={() => setShowAddWallet(true)}>
            <Plus className="w-4 h-4 mr-2" /> Link Wallet
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentUser.linkedWallets?.map((wallet: LinkedWallet) => (
            <Card key={wallet.id} className="relative group border-slate-200 hover:border-amber-500/50 transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-amber-50 rounded-xl">
                    <Wallet className="w-6 h-6 text-amber-600" />
                  </div>
                  <button onClick={() => unlinkWallet(currentUser.id, wallet.id)} className="text-slate-300 hover:text-red-500 p-1">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-900">{wallet.provider}</p>
                  <p className="text-sm text-slate-500 font-medium mb-4">{wallet.phone.replace(/.(?=.{3})/g, '*')}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="info">Wallet</Badge>
                    {wallet.isDefault && <Badge variant="success">Default</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!currentUser.linkedWallets || currentUser.linkedWallets.length === 0) && (
            <div className="md:col-span-2 py-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400">No wallets linked.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      <Modal isOpen={showAddBank} onClose={() => setShowAddBank(false)} title="Link Bank Account">
        <form onSubmit={handleLinkBank} className="space-y-4">
          <Input label="Bank Name" required value={newBank.bankName} onChange={e => setNewBank({ ...newBank, bankName: e.target.value })} />
          <Input label="Account Holder" required value={newBank.accountHolder} onChange={e => setNewBank({ ...newBank, accountHolder: e.target.value })} />
          <Input label="Account Number" required value={newBank.accountNumber} onChange={e => setNewBank({ ...newBank, accountNumber: e.target.value })} />
          <div className="flex items-center gap-2"><input type="checkbox" checked={newBank.isDefault} onChange={e => setNewBank({ ...newBank, isDefault: e.target.checked })} /> Set as default</div>
          <Button type="submit" className="w-full">Link Account</Button>
        </form>
      </Modal>

      <Modal isOpen={showAddWallet} onClose={() => setShowAddWallet(false)} title="Link Digital Wallet">
        <form onSubmit={handleLinkWallet} className="space-y-4">
          <Select 
            label="Provider" 
            options={[{ label: 'eSewa', value: 'eSewa' }, { label: 'Khalti', value: 'Khalti' }, { label: 'IME Pay', value: 'IME Pay' }]} 
            value={newWallet.provider} 
            onChange={val => setNewWallet({ ...newWallet, provider: val as LinkedWallet['provider'] })} 
          />
          <Input label="Phone Number" required value={newWallet.phone} onChange={e => setNewWallet({ ...newWallet, phone: e.target.value })} />
          <div className="flex items-center gap-2"><input type="checkbox" checked={newWallet.isDefault} onChange={e => setNewWallet({ ...newWallet, isDefault: e.target.checked })} /> Set as default</div>
          <Button type="submit" className="w-full">Link Wallet</Button>
        </form>
      </Modal>
    </div>
  );
};

// ==================== Customer Dashboard ====================

const CustomerDashboard: React.FC = () => {
  const { currentUser, vehicles, bookings, invoices, updateInvoice } = useApp();
  const myVehicles = vehicles.filter(v => v.customerId === currentUser.id);
  const myBookings = bookings.filter(b => b.customerId === currentUser.id);
  const activeBooking = myBookings.find(b => b.status !== 'Completed');
  const myInvoices = invoices.filter(i => i.customerId === currentUser.id);
  const pendingInvoices = myInvoices.filter(i => i.status !== 'Paid');
  const totalPendingPayment = pendingInvoices.reduce((sum, inv) => sum + inv.remaining, 0);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'eSewa' | 'Bank Transfer' | 'QR'>('eSewa');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      pendingInvoices.forEach(inv => {
        updateInvoice(inv.id, {
          paid: inv.total,
          remaining: 0,
          status: 'Paid',
          paymentMethod: paymentMethod, // Fix: Use the selected payment method directly
        });
      });
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        setShowPaymentModal(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back, {currentUser.name.split(' ')[0]}!
        </h2>
        <p className="text-slate-500 mt-1">Here is the latest update on your vehicles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vehicle Info */}
        <Card className="border-t-4 border-t-blue-600">
          <CardHeader title="My Vehicle" />
          <CardContent>
            {myVehicles.length > 0 ? (
              <div className="space-y-5">
                <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-3 bg-white rounded-lg shadow-sm mr-4 flex-shrink-0">
                    <Car className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-lg text-slate-900 truncate">{myVehicles[0].model}</p>
                    <Badge variant="info">{myVehicles[0].number}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Last Service</p>
                    <p className="font-semibold text-slate-900">{myVehicles[0].lastService ?? 'N/A'}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                    <p className="text-xs text-red-500 font-medium uppercase tracking-wider mb-1">Next Due</p>
                    <p className="font-bold text-red-700">{myVehicles[0].nextService ?? 'N/A'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No vehicles registered.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Service */}
        <Card className="border-t-4 border-t-amber-500">
          <CardHeader title="Active Service" />
          <CardContent>
            {activeBooking ? (
              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg text-slate-900">{activeBooking.type}</p>
                    <p className="text-sm text-slate-500 font-medium flex items-center mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(activeBooking.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={activeBooking.status === 'In Progress' ? 'warning' : 'info'}>
                    {activeBooking.status}
                  </Badge>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Mechanic Notes</p>
                  <p className="text-sm text-amber-900">{activeBooking.mechanicNotes ?? 'Inspection in progress. No notes yet.'}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="text-slate-600 font-medium">Your vehicle is good to go!</p>
                <p className="text-sm text-slate-400 mt-1">No active services.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
          <CardHeader title={<span className="text-white">Payment Summary</span>} />
          <CardContent>
            <div className="py-4">
              <p className="text-slate-400 font-medium mb-2 uppercase tracking-wider text-sm">Total Pending Dues</p>
              <p className={`text-4xl font-extrabold tracking-tight ${totalPendingPayment > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {formatNPR(totalPendingPayment)}
              </p>
            </div>
            {totalPendingPayment > 0 ? (
              <button
                className="w-full mt-4 py-3 px-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center group"
                onClick={() => setShowPaymentModal(true)}
              >
                Pay Now <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="mt-4 p-3 bg-white/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-2" />
                <span className="font-medium text-emerald-50">All dues cleared</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Modal */}
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Complete Payment">
        {paymentSuccess ? (
          <div className="py-12 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h3>
            <p className="text-slate-500">Thank you for your payment of {formatNPR(totalPendingPayment)}.</p>
          </div>
        ) : (
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Amount to Pay</p>
              <p className="text-3xl font-extrabold text-slate-900">{formatNPR(totalPendingPayment)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { id: 'eSewa', label: 'eSewa', color: 'green', icon: <span className="font-bold text-green-600 text-lg">e</span> },
                  { id: 'Bank Transfer', label: 'Bank Transfer', color: 'blue', icon: <Building className="w-5 h-5 text-blue-600" /> },
                  { id: 'QR', label: 'Scan QR', color: 'purple', icon: <QrCode className="w-5 h-5 text-purple-600" /> },
                ] as const).map(m => (
                  <div
                    key={m.id}
                    className={`border-2 rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center transition-all ${paymentMethod === m.id ? `border-${m.color}-500 bg-${m.color}-50` : 'border-slate-200 hover:border-slate-300'}`}
                    onClick={() => setPaymentMethod(m.id)}
                  >
                    <div className={`w-10 h-10 bg-${m.color}-100 rounded-full flex items-center justify-center mb-2`}>{m.icon}</div>
                    <span className="font-semibold text-slate-800 text-center text-sm">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {paymentMethod === 'eSewa' && (
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-sm text-green-800">
                You will be redirected to the eSewa portal to complete your transaction securely.
              </div>
            )}
            {paymentMethod === 'Bank Transfer' && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 space-y-1">
                <p className="font-semibold">Bank Details:</p>
                <p>Bank: Global IME Bank</p>
                <p>Account Name: Sewa Automobile Pvt. Ltd.</p>
                <p>Account No: 01234567890123</p>
                <p>Branch: Kantipath</p>
              </div>
            )}
            {paymentMethod === 'QR' && (
              <div className="flex flex-col items-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-48 h-48 bg-white p-2 rounded-lg shadow-sm border border-slate-200 flex items-center justify-center mb-4">
                  <QrCode className="w-32 h-32 text-slate-800" />
                </div>
                <p className="text-sm text-slate-600 text-center">Scan with Fonepay, eSewa, Khalti, or any banking app.</p>
              </div>
            )}

            <Button type="submit" variant="success" className="w-full py-3 text-base" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : `Proceed to Pay ${formatNPR(totalPendingPayment)}`}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};

// ==================== Book Service Form ====================

const ServiceBookingForm: React.FC = () => {
  const { currentUser, vehicles, addBooking } = useApp();
  const myVehicles = vehicles.filter(v => v.customerId === currentUser.id);
  const [type, setType] = useState('Full Servicing');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (myVehicles.length === 0) return alert('No vehicle registered. Please contact the garage to register your vehicle.');
    addBooking({ customerId: currentUser.id, vehicleId: myVehicles[0].id, type, date, notes, status: 'Pending' });
    setSuccess(true);
    setDate('');
    setNotes('');
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader title="Book a Service Appointment" />
        <CardContent>
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center">
              <CheckCircle2 className="w-6 h-6 mr-3 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="font-bold">Booking successful!</p>
                <p className="text-sm mt-0.5">We will contact you shortly to confirm.</p>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select
              label="Service Type"
              value={type}
              onChange={e => setType(e.target.value)}
              options={[
                { value: 'Full Servicing', label: 'Full Servicing' },
                { value: 'Oil Change', label: 'Oil Change' },
                { value: 'Brake Inspection', label: 'Brake Inspection' },
                { value: 'Tyre Rotation', label: 'Tyre Rotation' },
                { value: 'Wheel Alignment', label: 'Wheel Alignment' },
                { value: 'AC Service', label: 'AC Service' },
                { value: 'General Repair', label: 'General Repair' },
              ]}
            />
            <Input label="Preferred Date & Time" type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Additional Notes</label>
              <textarea
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all text-sm"
                rows={4}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Describe any specific issues, weird noises, etc..."
              />
            </div>
            <Button type="submit" className="w-full py-3 text-base">Confirm Booking</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// ==================== Parts Catalog ====================

const PartsCatalog: React.FC = () => {
  const { parts } = useApp();
  const [search, setSearch] = useState('');
  const filtered = parts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Spare Parts Catalog</h2>
        <div className="w-full sm:w-72">
          <Input placeholder="Search parts..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(part => (
          <Card key={part.id} className="hover:-translate-y-1 transition-transform duration-300">
            <div className="h-40 bg-slate-50 border-b border-slate-100 flex items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center">
                <Wrench className="w-10 h-10 text-slate-300" />
              </div>
            </div>
            <CardContent className="p-5">
              <Badge variant="default" className="mb-3">{part.category}</Badge>
              <h4 className="font-bold text-slate-900 text-lg leading-tight mb-1 truncate" title={part.name}>{part.name}</h4>
              <div className="flex justify-between items-end mt-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Price</p>
                  <span className="font-extrabold text-blue-600 text-xl">{formatNPR(part.price)}</span>
                </div>
                <Badge variant={part.stock > 0 ? 'success' : 'danger'}>{part.stock > 0 ? 'In Stock' : 'Out of Stock'}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium text-lg">No parts found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== Invoice Downloader ====================

const downloadInvoice = (invoice: Invoice, booking?: ServiceBooking) => {
  const items = invoice.items ?? [];
  const subtotal = items.reduce((s, i) => s + Number(i.amount), 0);
  const vatAmount = invoice.type === 'VAT' ? Math.round(subtotal * 0.13) : 0;
  let content = `SEWA AUTOMOBILE - INVOICE\n`;
  content += `========================================\n`;
  content += `Invoice ID: #${invoice.id}\nDate: ${new Date(invoice.date).toLocaleDateString()}\n`;
  content += `Type: ${invoice.type} Invoice\nStatus: ${invoice.status}\n`;
  if (booking) content += `Service: ${booking.type}\n`;
  content += `========================================\nWork Details:\n`;
  if (items.length > 0) {
    items.forEach(i => { content += `- ${i.description}: ${formatNPR(i.amount)}\n`; });
  } else { content += `- General Service: ${formatNPR(invoice.total)}\n`; }
  content += `----------------------------------------\nSubtotal: ${formatNPR(subtotal)}\n`;
  if (invoice.type === 'VAT') content += `VAT (13%): ${formatNPR(vatAmount)}\n`;
  content += `Total: ${formatNPR(invoice.total)}\n========================================\nThank you for your business!\n`;
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
  const a = document.createElement('a'); a.href = url; a.download = `Invoice_${invoice.id}.txt`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ==================== Service History ====================

const ServiceHistory: React.FC = () => {
  const { currentUser, bookings, invoices } = useApp();
  const myBookings = bookings
    .filter(b => b.customerId === currentUser.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Service History</h2>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {myBookings.map(booking => {
              const invoice = invoices.find(i => i.bookingId === booking.id);
              return (
                <div key={booking.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 hover:bg-slate-50 transition-colors">
                  <div className="mb-4 md:mb-0 flex items-start">
                    <div className="p-3 bg-blue-50 rounded-xl mr-4 hidden sm:block flex-shrink-0">
                      <History className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <h4 className="font-bold text-lg text-slate-900">{booking.type}</h4>
                        <Badge variant={booking.status === 'Completed' ? 'success' : 'warning'}>{booking.status}</Badge>
                      </div>
                      <p className="text-sm text-slate-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1.5" /> {formatNepaliDate(booking.date)}
                      </p>
                    </div>
                  </div>
                  {invoice && (
                    <div className="text-left md:text-right w-full md:w-auto bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-xl">
                      <p className="font-extrabold text-slate-900 text-xl">{formatNPR(invoice.total)}</p>
                      <div className="flex items-center md:justify-end mt-1 mb-3 gap-2">
                        <span className="text-sm text-slate-500">Status:</span>
                        <Badge variant={invoice.status === 'Paid' ? 'success' : 'danger'}>{invoice.status}</Badge>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => downloadInvoice(invoice, booking)} className="w-full md:w-auto">
                        <Download className="w-4 h-4 mr-2" /> Download Invoice
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
            {myBookings.length === 0 && (
              <div className="p-12 text-center">
                <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-lg">No service history found.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ==================== Payment History ====================

const PaymentHistoryPanel: React.FC = () => {
  const { currentUser, invoices } = useApp();
  const myInvoices = invoices
    .filter(i => i.customerId === currentUser.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Payment History</h2>
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
                  <Button variant="outline" size="sm" onClick={() => downloadInvoice(invoice)} className="w-full md:w-auto">
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

// ==================== CustomerApp Shell ====================

const customerSidebar = [
  { id: 'dashboard', label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'book',      label: 'Book Service',    icon: CalendarPlus },
  { id: 'parts',     label: 'Spare Parts',     icon: Wrench },
  { id: 'history',   label: 'Service History', icon: History },
  { id: 'payments',  label: 'Payment History', icon: Banknote },
  { id: 'bank',      label: 'Payment Settings', icon: Landmark },
];

export const CustomerApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <CustomerDashboard />;
      case 'book':      return <ServiceBookingForm />;
      case 'parts':     return <PartsCatalog />;
      case 'history':   return <ServiceHistory />;
      case 'payments':  return <PaymentHistoryPanel />;
      case 'bank':      return <PaymentSettings />;
      default:          return <CustomerDashboard />;
    }
  };

  return (
    <Layout sidebarItems={customerSidebar} activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};
