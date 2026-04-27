import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Vehicle, ServiceBooking, Invoice, Part, Staff, Attendance, LeaveRequest, AppNotification, Holiday, Payslip, Expense, AdvanceSalaryRequest, BankTransaction, GarageSettings } from '../types';

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
  currentUser: User;
  setCurrentUser: (user: User) => void;
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
  logout: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sewa_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [bookings, setBookings] = useState<ServiceBooking[]>(MOCK_BOOKINGS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [parts, setParts] = useState<Part[]>(MOCK_PARTS);
  const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF);
  const [attendance, setAttendance] = useState<Attendance[]>(MOCK_ATTENDANCE);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sewa_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sewa_user');
    }
  }, [currentUser]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(MOCK_LEAVES);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [holidays, setHolidays] = useState<Holiday[]>(MOCK_HOLIDAYS);
  const [payslips, setPayslips] = useState<Payslip[]>(MOCK_PAYSLIPS);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [advances, setAdvances] = useState<AdvanceSalaryRequest[]>(MOCK_ADVANCES);
  const [transactions, setTransactions] = useState<BankTransaction[]>(MOCK_TRANSACTIONS);
  const [settings, setSettings] = useState<GarageSettings>({
    qrCodeUrl: '',
    bankDetails: 'Bank: Global IME Bank\nAccount Name: Sewa Automobile Pvt. Ltd.\nAccount No: 01234567890123\nBranch: Kantipath'
  });

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

  const addBooking = (booking: Omit<ServiceBooking, 'id'>) => {
    const newId = `b${Date.now()}`;
    const newBooking = { ...booking, id: newId };
    setBookings(prev => [...prev, newBooking]);
    
    // Notify Customer
    addNotification(booking.customerId, `Your booking for ${booking.type} has been received.`);
    // Notify Admin
    addNotification('u1', `New booking received: ${booking.type} for vehicle ${booking.vehicleId}.`);
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
    const newId = `inv${Date.now()}`;
    setInvoices(prev => [...prev, { ...invoice, id: newId }]);
    
    // Notify Customer
    addNotification(invoice.customerId, `A new invoice of NPR ${invoice.total} has been generated for your service.`);
    
    // Notify Admin based on payment status
    if (invoice.status === 'Pending') {
      addNotification('u1', `Payment pending for Invoice #${newId} (NPR ${invoice.remaining}).`);
    } else if (invoice.status === 'Paid') {
      addNotification('u1', `Payment received for Invoice #${newId} (NPR ${invoice.total}).`);
    }

    // Record transaction if there's an initial payment
    if (invoice.paid > 0) {
      addTransaction({
        date: invoice.date,
        description: `Payment for Invoice #${newId}`,
        amount: invoice.paid,
        type: 'Credit',
        referenceId: newId,
        source: 'System'
      });
    }
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
      logout
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
