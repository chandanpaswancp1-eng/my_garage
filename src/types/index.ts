export type Role = 'admin' | 'customer' | 'staff';

export interface LinkedWallet {
  id: string;
  provider: 'eSewa' | 'Khalti' | 'IME Pay' | 'Other';
  phone: string;
  isDefault: boolean;
}

export interface LinkedBank {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  phone: string;
  email?: string;
  linkedBanks?: LinkedBank[];
  linkedWallets?: LinkedWallet[];
}

export interface Vehicle {
  id: string;
  customerId: string;
  model: string;
  number: string;
  lastService?: string;
  nextService?: string;
}

export type ServiceStatus = 'Pending' | 'In Progress' | 'Completed';

export interface ServiceBooking {
  id: string;
  customerId: string;
  vehicleId: string;
  type: string;
  date: string;
  notes: string;
  status: ServiceStatus;
  mechanicId?: string;
  mechanicNotes?: string;
}

export type PaymentType = 'Cash' | 'Bank Transfer' | 'QR' | 'Cheque';
export type InvoiceStatus = 'Paid' | 'Pending' | 'Credit';
export type InvoiceType = 'VAT' | 'Normal';

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  bookingId?: string; // Made optional for direct invoices
  customerId: string;
  description?: string; // Added for direct invoices
  items: InvoiceItem[]; // Full work details with amounts
  total: number;
  paid: number;
  remaining: number;
  type: InvoiceType;
  status: InvoiceStatus;
  paymentMethod?: PaymentType;
  date: string;
}

export interface Part {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface Staff extends User {
  role: 'staff';
  position: string;
  salary: number;
  joinedDate: string;
  weeklyOff?: string; // e.g., 'Saturday'
}

export interface Attendance {
  id: string;
  staffId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'Present' | 'Absent' | 'Leave';
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  type: 'Sick' | 'Paid' | 'Unpaid' | 'Annual';
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Holiday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
}

export interface Payslip {
  id: string;
  staffId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowance: number;
  deductions: number;
  netSalary: number;
  issueDate: string;
  status: 'Paid' | 'Pending';
}

export type ExpenseCategory = 'Rent' | 'Utilities' | 'Equipment' | 'Inventory' | 'Other';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export interface AdvanceSalaryRequest {
  id: string;
  staffId: string;
  amountRequested: number;
  amountApproved?: number;
  reason: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminNotes?: string;
}

export type TransactionType = 'Credit' | 'Debit';

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  referenceId?: string; // Link to invoice or expense ID
  source: 'Manual' | 'System';
}

export interface GarageSettings {
  qrCodeUrl: string;
  bankDetails: string;
  linkedBanks?: LinkedBank[];
  linkedWallets?: LinkedWallet[];
}
