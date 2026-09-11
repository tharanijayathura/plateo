// ===========================================
// MENU CONTROLLER — Business Logic for Menu API
// ===========================================
// This file handles WHAT HAPPENS when someone calls our menu API.
// 
// Think of it like a restaurant kitchen:
//   Route (Waiter)       → Takes the order (receives HTTP request)
//   Controller (Chef)    → Actually prepares the food (queries database, processes data)
//   Prisma (Ingredients) → Gets raw ingredients from storage (fetches from PostgreSQL)
//
// ENDPOINTS HANDLED:
//   GET /api/menu           → Get all menu items (with optional category filter)
//   GET /api/menu/:id       → Get a single menu item by ID

import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// GET /api/menu
// Fetches menu items from the database, with optional filtering by category
// 
// HOW THE FRONTEND CALLS THIS:
//   fetch('http://localhost:5000/api/menu')                    → All items
//   fetch('http://localhost:5000/api/menu?category=dinner')    → Only dinner items
//   fetch('http://localhost:5000/api/menu?featured=true')      → Only featured items
export const getAllMenuItems = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.query contains URL query parameters
    // Example: /api/menu?category=dinner → req.query.category = "dinner"
    const { category, featured } = req.query;

    // Build the "where" filter object dynamically
    // This tells Prisma: "only give me rows WHERE category = 'dinner'" (if specified)
    const where: Record<string, unknown> = {};

    if (category && category !== 'all') {
      where.category = category as string;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    // prisma.menuItem.findMany() → SELECT * FROM "MenuItem" WHERE ...
    // This translates to SQL automatically!
    const items = await prisma.menuItem.findMany({
      where,
      orderBy: { createdAt: 'asc' },  // Oldest first (maintains your original order)
    });

    // Send the items back to the frontend as JSON
    // The frontend receives this in: const data = await response.json()
    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items',
    });
  }
};

// GET /api/menu/:id
// Fetches a single menu item by its ID
// The ":id" is a URL parameter — /api/menu/lobster-sirloin → req.params.id = "lobster-sirloin"
export const getMenuItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id || '');

    // prisma.menuItem.findUnique() → SELECT * FROM "MenuItem" WHERE id = '...' LIMIT 1
    const item = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
      return;
    }

    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu item',
    });
  }
};
