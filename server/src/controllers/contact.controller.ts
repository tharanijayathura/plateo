// ===========================================
// CONTACT CONTROLLER — Contact Form Submissions
// ===========================================
// Replaces the fake wax-seal animation in your contact page.
// Now when someone submits the contact form, their message is actually
// saved to the database and visible in the admin dashboard.

import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// POST /api/contact
// Saves a contact form submission to the database
export const createContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, department, replyMethod, message } = req.body;

    // Validate
    const errors: Record<string, string> = {};
    if (!name || !name.trim()) errors.name = 'Name is required';
    if (!email || !email.includes('@')) errors.email = 'Valid email is required';
    if (!message || message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ success: false, message: 'Validation failed', errors });
      return;
    }

    // Generate unique reference code (CORR-XXXX)
    let referenceCode: string;
    let isUnique = false;

    do {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      referenceCode = `CORR-${randomNum}`;
      const existing = await prisma.contactMessage.findUnique({
        where: { referenceCode },
      });
      isUnique = !existing;
    } while (!isUnique);

    // Save to database
    const contact = await prisma.contactMessage.create({
      data: {
        referenceCode,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || '',
        department: department || 'concierge',
        replyMethod: replyMethod || 'email',
        message: message.trim(),
        status: 'new',
      },
    });

    console.log(`✅ New contact message: ${referenceCode} from ${name}`);

    res.status(201).json({
      success: true,
      message: 'Correspondence dispatched successfully',
      referenceCode: contact.referenceCode,
    });
  } catch (error) {
    console.error('❌ Error saving contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.',
    });
  }
};
