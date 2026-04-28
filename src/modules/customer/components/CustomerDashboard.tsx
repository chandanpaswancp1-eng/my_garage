import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardHeader, CardContent, Button, Badge, formatNPR, Modal } from '../../../components/UI';
import { Car, CheckCircle2, Clock, ChevronRight, QrCode, Building, AlertCircle } from 'lucide-react';

import { Link } from 'react-router-dom';

export const CustomerDashboard: React.FC = () => {
  const { currentUser, vehicles, bookings, invoices, updateInvoice, updateVehicle } = useApp();
  const [kmInput, setKmInput] = useState('');
  
  if (!currentUser) return null;

  const myVehicles = vehicles.filter(v => v.customerId === currentUser.id);
  const myBookings = bookings.filter(b => b.customerId === currentUser.id);
  const activeBooking = myBookings.find(b => b.status !== 'Completed');
  const myInvoices = invoices.filter(i => i.customerId === currentUser.id);
  const pendingInvoices = myInvoices.filter(i => i.status !== 'Paid');
  const totalPendingPayment = pendingInvoices.reduce((sum, inv) => sum + inv.remaining, 0);

  // Service Due Logic
  const today = new Date();
  today.setHours(0,0,0,0);
  const vehiclesDue = myVehicles.filter(v => v.nextService && new Date(v.nextService) <= today);

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
          paymentMethod: paymentMethod,
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

  const vehicle = myVehicles[0]; // Assuming primary vehicle for dashboard

  return (
    <div className="space-y-8">
      {/* Service Due Alert */}
      {vehiclesDue.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-amber-900 text-lg">Service Due!</p>
              <p className="text-amber-700 text-sm">
                Your <span className="font-bold">{vehiclesDue.map(v => v.model).join(', ')}</span> {vehiclesDue.length > 1 ? 'are' : 'is'} due for maintenance.
              </p>
            </div>
          </div>
          <Link to="/book">
            <Button variant="warning" size="sm">
              Schedule Now <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}
      
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
            {vehicle ? (
              <div className="space-y-5">
                <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-3 bg-white rounded-lg shadow-sm mr-4 flex-shrink-0">
                    <Car className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-lg text-slate-900 truncate">{vehicle.model}</p>
                    <Badge variant="info">{vehicle.number}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Last Service</p>
                    <p className="font-semibold text-slate-900">{vehicle.lastService ?? 'N/A'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Next Service Date</p>
                    <p className="font-semibold text-slate-900">{vehicle.nextService ?? 'N/A'}</p>
                  </div>
                </div>

                {vehicle.nextServiceKM && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${(vehicle.nextServiceKM - (vehicle.currentKM || 0)) <= 0 ? 'bg-red-500 animate-ping' : (vehicle.nextServiceKM - (vehicle.currentKM || 0)) <= 500 ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Service Progress</span>
                      </div>
                      <span className={`text-xs font-black uppercase tracking-tighter ${
                        (vehicle.nextServiceKM - (vehicle.currentKM || 0)) <= 0 ? 'text-red-500' :
                        (vehicle.nextServiceKM - (vehicle.currentKM || 0)) <= 500 ? 'text-amber-500' : 'text-emerald-600'
                      }`}>
                        {(vehicle.nextServiceKM - (vehicle.currentKM || 0)) <= 0 ? 'Overdue!' : 
                         `${vehicle.nextServiceKM - (vehicle.currentKM || 0)} KM Left`}
                      </span>
                    </div>
                    <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-inner">
                      <div 
                        className={`h-full transition-all duration-1000 rounded-full ${
                          (vehicle.nextServiceKM - (vehicle.currentKM || 0)) <= 0 ? 'bg-gradient-to-r from-red-600 to-red-400' :
                          (vehicle.nextServiceKM - (vehicle.currentKM || 0)) <= 500 ? 'bg-gradient-to-r from-amber-500 to-amber-300' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, ((vehicle.currentKM || 0) / vehicle.nextServiceKM) * 100))}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>{vehicle.currentKM || 0} KM (Current)</span>
                      <span>{vehicle.nextServiceKM} KM (Target)</span>
                    </div>
                  </div>
                )}
                
                <div className="bg-white p-5 rounded-2xl border-2 border-blue-100 mt-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Update Current Mileage</p>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <input 
                        type="number" 
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-blue-500 focus:bg-white transition-all" 
                        placeholder="Enter Odometer Reading"
                        value={kmInput}
                        onChange={(e) => setKmInput(e.target.value)}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KM</span>
                    </div>
                    <Button 
                      className="px-6 rounded-xl shadow-lg shadow-blue-500/20"
                      onClick={() => {
                        if (kmInput && !isNaN(Number(kmInput))) {
                          updateVehicle(vehicle.id, { currentKM: Number(kmInput) });
                          setKmInput('');
                        }
                      }}
                    >
                      Update
                    </Button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">Keep your mileage updated for accurate service reminders.</p>
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
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-white/10">
            <h3 className="text-base font-semibold text-white tracking-tight">Payment Summary</h3>
          </div>
          <div className="p-6 flex flex-col flex-1">
            <div className="py-2 flex-1">
              <p className="text-slate-400 font-medium mb-2 uppercase tracking-wider text-xs">Total Pending Dues</p>
              <p className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${totalPendingPayment > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {formatNPR(totalPendingPayment)}
              </p>
            </div>
            {totalPendingPayment > 0 ? (
              <button
                className="w-full mt-6 py-3 px-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center group"
                onClick={() => setShowPaymentModal(true)}
              >
                Pay Now <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="mt-6 p-3 bg-white/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-2" />
                <span className="font-medium text-emerald-50">All dues cleared</span>
              </div>
            )}
          </div>
        </div>
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
