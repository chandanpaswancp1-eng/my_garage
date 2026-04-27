import { Request, Response } from 'express';

// Mock data store
let bookings: any[] = [];

export const getBookings = (req: Request, res: Response) => {
  res.json(bookings);
};

export const createBooking = (req: Request, res: Response) => {
  const newBooking = { id: Date.now().toString(), ...req.body };
  bookings.push(newBooking);
  res.status(201).json(newBooking);
};
