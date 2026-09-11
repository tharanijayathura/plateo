// ===========================================
// PLATEO SERVER — Main Entry Point
// ===========================================
// This is the file that STARTS your entire backend.
// When you run: npm run dev
// Node.js executes this file, which:
//   1. Loads secrets from .env
//   2. Creates the Express app
//   3. Configures middleware (CORS, JSON parsing)
//   4. Registers all API routes
//   5. Starts listening on port 5000
//
// After this runs, your backend is ALIVE and waiting for requests!

// --- Step 1: Load environment variables from .env ---
// WHY? process.env.DATABASE_URL would be undefined without this.
// dotenv reads your .env file and makes all variables available via process.env
import dotenv from 'dotenv';
dotenv.config();

// --- Step 2: Import Express and create the app ---
// Express is the framework that handles HTTP requests and responses
import express from 'express';

// --- Step 3: Import CORS ---
// WHY? Your frontend is on localhost:3000, backend on localhost:5000.
// Browsers have a security rule called "Same-Origin Policy" that BLOCKS
// requests between different ports. CORS tells the browser:
// "Hey, localhost:3000 is allowed to talk to me, let it through."
import cors from 'cors';

// --- Step 4: Import route files ---
// Each route file handles a different "section" of the API
import menuRoutes from './routes/menu.routes';
import reservationRoutes from './routes/reservation.routes';
import contactRoutes from './routes/contact.routes';
import adminRoutes from './routes/admin.routes';

// --- Create the Express application ---
const app = express();
const PORT = process.env.PORT || 5000;

// ===========================================
// MIDDLEWARE SETUP
// ===========================================
// Middleware = functions that run on EVERY request, before your route handlers
// Think of them like airport security checkpoints — every passenger goes through them

// Middleware 1: CORS
// Allows your Next.js frontend (localhost:3000) to make requests to this server
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],  // Which HTTP methods are allowed
    credentials: true,  // Allow cookies/auth headers to be sent
  })
);

// Middleware 2: JSON Body Parser
// WHY? When the frontend sends a POST request with JSON data in the body,
// Express can't read it by default. This middleware parses the raw text
// into a JavaScript object available as req.body
// Without this: req.body = undefined
// With this:    req.body = { fullName: "John", email: "john@email.com", ... }
app.use(express.json());

// ===========================================
// ROUTE REGISTRATION
// ===========================================
// This is where we "mount" each route file at a specific URL path.
// app.use('/api/menu', menuRoutes) means:
//   - A GET request to /api/menu → runs getAllMenuItems()
//   - A GET request to /api/menu/abc123 → runs getMenuItemById()
// The route file handles the rest of the URL after /api/menu

app.use('/api/menu', menuRoutes);              // Menu endpoints
app.use('/api/reservations', reservationRoutes); // Reservation endpoints
app.use('/api/contact', contactRoutes);          // Contact form endpoints
app.use('/api/admin', adminRoutes);              // Admin dashboard endpoints

// ===========================================
// HEALTH CHECK ENDPOINT
// ===========================================
// A simple endpoint that returns "OK" to verify the server is running
// Useful for monitoring tools and quick browser checks
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '🍽️ Plateo Backend Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ===========================================
// START THE SERVER
// ===========================================
// app.listen() starts the HTTP server on the specified port
// After this, the server is ALIVE and waiting for requests!
app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('  🍽️  PLATEO BACKEND SERVER');
  console.log('═══════════════════════════════════════════');
  console.log(`  ✅ Server running on: http://localhost:${PORT}`);
  console.log(`  📡 API base URL:      http://localhost:${PORT}/api`);
  console.log(`  🔗 Frontend origin:   ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
  console.log(`  💾 Database:          PostgreSQL via Prisma`);
  console.log('═══════════════════════════════════════════');
  console.log('');
  console.log('  Available endpoints:');
  console.log(`    GET    /api/health             → Health check`);
  console.log(`    GET    /api/menu               → Get menu items`);
  console.log(`    POST   /api/reservations       → Create reservation`);
  console.log(`    POST   /api/contact            → Submit contact message`);
  console.log(`    POST   /api/admin/login        → Admin login`);
  console.log(`    GET    /api/admin/reservations  → All reservations (auth)`);
  console.log(`    GET    /api/admin/contacts      → All contacts (auth)`);
  console.log(`    GET    /api/admin/stats          → Dashboard stats (auth)`);
  console.log('');
});
