import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        vehicle: {
          include: {
            customer: true
          }
        }
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { vehicleId, serviceType, notes } = req.body;
    const newBooking = await prisma.booking.create({
      data: {
        vehicleId,
        serviceType,
        notes,
        status: 'pending'
      }
    });
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
};
