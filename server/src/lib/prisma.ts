// ===========================================
// PRISMA CLIENT — Shared Database Connection
// ===========================================
// WHY this file?
// Prisma needs a single "client" object to talk to PostgreSQL.
// If every controller file created its own PrismaClient, you'd have
// dozens of database connections open at once — wasteful and dangerous.
//
// This file creates ONE PrismaClient and exports it.
// Every other file imports from here:
//   import { prisma } from '../lib/prisma';
//   const items = await prisma.menuItem.findMany();

import { PrismaClient } from '@prisma/client';

// Create a single instance of PrismaClient
// This connects to the PostgreSQL database defined in .env → DATABASE_URL
const prisma = new PrismaClient();

export default prisma;
