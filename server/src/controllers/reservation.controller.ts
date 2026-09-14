// ===========================================
// RESERVATION CONTROLLER — The Heart of Plateo's Booking System
// ===========================================
// This replaces the FAKE booking in your ReservationForm.tsx:
//
// BEFORE (fake):
//   setTimeout(() => {
//     setBookingCode(`PLT-${randomNum}`);  // Random, meaningless, lost on refresh
//   }, 900);
//
// AFTER (real):
//   const response = await fetch('/api/reservations', { method: 'POST', body: data })
//   → Server validates data
//   → Server generates unique booking code
//   → Server saves to PostgreSQL database (PERMANENT)
//   → Server responds with real booking code
//   → Data survives forever, visible in admin dashboard

import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// POST /api/reservations
// Creates a new reservation in the database
//
// WHAT THE FRONTEND SENDS (in the request body):
// {
//   fullName: "Lady Vivienne Sterling",
//   email: "vivienne@sterling.com",
//   phone: "+94771234567",
//   date: "2026-09-15",
//   time: "07:30 PM",
//   guests: 4,
//   seatingArea: "verandah",
//   occasion: "Anniversary",
//   dietary: ["Vegetarian", "Gluten-Free"],
//   specialRequests: "Anniversary surprise dessert"
// }
export const createReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    // Step 1: Extract data from the request body
    // req.body contains the JSON that the frontend sent via fetch()
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
    } = req.body;

    // Step 2: Validate the data (server-side validation)
    // WHY validate on the server too?
    // Because someone could bypass your React form validation by:
    //   - Using Postman/curl to send direct API requests
    //   - Modifying the browser's JavaScript
    // NEVER trust data from the client!
    const errors: Record<string, string> = {};

    if (!fullName || !fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!email || !email.includes('@')) {
      errors.email = 'Valid email is required';
    }
    if (!phone || phone.length < 8) {
      errors.phone = 'Valid phone number is required';
    }
    if (!date) {
      errors.date = 'Reservation date is required';
    }
    if (!time) {
      errors.time = 'Reservation time is required';
    }
    if (!guests || guests < 1 || guests > 12) {
      errors.guests = 'Guest count must be between 1 and 12';
    }
    if (!seatingArea) {
      errors.seatingArea = 'Seating area is required';
    }

    // If there are validation errors, send them back immediately
    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }

    // Step 3: Generate a unique booking code
    // Format: PLT-XXXX where XXXX is a random 4-digit number
    // We check the database to make sure it's not already taken
    let bookingCode: string;
    let isUnique = false;

    do {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      bookingCode = `PLT-${randomNum}`;
      // Check if this code already exists in the database
      const existing = await prisma.reservation.findUnique({
        where: { bookingCode },
      });
      isUnique = !existing;
    } while (!isUnique);

    // Step 4: Save to the database!
    // prisma.reservation.create() → INSERT INTO "Reservation" (full_name, email, ...) VALUES (...)
    // This is the moment the data becomes PERMANENT
    const reservation = await prisma.reservation.create({
      data: {
        bookingCode,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        date,
        time,
        guests: Number(guests),
        seatingArea,
        occasion: occasion || 'Casual Evening',
        dietary: dietary || [],
        specialRequests: specialRequests || '',
        status: 'confirmed',
      },
    });

    // Step 5: Send success response back to the frontend
    // The frontend receives this via: const data = await response.json()
    // Then it does: setBookingCode(data.bookingCode)
    console.log(`✅ New reservation created: ${bookingCode} for ${fullName}`);

    res.status(201).json({
      success: true,
      message: 'Reservation confirmed successfully',
      bookingCode: reservation.bookingCode,
      reservationId: reservation.id,
    });
  } catch (error) {
    console.error('❌ Error creating reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create reservation. Please try again.',
    });
  }
};

// GET /api/reservations/:code
// Look up a reservation by its booking code (e.g., PLT-8492)
export const getReservationByCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const code = String(req.params.code || '');

    const reservation = await prisma.reservation.findUnique({
      where: { bookingCode: code.toUpperCase() },
    });

    if (!reservation) {
      res.status(404).json({
        success: false,
        message: 'No reservation found with this booking code',
      });
      return;
    }

    res.json({ success: true, data: reservation });
  } catch (error) {
    console.error('Error looking up reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to look up reservation',
    });
  }
};

// POST /api/reservations/lookup
// Secure lookup by Booking Code + Email verification for customers
export const lookupReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingCode, email } = req.body;

    if (!bookingCode || !email) {
      res.status(400).json({
        success: false,
        message: 'Both booking code and email are required',
      });
      return;
    }

    const cleanCode = String(bookingCode).trim().toUpperCase();
    const cleanEmail = String(email).trim().toLowerCase();

    const reservation = await prisma.reservation.findUnique({
      where: { bookingCode: cleanCode },
    });

    if (!reservation) {
      res.status(404).json({
        success: false,
        message: 'No reservation found with this booking code',
      });
      return;
    }

    // Verify email matches to protect customer privacy
    if (reservation.email.toLowerCase() !== cleanEmail) {
      res.status(401).json({
        success: false,
        message: 'The email address does not match this booking code',
      });
      return;
    }

    res.json({ success: true, data: reservation });
  } catch (error) {
    console.error('Error during customer lookup:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to find reservation',
    });
  }
};

// PUT /api/reservations/:code
// Customer edit endpoint — requires email verification
export const customerEditReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const code = String(req.params.code || '').trim().toUpperCase();
    const {
      email,
      fullName,
      phone,
      date,
      time,
      guests,
      seatingArea,
      occasion,
      specialRequests,
    } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Guest email is required to verify ownership',
      });
      return;
    }

    // Fetch existing reservation
    const existing = await prisma.reservation.findUnique({
      where: { bookingCode: code },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
      return;
    }

    // Verify email
    if (existing.email.toLowerCase() !== String(email).trim().toLowerCase()) {
      res.status(401).json({
        success: false,
        message: 'Email address verification failed',
      });
      return;
    }

    // Build update payload
    const updateData: Record<string, unknown> = {};
    if (fullName) updateData.fullName = String(fullName).trim();
    if (phone) updateData.phone = String(phone).trim();
    if (date) updateData.date = date;
    if (time) updateData.time = time;
    if (guests) updateData.guests = Number(guests);
    if (seatingArea) updateData.seatingArea = seatingArea;
    if (occasion) updateData.occasion = occasion;
    if (specialRequests !== undefined) updateData.specialRequests = specialRequests;

    const updated = await prisma.reservation.update({
      where: { bookingCode: code },
      data: updateData,
    });

    console.log(`✅ Customer edited reservation: ${code}`);

    res.json({
      success: true,
      message: 'Your reservation has been updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error in customer edit reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update reservation',
    });
  }
};

// DELETE /api/reservations/:code
// Customer cancel/remove endpoint — requires email verification
export const customerCancelReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const code = String(req.params.code || '').trim().toUpperCase();
    const email = String(req.query.email || req.body.email || '').trim().toLowerCase();

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Guest email is required to verify ownership',
      });
      return;
    }

    const existing = await prisma.reservation.findUnique({
      where: { bookingCode: code },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
      return;
    }

    if (existing.email.toLowerCase() !== email) {
      res.status(401).json({
        success: false,
        message: 'Email address verification failed',
      });
      return;
    }

    // Delete from database
    await prisma.reservation.delete({
      where: { bookingCode: code },
    });

    console.log(`🗑️ Customer cancelled reservation: ${code}`);

    res.json({
      success: true,
      message: `Reservation ${code} has been successfully cancelled and removed`,
    });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel reservation',
    });
  }
};
