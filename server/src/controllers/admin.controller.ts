// ===========================================
// ADMIN CONTROLLER — Admin Login & Dashboard Data
// ===========================================
// This handles:
//   1. Admin login (check password → return JWT token)
//   2. Fetching all reservations (for the admin dashboard table)
//   3. Fetching all contact messages (for the admin dashboard)
//   4. Updating reservation/contact status (confirm, cancel, mark read)
//   5. Dashboard summary statistics
//
// HOW ADMIN AUTH WORKS:
//   1. Admin enters email + password on /admin login page
//   2. Frontend sends POST /api/admin/login { email, password }
//   3. This controller checks the password using bcrypt
//   4. If correct → creates a JWT token (valid for 24 hours)
//   5. Frontend stores the token in localStorage
//   6. All subsequent admin API calls include: Authorization: Bearer <token>
//   7. The authMiddleware verifies the token before these controllers run

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

// POST /api/admin/login
// Authenticates the admin and returns a JWT token
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@plateo.lk';
    const adminPassword = process.env.ADMIN_PASSWORD || 'plateo2026';

    // Step 1: Check if email matches
    if (email !== adminEmail) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Step 2: Check password
    // For simplicity, we compare directly. In production, you'd store a hashed password.
    // bcrypt.compareSync would be used if the stored password was hashed.
    if (password !== adminPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Step 3: Generate JWT token
    // jwt.sign() creates a token containing the admin's email
    // This token is like a "digital keycard" that expires in 24 hours
    const token = jwt.sign(
      { email: adminEmail },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    console.log(`✅ Admin logged in: ${adminEmail}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
};

// GET /api/admin/reservations
// Returns ALL reservations (for the admin dashboard table)
// Protected by authMiddleware — only accessible with valid JWT
export const getAllReservations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Optional query filters
    const { status, date, seatingArea } = req.query;

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status;
    if (date) where.date = date;
    if (seatingArea && seatingArea !== 'all') where.seatingArea = seatingArea;

    // Fetch all reservations, newest first
    const reservations = await prisma.reservation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reservations',
    });
  }
};

// PATCH /api/admin/reservations/:id
// Updates a reservation's status (e.g., confirmed → cancelled)
export const updateReservationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id || '');
    const { status } = req.body;

    const validStatuses = ['confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
      return;
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: { status },
    });

    console.log(`✅ Reservation ${updated.bookingCode} status → ${status}`);

    res.json({
      success: true,
      message: `Reservation status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update reservation',
    });
  }
};

// PUT /api/admin/reservations/:id
// Fully edits a reservation's details (date, time, guests, seating, etc.)
export const editReservation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id || '');
    const {
      fullName,
      email,
      phone,
      date,
      time,
      guests,
      seatingArea,
      occasion,
      dietary,
      specialRequests,
      status,
      orderedItems,
    } = req.body;

    // Build update data object — only include fields that were sent
    const updateData: Record<string, unknown> = {};
    if (fullName !== undefined) updateData.fullName = fullName.trim();
    if (email !== undefined) updateData.email = email.trim().toLowerCase();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (date !== undefined) updateData.date = date;
    if (time !== undefined) updateData.time = time;
    if (guests !== undefined) updateData.guests = Number(guests);
    if (seatingArea !== undefined) updateData.seatingArea = seatingArea;
    if (occasion !== undefined) updateData.occasion = occasion;
    if (dietary !== undefined) updateData.dietary = dietary;
    if (specialRequests !== undefined) updateData.specialRequests = specialRequests;
    if (orderedItems !== undefined) updateData.orderedItems = orderedItems;
    if (status !== undefined) {
      const validStatuses = ['confirmed', 'cancelled', 'completed'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          message: `Status must be one of: ${validStatuses.join(', ')}`,
        });
        return;
      }
      updateData.status = status;
    }

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({
        success: false,
        message: 'No fields provided to update',
      });
      return;
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: updateData,
    });

    console.log(`✅ Reservation ${updated.bookingCode} edited by admin`);

    res.json({
      success: true,
      message: 'Reservation updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error editing reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to edit reservation',
    });
  }
};

// DELETE /api/admin/reservations/:id
// Permanently removes a reservation from the database
export const deleteReservation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id || '');

    const deleted = await prisma.reservation.delete({
      where: { id },
    });

    console.log(`🗑️ Reservation ${deleted.bookingCode} deleted by admin`);

    res.json({
      success: true,
      message: `Reservation ${deleted.bookingCode} has been permanently removed`,
    });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete reservation',
    });
  }
};

// GET /api/admin/contacts
// Returns ALL contact messages
export const getAllContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, department } = req.query;

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status;
    if (department && department !== 'all') where.department = department;

    const contacts = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages',
    });
  }
};

// PATCH /api/admin/contacts/:id
// Updates a contact message's status (new → read → replied)
export const updateContactStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id || '');
    const { status } = req.body;

    const validStatuses = ['new', 'read', 'replied'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
      return;
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    res.json({
      success: true,
      message: `Contact status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact message',
    });
  }
};

// GET /api/admin/stats
// Returns dashboard summary statistics
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get today's date string
    const today = new Date().toISOString().split('T')[0];

    // Count various things in parallel for speed
    const [
      totalReservations,
      todayReservations,
      confirmedReservations,
      cancelledReservations,
      totalContacts,
      newContacts,
    ] = await Promise.all([
      prisma.reservation.count(),
      prisma.reservation.count({ where: { date: today } }),
      prisma.reservation.count({ where: { status: 'confirmed' } }),
      prisma.reservation.count({ where: { status: 'cancelled' } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: 'new' } }),
    ]);

    res.json({
      success: true,
      data: {
        totalReservations,
        todayReservations,
        confirmedReservations,
        cancelledReservations,
        totalContacts,
        newContacts,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
    });
  }
};
