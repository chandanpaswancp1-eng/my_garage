import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Vehicle, ServiceBooking, Invoice, Part, Staff, Attendance, LeaveRequest, AppNotification, Holiday, Payslip, Expense, AdvanceSalaryRequest, BankTransaction, GarageSettings, LinkedBank, LinkedWallet, ActivityLog } from '../types';
import { authApi, bookingApi, apiFetch } from '../services/api';

// --- Mock Data ---
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin Owner', role: 'admin', phone: '9800000000', email: 'admin@sewa.com' },
  { id: 'u2', name: 'Ram Sharma', role: 'customer', phone: '9841000001', email: 'ram@gmail.com' },
  { id: 'u3', name: 'Hari Thapa', role: 'staff', phone: '9841000002', email: 'hari@sewa.com' },
];

const MOCK_VEHICLES: Vehicle[] = [
  { id: 'v1', customerId: 'u2', model: 'Hyundai Creta', number: 'BA 21 PA 1234', lastService: '2023-10-15', nextService: '2024-04-15' },
];

const MOCK_BOOKINGS: ServiceBooking[] = [
  { id: 'b1', customerId: 'u2', vehicleId: 'v1', type: 'Full Servicing', date: '2024-05-20T10:00', notes: 'Check brakes', status: 'In Progress', mechanicId: 'u3' },
  { id: 'b2', customerId: 'u2', vehicleId: 'v1', type: 'Oil Change', date: '2023-10-15T14:00', notes: '', status: 'Completed', mechanicId: 'u3' },
];

const MOCK_INVOICES: Invoice[] = [
  { 
    id: 'inv1', bookingId: 'b2', customerId: 'u2', 
    items: [{ id: 'i1', description: 'Engine Oil (Synthetic)', amount: 3500 }, { id: 'i2', description: 'Labor Charge', amount: 1367.25 }],
    total: 5500, paid: 5500, remaining: 0, type: 'VAT', status: 'Paid', paymentMethod: 'QR', date: '2023-10-15' 
  },
  { 
    id: 'inv2', bookingId: 'b1', customerId: 'u2', 
    items: [{ id: 'i3', description: 'Full Servicing Package', amount: 12000 }],
    total: 12000, paid: 5000, remaining: 7000, type: 'Normal', status: 'Pending', date: '2024-05-20' 
  },
];

const MOCK_PARTS: Part[] = [
  { id: 'p1', name: 'Engine Oil (Synthetic)', category: 'Fluids', price: 3500, stock: 50 },
  { id: 'p2', name: 'Brake Pads (Front)', category: 'Brakes', price: 2500, stock: 20 },
  { id: 'p3', name: 'Air Filter', category: 'Filters', price: 800, stock: 100 },
  { id: 'p4', name: 'Spark Plug', category: 'Engine', price: 450, stock: 200 },
];

const MOCK_STAFF: Staff[] = [
  { id: 'u3', name: 'Hari Thapa', role: 'staff', phone: '9841000002', position: 'Senior Mechanic', salary: 35000, joinedDate: '2021-01-10', weeklyOff: 'Saturday' },
  { id: 'u4', name: 'Sita Rai', role: 'staff', phone: '9841000003', position: 'Service Advisor', salary: 28000, joinedDate: '2022-05-15', weeklyOff: 'Saturday' },
];

const MOCK_ATTENDANCE: Attendance[] = [
  { id: 'a1', staffId: 'u3', date: new Date().toISOString().split('T')[0], checkIn: '08:55', status: 'Present' },
];

const MOCK_LEAVES: LeaveRequest[] = [
  { id: 'l1', staffId: 'u3', type: 'Annual', startDate: '2024-06-01', endDate: '2024-06-05', status: 'Approved', reason: 'Family Trip' },
  { id: 'l2', staffId: 'u3', type: 'Sick', startDate: '2024-07-10', endDate: '2024-07-11', status: 'Pending', reason: 'Fever' }
];

const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', userId: 'u2', message: 'Your vehicle service is due next week.', date: new Date().toISOString(), read: false }
];

const MOCK_HOLIDAYS: Holiday[] = [
  { id: 'h1', name: 'Nepali New Year', date: '2024-04-13' },
  { id: 'h2', name: 'Dashain (Maha Ashtami)', date: '2024-10-11' },
  { id: 'h3', name: 'Tihar (Laxmi Puja)', date: '2024-11-01' },
];

const MOCK_PAYSLIPS: Payslip[] = [
  { id: 'ps1', staffId: 'u3', month: 'April', year: 2024, basicSalary: 35000, allowance: 2000, deductions: 0, netSalary: 37000, issueDate: '2024-05-01', status: 'Paid' },
  { id: 'ps2', staffId: 'u3', month: 'May', year: 2024, basicSalary: 35000, allowance: 2000, deductions: 1000, netSalary: 36000, issueDate: '2024-06-01', status: 'Paid' },
];

const MOCK_EXPENSES: Expense[] = [
  { id: 'e1', title: 'Garage Rent (May)', amount: 45000, category: 'Rent', date: '2024-05-01' },
  { id: 'e2', title: 'Electricity Bill', amount: 4500, category: 'Utilities', date: '2024-05-10' },
];

const MOCK_ADVANCES: AdvanceSalaryRequest[] = [
  { id: 'adv1', staffId: 'u3', amountRequested: 5000, reason: 'Medical emergency', requestDate: '2024-05-15', status: 'Pending' }
];

const MOCK_TRANSACTIONS: BankTransaction[] = [
  { id: 'tx1', date: '2023-10-15', description: 'Payment for Invoice #inv1', amount: 5500, type: 'Credit', referenceId: 'inv1', source: 'System' },
  { id: 'tx2', date: '2024-05-01', description: 'Garage Rent (May)', amount: 45000, type: 'Debit', referenceId: 'e1', source: 'System' },
  { id: 'tx3', date: '2024-05-10', description: 'Electricity Bill', amount: 4500, type: 'Debit', referenceId: 'e2', source: 'System' },
  { id: 'tx4', date: '2024-05-20', description: 'Partial Payment for Invoice #inv2', amount: 5000, type: 'Credit', referenceId: 'inv2', source: 'System' },
];

// --- Context Definition ---
interface AppState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  vehicles: Vehicle[];
  bookings: ServiceBooking[];
  invoices: Invoice[];
  parts: Part[];
  staff: Staff[];
  attendance: Attendance[];
  leaves: LeaveRequest[];
  notifications: AppNotification[];
  holidays: Holiday[];
  payslips: Payslip[];
  expenses: Expense[];
  advances: AdvanceSalaryRequest[];
  transactions: BankTransaction[];
  settings: GarageSettings;
  
  // Actions
  addBooking: (booking: Omit<ServiceBooking, 'id'>) => void;
  updateBookingStatus: (id: string, status: ServiceBooking['status']) => void;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  addPart: (part: Omit<Part, 'id'>) => void;
  updatePartStock: (id: string, newStock: number) => void;
  deletePart: (id: string) => void;
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status'>) => void;
  updateLeaveStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  checkInStaff: (staffId: string) => void;
  checkOutStaff: (staffId: string) => void;
  addNotification: (userId: string, message: string) => void;
  markNotificationsRead: (userId: string) => void;
  
  // Admin Full Access Actions
  addCustomer: (customer: Omit<User, 'id' | 'role'>) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  addStaff: (staff: Omit<Staff, 'id' | 'role'>) => void;
  updateStaffWeeklyOff: (staffId: string, day: string) => void;
  addHoliday: (holiday: Omit<Holiday, 'id'>) => void;
  deleteHoliday: (id: string) => void;
  addPayslip: (payslip: Omit<Payslip, 'id'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  
  // Advance Salary Actions
  addAdvanceRequest: (request: Omit<AdvanceSalaryRequest, 'id' | 'status'>) => void;
  updateAdvanceRequest: (id: string, status: 'Approved' | 'Rejected', amountApproved?: number, adminNotes?: string) => void;

  // Bank Actions
  addTransaction: (transaction: Omit<BankTransaction, 'id'>) => void;
  updateSettings: (updates: Partial<GarageSettings>) => void;
  linkBank: (userId: string, bank: Omit<LinkedBank, 'id'>) => void;
  unlinkBank: (userId: string, bankId: string) => void;
  linkWallet: (userId: string, wallet: Omit<LinkedWallet, 'id'>) => void;
  unlinkWallet: (userId: string, walletId: string) => void;
  
  // Admin Specific Link Actions (Garage Level)
  linkGarageBank: (bank: Omit<LinkedBank, 'id'>) => void;
  unlinkGarageBank: (bankId: string) => void;
  linkGarageWallet: (wallet: Omit<LinkedWallet, 'id'>) => void;
  unlinkGarageWallet: (walletId: string) => void;
  signup: (userData: Omit<User, 'id' | 'role'>) => void;
  staffSignup: (staffData: Omit<Staff, 'id' | 'role' | 'weeklyOff'>) => void;
  updateCustomer: (id: string, updates: Partial<User>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteCustomer: (id: string) => void;
  deleteVehicle: (id: string) => void;
  login: (identifier: string) => boolean;
  addActivityLog: (userId: string, action: string, details: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sewa_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  // Persistence Helpers
  const loadState = <T,>(key: string, defaultValue: T): T => {
    const saved = localStorage.getItem(`sewa_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [users, setUsers] = useState<User[]>(() => loadState('users', MOCK_USERS));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => loadState('vehicles', MOCK_VEHICLES));
  const [bookings, setBookings] = useState<ServiceBooking[]>(() => loadState('bookings', MOCK_BOOKINGS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadState('invoices', MOCK_INVOICES));
  const [parts, setParts] = useState<Part[]>(() => loadState('parts', MOCK_PARTS));
  const [staff, setStaff] = useState<Staff[]>(() => loadState('staff', MOCK_STAFF));
  const [attendance, setAttendance] = useState<Attendance[]>(() => loadState('attendance', MOCK_ATTENDANCE));
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => loadState('leaves', MOCK_LEAVES));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadState('notifications', MOCK_NOTIFICATIONS));
  const [holidays, setHolidays] = useState<Holiday[]>(() => loadState('holidays', MOCK_HOLIDAYS));
  const [payslips, setPayslips] = useState<Payslip[]>(() => loadState('payslips', MOCK_PAYSLIPS));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadState('expenses', MOCK_EXPENSES));
  const [advances, setAdvances] = useState<AdvanceSalaryRequest[]>(() => loadState('advances', MOCK_ADVANCES));
  const [transactions, setTransactions] = useState<BankTransaction[]>(() => loadState('transactions', MOCK_TRANSACTIONS));
  const [settings, setSettings] = useState<GarageSettings>(() => loadState('settings', {
    qrCodeUrl: '',
    bankDetails: 'Bank: Global IME Bank\nAccount Name: Sewa Automobile Pvt. Ltd.\nAccount No: 01234567890123\nBranch: Kantipath'
  }));

  // --- Data Fetching ---
  const refreshData = async () => {
    try {
      const [fetchedUsers, fetchedVehicles, fetchedBookings] = await Promise.all([
        apiFetch('/api/users'),
        apiFetch('/api/vehicles'),
        apiFetch('/api/bookings')
      ]);
      
      setUsers(fetchedUsers);
      setVehicles(fetchedVehicles);
      setBookings(fetchedBookings);
    } catch (error) {
      console.error('Failed to fetch data from backend:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('sewa_user', JSON.stringify(currentUser));
    localStorage.setItem('sewa_users', JSON.stringify(users));
    localStorage.setItem('sewa_vehicles', JSON.stringify(vehicles));
    localStorage.setItem('sewa_bookings', JSON.stringify(bookings));
    localStorage.setItem('sewa_invoices', JSON.stringify(invoices));
    localStorage.setItem('sewa_parts', JSON.stringify(parts));
    localStorage.setItem('sewa_staff', JSON.stringify(staff));
    localStorage.setItem('sewa_attendance', JSON.stringify(attendance));
    localStorage.setItem('sewa_leaves', JSON.stringify(leaves));
    localStorage.setItem('sewa_notifications', JSON.stringify(notifications));
    localStorage.setItem('sewa_holidays', JSON.stringify(holidays));
    localStorage.setItem('sewa_payslips', JSON.stringify(payslips));
    localStorage.setItem('sewa_expenses', JSON.stringify(expenses));
    localStorage.setItem('sewa_advances', JSON.stringify(advances));
    localStorage.setItem('sewa_transactions', JSON.stringify(transactions));
    localStorage.setItem('sewa_settings', JSON.stringify(settings));
  }, [currentUser, users, vehicles, bookings, invoices, parts, staff, attendance, leaves, notifications, holidays, payslips, expenses, advances, transactions, settings]);

  // --- Service Reminders Logic ---
  useEffect(() => {
    const checkServiceDue = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      vehicles.forEach(vehicle => {
        if (!vehicle.nextService) return;
        
        const nextServiceDate = new Date(vehicle.nextService);
        nextServiceDate.setHours(0, 0, 0, 0);

        // If service is due today or overdue
        if (nextServiceDate <= today) {
          // Check if we already sent a notification for this vehicle recently
          const alreadyNotified = notifications.some(n => 
            n.userId === vehicle.customerId && 
            n.message.includes(vehicle.model) && 
            n.message.includes('service is due')
          );

          if (!alreadyNotified) {
            addNotification(
              vehicle.customerId, 
              `Service Reminder: Your ${vehicle.model} (${vehicle.number}) service is due. Book an appointment today!`
            );
          }
        }
      });
    };

    // Run check when vehicles change or on initial load
    if (vehicles.length > 0) {
      checkServiceDue();
    }
  }, [vehicles.length]); // Dependency on vehicles list size

  const addNotification = (userId: string, message: string) => {
    setNotifications(prev => [{
      id: `n${Date.now()}`,
      userId,
      message,
      date: new Date().toISOString(),
      read: false
    }, ...prev]);
  };

  const markNotificationsRead = (userId: string) => {
    setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, read: true } : n));
  };

  const addTransaction = (transaction: Omit<BankTransaction, 'id'>) => {
    setTransactions(prev => [{ ...transaction, id: `tx${Date.now()}` }, ...prev]);
  };

  const updateSettings = (updates: Partial<GarageSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const linkBank = (userId: string, bank: Omit<LinkedBank, 'id'>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const linkedBanks = u.linkedBanks || [];
        return {
          ...u,
          linkedBanks: [...linkedBanks, { ...bank, id: `bank${Date.now()}` }]
        };
      }
      return u;
    }));
    
    // Also update currentUser if they are the one linking
    if (currentUser && currentUser.id === userId) {
      const linkedBanks = currentUser.linkedBanks || [];
      setCurrentUser({
        ...currentUser,
        linkedBanks: [...linkedBanks, { ...bank, id: `bank${Date.now()}` }]
      });
    }
  };

  const unlinkBank = (userId: string, bankId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          linkedBanks: (u.linkedBanks || []).filter(b => b.id !== bankId)
        };
      }
      return u;
    }));

    if (currentUser && currentUser.id === userId) {
      setCurrentUser({
        ...currentUser,
        linkedBanks: (currentUser.linkedBanks || []).filter(b => b.id !== bankId)
      });
    }
  };
  const linkWallet = (userId: string, wallet: Omit<LinkedWallet, 'id'>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const linkedWallets = u.linkedWallets || [];
        return {
          ...u,
          linkedWallets: [...linkedWallets, { ...wallet, id: `w${Date.now()}` }]
        };
      }
      return u;
    }));

    if (currentUser && currentUser.id === userId) {
      const linkedWallets = currentUser.linkedWallets || [];
      setCurrentUser({
        ...currentUser,
        linkedWallets: [...linkedWallets, { ...wallet, id: `w${Date.now()}` }]
      });
    }
  };

  const unlinkWallet = (userId: string, walletId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          linkedWallets: (u.linkedWallets || []).filter(w => w.id !== walletId)
        };
      }
      return u;
    }));

    if (currentUser && currentUser.id === userId) {
      setCurrentUser({
        ...currentUser,
        linkedWallets: (currentUser.linkedWallets || []).filter(w => w.id !== walletId)
      });
    }
  };

  const linkGarageBank = (bank: Omit<LinkedBank, 'id'>) => {
    setSettings(prev => ({
      ...prev,
      linkedBanks: [...(prev.linkedBanks || []), { ...bank, id: `gb${Date.now()}` }]
    }));
  };

  const unlinkGarageBank = (bankId: string) => {
    setSettings(prev => ({
      ...prev,
      linkedBanks: (prev.linkedBanks || []).filter(b => b.id !== bankId)
    }));
  };

  const linkGarageWallet = (wallet: Omit<LinkedWallet, 'id'>) => {
    setSettings(prev => ({
      ...prev,
      linkedWallets: [...(prev.linkedWallets || []), { ...wallet, id: `gw${Date.now()}` }]
    }));
  };

  const unlinkGarageWallet = (walletId: string) => {
    setSettings(prev => ({
      ...prev,
      linkedWallets: (prev.linkedWallets || []).filter(w => w.id !== walletId)
    }));
  };

  const addBooking = async (booking: Omit<ServiceBooking, 'id'>) => {
    try {
      const newBooking = await bookingApi.create({
        vehicleId: booking.vehicleId,
        serviceType: booking.type,
        notes: booking.notes
      });
      
      // Update local state with returned booking (mapping backend fields to frontend if needed)
      const mappedBooking: ServiceBooking = {
        ...booking,
        id: newBooking.id,
        status: newBooking.status as ServiceStatus,
        date: newBooking.date
      };
      
      setBookings(prev => [...prev, mappedBooking]);
      
      // Notify Customer
      addNotification(booking.customerId, `Your booking for ${booking.type} has been received.`);
      // Notify Admin
      addNotification('u1', `New booking received: ${booking.type} for vehicle ${booking.vehicleId}.`);
    } catch (error) {
      console.error('Failed to create booking on backend:', error);
      // Fallback
      const newId = `b${Date.now()}`;
      setBookings(prev => [...prev, { ...booking, id: newId }]);
    }
  };

  const updateBookingStatus = (id: string, status: ServiceBooking['status']) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        if (b.status !== status) {
          // Notify Customer
          addNotification(b.customerId, `Your service status has been updated to: ${status}`);
          // Notify Admin
          addNotification('u1', `Service #${id} status updated to ${status}.`);
        }
        return { ...b, status };
      }
      return b;
    }));
  };

  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    setInvoices(prev => {
      // Find the highest existing serial number from invoice IDs
      const maxIdNum = prev.reduce((max, inv) => {
        const num = parseInt(inv.id.replace(/\D/g, '')) || 0;
        return Math.max(max, num);
      }, 0);
      
      const newId = `INV-${String(maxIdNum + 1).padStart(4, '0')}`;
      const newInvoice = { ...invoice, id: newId };
      
      // Notify Customer (Note: in a real app, side-effects like notifications should ideally happen outside the state setter or in a useEffect, but this keeps it synchronous for the demo)
      addNotification(invoice.customerId, `A new invoice of NPR ${invoice.total} has been generated for your service. Invoice #${newId}`);
      
      // Notify Admin based on payment status
      if (invoice.status === 'Pending') {
        addNotification('u1', `Payment pending for Invoice #${newId} (NPR ${invoice.remaining}).`);
      } else if (invoice.status === 'Paid') {
        addNotification('u1', `Payment received for Invoice #${newId} (NPR ${invoice.total}).`);
      }

      // Record transaction if there's an initial payment
      if (invoice.paid > 0) {
        addTransaction({
          date: new Date().toISOString().split('T')[0],
          description: `Payment received for Invoice #${newId}`,
          amount: invoice.paid,
          type: 'Credit',
          source: 'System',
          referenceId: newId
        });
      }

      return [...prev, newInvoice];
    });
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        const updated = { ...inv, ...updates };
        
        // Check if new payment was made
        if (updated.paid !== undefined && updated.paid > inv.paid) {
          const paymentAmount = updated.paid - inv.paid;
          addTransaction({
            date: new Date().toISOString().split('T')[0],
            description: `Payment for Invoice #${id}`,
            amount: paymentAmount,
            type: 'Credit',
            referenceId: id,
            source: 'System'
          });
        }

        // Notify Admin if an invoice is marked as paid
        if (inv.status !== 'Paid' && updated.status === 'Paid') {
          addNotification('u1', `Invoice #${id} has been marked as Paid.`);
        }
        return updated;
      }
      return inv;
    }));
  };

  const addPart = (part: Omit<Part, 'id'>) => {
    setParts(prev => [...prev, { ...part, id: `p${Date.now()}` }]);
  };

  const updatePartStock = (id: string, newStock: number) => {
    setParts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
  };

  const deletePart = (id: string) => {
    setParts(prev => prev.filter(p => p.id !== id));
  };

  const addLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'status'>) => {
    setLeaves(prev => [...prev, { ...request, id: `l${Date.now()}`, status: 'Pending' }]);
    // Notify Admin
    addNotification('u1', `New leave request submitted by staff.`);
  };

  const updateLeaveStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const checkInStaff = (staffId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    setAttendance(prev => [...prev, { id: `a${Date.now()}`, staffId, date: today, checkIn: now, status: 'Present' }]);
  };

  const checkOutStaff = (staffId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    setAttendance(prev => prev.map(a => (a.staffId === staffId && a.date === today) ? { ...a, checkOut: now } : a));
  };

  const addCustomer = (customer: Omit<User, 'id' | 'role'>) => {
    setUsers(prev => [...prev, { ...customer, id: `u${Date.now()}`, role: 'customer' }]);
  };

  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    setVehicles(prev => [...prev, { ...vehicle, id: `v${Date.now()}` }]);
  };

  const addStaff = (staffData: Omit<Staff, 'id' | 'role'>) => {
    const newId = `u${Date.now()}`;
    setStaff(prev => [...prev, { ...staffData, id: newId, role: 'staff', weeklyOff: 'Saturday' }]);
    setUsers(prev => [...prev, { id: newId, name: staffData.name, role: 'staff', phone: staffData.phone, email: staffData.email }]);
  };

  const updateStaffWeeklyOff = (staffId: string, day: string) => {
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, weeklyOff: day } : s));
  };

  const addHoliday = (holiday: Omit<Holiday, 'id'>) => {
    setHolidays(prev => [...prev, { ...holiday, id: `h${Date.now()}` }]);
  };

  const deleteHoliday = (id: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
  };

  const addPayslip = (payslip: Omit<Payslip, 'id'>) => {
    const newId = `ps${Date.now()}`;
    setPayslips(prev => [{ ...payslip, id: newId }, ...prev]);
    
    // Record transaction for payroll
    addTransaction({
      date: payslip.issueDate,
      description: `Payroll - ${users.find(u => u.id === payslip.staffId)?.name} (${payslip.month} ${payslip.year})`,
      amount: payslip.netSalary,
      type: 'Debit',
      referenceId: newId,
      source: 'System'
    });
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newId = `e${Date.now()}`;
    setExpenses(prev => [{ ...expense, id: newId }, ...prev]);
    
    // Record transaction for expense
    addTransaction({
      date: expense.date,
      description: expense.title,
      amount: expense.amount,
      type: 'Debit',
      referenceId: newId,
      source: 'System'
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    // Also remove associated transaction
    setTransactions(prev => prev.filter(t => t.referenceId !== id));
  };

  const addAdvanceRequest = (request: Omit<AdvanceSalaryRequest, 'id' | 'status'>) => {
    setAdvances(prev => [...prev, { ...request, id: `adv${Date.now()}`, status: 'Pending' }]);
    // Notify Admin
    addNotification('u1', `New advance salary request submitted by staff.`);
  };

  const updateAdvanceRequest = (id: string, status: 'Approved' | 'Rejected', amountApproved?: number, adminNotes?: string) => {
    setAdvances(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, status, adminNotes };
        if (status === 'Approved' && amountApproved !== undefined) {
          updated.amountApproved = amountApproved;
          // Automatically add as an expense if approved
          addExpense({
            title: `Advance Salary - ${users.find(u => u.id === a.staffId)?.name}`,
            amount: amountApproved,
            category: 'Other',
            date: new Date().toISOString().split('T')[0]
          });
        }
        return updated;
      }
      return a;
    }));
  };

  const signup = (userData: Omit<User, 'id' | 'role'>) => {
    const newUser: User = {
      ...userData,
      id: `u${Date.now()}`,
      role: 'customer'
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const updateCustomer = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === id) {
        // If nextServiceKM is updated by admin, notify the customer
        if (updates.nextServiceKM !== undefined && updates.nextServiceKM !== v.nextServiceKM) {
          addNotification(
            v.customerId,
            `Update: Your ${v.model} (${v.number}) next service is now set at ${updates.nextServiceKM} KM.`
          );
        }

        // If currentKM is updated by customer, check if service is due
        if (updates.currentKM !== undefined && v.nextServiceKM !== undefined) {
          addActivityLog(v.customerId, 'Mileage Update', `Vehicle ${v.model} (${v.number}) odometer updated to ${updates.currentKM} KM`);
          const remainingKM = v.nextServiceKM - updates.currentKM;
          
          if (remainingKM <= 0) {
            // Trigger simulated Email notification
            addNotification(
              v.customerId,
              `[EMAIL NOTIFICATION] URGENT: Your ${v.model} (${v.number}) has exceeded its service mileage limit! Please book an appointment immediately.`
            );
            // Also notify admin
            addNotification('u1', `Customer Vehicle ${v.model} (${v.number}) has exceeded service KM limit. Please contact customer.`);
          } else if (remainingKM <= 500) {
            // Trigger simulated Email notification
            addNotification(
              v.customerId,
              `[EMAIL NOTIFICATION] Reminder: Your ${v.model} (${v.number}) is due for service in ${remainingKM} KM. Please schedule your visit soon.`
            );
          }
        }

        return { ...v, ...updates };
      }
      return v;
    }));
  };

  const addActivityLog = (userId: string, action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      details
    };
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const logs = u.activityLogs || [];
        return { ...u, activityLogs: [newLog, ...logs] };
      }
      return u;
    }));
  };

  const login = async (identifier: string) => {
    try {
      const response = await authApi.login({ phone: identifier });
      const user = response.user;
      const now = new Date().toISOString();
      
      const updatedUser = { ...user, lastLogin: now };
      setCurrentUser(updatedUser);
      
      if (user.role === 'customer') {
        addActivityLog(user.id, 'Login', `Customer logged into the system at ${new Date().toLocaleString()}`);
      }
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      // Fallback for demo purposes if backend fails
      const user = users.find(u => u.phone === identifier || u.email === identifier);
      if (user) {
        setCurrentUser(user);
        return true;
      }
      return false;
    }
  };

  const deleteCustomer = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    // Optionally remove related data
    setVehicles(prev => prev.filter(v => v.customerId !== id));
    setBookings(prev => prev.filter(b => b.customerId !== id));
    setInvoices(prev => prev.filter(inv => inv.customerId !== id));
  };

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    setBookings(prev => prev.filter(b => b.vehicleId !== id));
  };

  const staffSignup = (staffData: Omit<Staff, 'id' | 'role' | 'weeklyOff'>) => {
    const newId = `u${Date.now()}`;
    const newStaff: Staff = {
      ...staffData,
      id: newId,
      role: 'staff',
      weeklyOff: 'Saturday',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    const newUser: User = {
      id: newId,
      name: staffData.name,
      role: 'staff',
      phone: staffData.phone,
      email: staffData.email
    };
    
    setStaff(prev => [...prev, newStaff]);
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser, users, vehicles, bookings, invoices, parts, staff, attendance, leaves, notifications, holidays, payslips, expenses, advances, transactions, settings,
      addBooking, updateBookingStatus, addInvoice, updateInvoice, addPart, updatePartStock, deletePart, addLeaveRequest, updateLeaveStatus, checkInStaff, checkOutStaff, addNotification, markNotificationsRead,
      addCustomer, addVehicle, addStaff, updateStaffWeeklyOff, addHoliday, deleteHoliday, addPayslip, addExpense, deleteExpense, addAdvanceRequest, updateAdvanceRequest, addTransaction, updateSettings,
      linkBank, unlinkBank, linkWallet, unlinkWallet,
      linkGarageBank, unlinkGarageBank, linkGarageWallet, unlinkGarageWallet,
      signup, staffSignup, updateCustomer, updateVehicle, deleteCustomer, deleteVehicle, login, addActivityLog, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
