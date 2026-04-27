import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock DB for initialization
const users: any[] = [
  { id: '1', name: 'Admin', phone: '9800000000', role: 'admin', password: 'hashed_password' }
];

export const login = async (req: Request, res: Response) => {
  const { phone, password } = req.body;
  
  // Basic validation logic
  const user = users.find(u => u.phone === phone);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // In a real app, we would compare hashed passwords
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, role: user.role, phone: user.phone }
  });
};
