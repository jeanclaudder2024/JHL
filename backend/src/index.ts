import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import applicationRoutes from './routes/applications.js';
import eventRoutes from './routes/events.js';
import mealRoutes from './routes/meals.js';
import subscriptionRoutes from './routes/subscriptions.js';
import employeeRoutes from './routes/employees.js';
import invoiceRoutes from './routes/invoices.js';
import supportRoutes from './routes/support.js';
import mealAssignmentRoutes from './routes/mealAssignments.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/meal-assignments', mealAssignmentRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 JHL Backend running on http://localhost:${PORT}`);
    console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

export { prisma };
