import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Card, CardContent, Button } from '../../../components/UI';
import { Plus, Receipt, Download } from 'lucide-react';
import { ServiceBooking, Invoice } from '../../../types';
import { exportToExcel } from '../../../utils/exportUtils';

// Modular Components
import { BookingTable } from '../components/BookingTable';
import { InvoiceTable } from '../components/InvoiceTable';
import { ManageBookingModal } from '../components/ManageBookingModal';
import { NewBookingModal } from '../components/NewBookingModal';
import { DirectInvoiceModal } from '../components/DirectInvoiceModal';

export const ServiceAndBillingManager = () => {
  const { 
    bookings, users, invoices, vehicles, settings, 
    updateBookingStatus, addInvoice, updateInvoice, addNotification, addBooking 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'bookings' | 'invoices'>('bookings');
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isDirectInvoiceModalOpen, setIsDirectInvoiceModalOpen] = useState(false);
  
  const customers = users.filter(u => u.role === 'customer');

  const exportInvoicesCSV = () => {
    const headers = ['Invoice ID', 'Date', 'Customer Name', 'Phone', 'Vehicle', 'Invoice Type', 'Payment Status', 'Sub Total (NPR)', 'VAT (13%)', 'Total Amount (NPR)', 'Amount Paid (NPR)', 'Balance Due (NPR)'];
    const rows = invoices.map(inv => {
      const customer = users.find(u => u.id === inv.customerId);
      const booking = bookings.find(b => b.id === inv.bookingId);
      const vehicle = vehicles.find(v => v.id === booking?.vehicleId);
      const vehicleInfo = vehicle ? `${vehicle.model} (${vehicle.number})` : 'N/A';
      
      const vat = inv.type === 'VAT' ? (inv.total - (inv.total / 1.13)) : 0;
      const subTotal = inv.total - vat;

      return [
        inv.id,
        inv.date,
        customer?.name || 'N/A',
        customer?.phone || 'N/A',
        vehicleInfo,
        inv.type,
        inv.status,
        subTotal.toFixed(2),
        vat.toFixed(2),
        inv.total.toFixed(2),
        inv.paid.toFixed(2),
        inv.remaining.toFixed(2)
      ];
    });
    exportToExcel(headers, rows, `Invoices_Report_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex space-x-2 bg-slate-200 p-1 rounded-xl w-full sm:w-auto">
          {['bookings', 'invoices'].map((tab) => (
            <button 
              key={tab}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap capitalize ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab === 'bookings' ? 'Service Bookings' : 'All Invoices'}
            </button>
          ))}
        </div>
        
        <div className="flex space-x-2 w-full sm:w-auto">
          {activeTab === 'bookings' ? (
            <Button onClick={() => setIsNewBookingModalOpen(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> New Booking
            </Button>
          ) : (
            <>
              <Button onClick={exportInvoicesCSV} variant="outline" className="flex-1 sm:flex-none">
                <Download className="w-4 h-4 mr-2" /> Excel
              </Button>
              <Button onClick={() => { setEditingInvoice(null); setIsDirectInvoiceModalOpen(true); }} variant="success" className="flex-1 sm:flex-none">
                <Receipt className="w-4 h-4 mr-2" /> Direct Invoice
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            {activeTab === 'bookings' ? (
              <BookingTable 
                bookings={bookings} 
                users={users} 
                invoices={invoices} 
                onManage={setSelectedBooking} 
              />
            ) : (
              <InvoiceTable 
                invoices={invoices} 
                users={users} 
                vehicles={vehicles} 
                bookings={bookings} 
                settings={settings} 
                onEdit={(inv) => { setEditingInvoice(inv); setIsDirectInvoiceModalOpen(true); }} 
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ManageBookingModal 
        booking={selectedBooking} 
        onClose={() => setSelectedBooking(null)} 
        users={users} 
        invoices={invoices} 
        vehicles={vehicles} 
        settings={settings} 
        updateBookingStatus={updateBookingStatus} 
        addInvoice={addInvoice} 
        updateInvoice={updateInvoice} 
        addNotification={addNotification} 
      />

      <NewBookingModal 
        isOpen={isNewBookingModalOpen} 
        onClose={() => setIsNewBookingModalOpen(false)} 
        customers={customers} 
        vehicles={vehicles} 
        addBooking={addBooking} 
      />

      <DirectInvoiceModal 
        isOpen={isDirectInvoiceModalOpen} 
        onClose={() => setIsDirectInvoiceModalOpen(false)} 
        invoice={editingInvoice} 
        customers={customers} 
        addInvoice={addInvoice} 
        updateInvoice={updateInvoice} 
        addNotification={addNotification} 
      />
    </div>
  );
};
