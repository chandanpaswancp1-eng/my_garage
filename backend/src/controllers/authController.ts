import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export const login = async (req: Request, res: Response) => {
  const { phone, password } = req.body;
  
  try {
    const user = await prisma.user.findUnique({
      where: { phone }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // In a real app, we would compare hashed passwords
    // For now, if password is not hashed in DB, we handle it
    const isMatch = user.password ? await bcrypt.compare(password, user.password) : true;
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, role: user.role, phone: user.phone }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};
