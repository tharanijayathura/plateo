// ===========================================
// RESERVATION ROUTES
// ===========================================
import { Router } from 'express';
import { createReservation, getReservationByCode } from '../controllers/reservation.controller';

const router = Router();

// POST /api/reservations       → Create a new reservation (from the frontend form)
router.post('/', createReservation);

// GET /api/reservations/:code  → Look up a reservation by booking code
router.get('/:code', getReservationByCode);

export default router;
