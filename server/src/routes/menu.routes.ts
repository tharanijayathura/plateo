// ===========================================
// MENU ROUTES — URL-to-Handler Mapping for Menu
// ===========================================
// This file says: "When someone visits /api/menu, run getAllMenuItems()"
// The CONTROLLER (menu.controller.ts) does the actual work.
//
// Think of routes like a phone switchboard:
//   Caller dials extension 101 → Route connects to the right person (controller)

import { Router } from 'express';
import { getAllMenuItems, getMenuItemById } from '../controllers/menu.controller';

const router = Router();

// GET /api/menu          → List all menu items (with optional ?category=dinner filter)
router.get('/', getAllMenuItems);

// GET /api/menu/:id      → Get a specific menu item by ID
router.get('/:id', getMenuItemById);

export default router;
