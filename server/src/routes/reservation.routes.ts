// ===========================================
// RESERVATION ROUTES
// ===========================================
import { Router } from 'express';
import {
  createReservation,
  getReservationByCode,
  lookupReservation,
  customerEditReservation,
  customerCancelReservation,
} from '../controllers/reservation.controller';

const router = Router();

// POST /api/reservations       → Create a new reservation
router.post('/', createReservation);

// POST /api/reservations/lookup → Secure lookup by code + email
router.post('/lookup', lookupReservation);

// GET /api/reservations/:code  → Look up a reservation by booking code
router.get('/:code', getReservationByCode);

// PUT /api/reservations/:code  → Customer edit reservation (with email verification)
router.put('/:code', customerEditReservation);

// DELETE /api/reservations/:code → Customer cancel/remove reservation (with email verification)
router.delete('/:code', customerCancelReservation);

export default router;
