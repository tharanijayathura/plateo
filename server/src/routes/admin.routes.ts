// ===========================================
// ADMIN ROUTES — Protected with JWT Authentication
// ===========================================
// NOTICE: Every route except /login uses authMiddleware
// This means if you try to access /api/admin/reservations without a valid
// JWT token, you'll get: 401 Unauthorized
//
// The login route does NOT need auth (obviously — you need to login first to GET a token!)

import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  adminLogin,
  getAllReservations,
  updateReservationStatus,
  getAllContacts,
  updateContactStatus,
  getDashboardStats,
} from '../controllers/admin.controller';

const router = Router();

// PUBLIC — No auth needed (this is how you GET a token)
router.post('/login', adminLogin);

// PROTECTED — All routes below require a valid JWT token
// authMiddleware runs BEFORE the controller function
router.get('/stats', authMiddleware, getDashboardStats);
router.get('/reservations', authMiddleware, getAllReservations);
router.patch('/reservations/:id', authMiddleware, updateReservationStatus);
router.get('/contacts', authMiddleware, getAllContacts);
router.patch('/contacts/:id', authMiddleware, updateContactStatus);

export default router;
