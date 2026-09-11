// ===========================================
// CONTACT ROUTES
// ===========================================
import { Router } from 'express';
import { createContactMessage } from '../controllers/contact.controller';

const router = Router();

// POST /api/contact  → Submit a contact form message
router.post('/', createContactMessage);

export default router;
