// ===========================================
// AUTH MIDDLEWARE — JWT Token Verification
// ===========================================
// This is a "middleware" function. In Express, middleware runs BEFORE
// your actual route handler. Think of it like a security guard at a door:
//
//   Request comes in → Middleware checks JWT token → 
//     ✅ Valid token → Let the request through to the controller
//     ❌ No token or invalid → Send 401 Unauthorized, block the request
//
// HOW IT'S USED:
//   router.get('/admin/reservations', authMiddleware, getReservations);
//                                     ^^^^^^^^^^^^^^
//                                     This runs FIRST. If it fails,
//                                     getReservations never executes.

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express's Request type to include our custom "adminEmail" property
// WHY? After verifying the token, we want to attach the admin's email
// to the request object so controllers can use it.
export interface AuthRequest extends Request {
  adminEmail?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // Step 1: Get the token from the Authorization header
  // The frontend sends it like: Authorization: Bearer eyJhbGciOiJIUz...
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided — reject the request
    res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
    return;
  }

  // Step 2: Extract just the token part (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];

  try {
    // Step 3: Verify the token using our secret key
    // jwt.verify() will THROW an error if the token is expired or tampered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as {
      email: string;
    };

    // Step 4: Token is valid! Attach the admin email to the request
    req.adminEmail = decoded.email;

    // Step 5: Call next() to pass control to the actual route handler
    next();
  } catch (error) {
    // Token is invalid, expired, or tampered with
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }
};
