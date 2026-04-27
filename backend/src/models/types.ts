// This will eventually be replaced by a real database (e.g., PostgreSQL with Prisma)
// For now, it serves as a central point for type-safe mock data on the server side.

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'customer' | 'staff';
  phone: string;
  email?: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  model: string;
  number: string;
}

// ... other types will follow the frontend types/index.ts
