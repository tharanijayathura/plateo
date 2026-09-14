// ===========================================
// RESERVATION ROUTES
// ===========================================
import { Router } from 'express';
import {
  createReservation,
  getAllPublicReservations,
  getReservationByCode,
  lookupReservation,
  customerEditReservation,
  customerCancelReservation,
} from '../controllers/reservation.controller';

const router = Router();

// GET /api/reservations        → Get all active reservations for customer list
router.get('/', getAllPublicReservations);

// POST /api/reservations       → Create a new reservation
router.post('/', createReservation);

// POST /api/reservations/lookup → Secure lookup by code + email
router.post('/lookup', lookupReservation);

// GET /api/reservations/:code  → Look up a reservation by booking code
router.get('/:code', getReservationByCode);

// PUT /api/reservations/:code  → Customer edit reservation
router.put('/:code', customerEditReservation);

// DELETE /api/reservations/:code → Customer cancel/remove reservation
router.delete('/:code', customerCancelReservation);

export default router;
