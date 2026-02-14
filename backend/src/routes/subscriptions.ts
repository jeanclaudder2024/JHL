import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get user's subscriptions
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;

        const subscriptions = await prisma.subscription.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        res.json(subscriptions);
    } catch (error) {
        console.error('Get subscriptions error:', error);
        res.status(500).json({ error: 'Failed to get subscriptions' });
    }
});

// Get subscription by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        const subscription = await prisma.subscription.findFirst({
            where: { id, userId },
        });

        if (!subscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        res.json(subscription);
    } catch (error) {
        console.error('Get subscription error:', error);
        res.status(500).json({ error: 'Failed to get subscription' });
    }
});

// Create subscription
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { planName, price, period, cycle, features } = req.body;

        // Calculate next billing date (30 days from now for monthly)
        const nextBilling = new Date();
        if (cycle === 'Monthly') {
            nextBilling.setMonth(nextBilling.getMonth() + 1);
        } else {
            nextBilling.setDate(nextBilling.getDate() + 1);
        }

        const subscription = await prisma.subscription.create({
            data: {
                userId,
                planName,
                price: parseFloat(price) || 0,
                period,
                cycle,
                features: JSON.stringify(features || []),
                nextBilling,
                status: 'ACTIVE',
            },
        });

        res.status(201).json(subscription);
    } catch (error) {
        console.error('Create subscription error:', error);
        res.status(500).json({ error: 'Failed to create subscription' });
    }
});

// Update subscription
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const { planName, price, period, cycle, features, status } = req.body;

        // Verify ownership
        const existing = await prisma.subscription.findFirst({
            where: { id, userId },
        });

        if (!existing) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        const updateData: any = {};
        if (planName) updateData.planName = planName;
        if (price) updateData.price = parseFloat(price);
        if (period) updateData.period = period;
        if (cycle) updateData.cycle = cycle;
        if (features) updateData.features = JSON.stringify(features);
        if (status) updateData.status = status;

        // Recalculate next billing if cycle changed
        if (cycle && cycle !== existing.cycle) {
            const nextBilling = new Date();
            if (cycle === 'Monthly') {
                nextBilling.setMonth(nextBilling.getMonth() + 1);
            } else {
                nextBilling.setDate(nextBilling.getDate() + 1);
            }
            updateData.nextBilling = nextBilling;
        }

        const subscription = await prisma.subscription.update({
            where: { id },
            data: updateData,
        });

        res.json(subscription);
    } catch (error) {
        console.error('Update subscription error:', error);
        res.status(500).json({ error: 'Failed to update subscription' });
    }
});

// Cancel subscription
router.post('/:id/cancel', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        // Verify ownership
        const existing = await prisma.subscription.findFirst({
            where: { id, userId },
        });

        if (!existing) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        const subscription = await prisma.subscription.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });

        res.json(subscription);
    } catch (error) {
        console.error('Cancel subscription error:', error);
        res.status(500).json({ error: 'Failed to cancel subscription' });
    }
});

// ========== ADMIN ENDPOINTS ==========

// Get all subscriptions (admin only)
router.get('/admin/all', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user!;
        if (user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const subscriptions = await prisma.subscription.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true, role: true }
                }
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(subscriptions);
    } catch (error) {
        console.error('Admin get subscriptions error:', error);
        res.status(500).json({ error: 'Failed to get subscriptions' });
    }
});

// Admin assign subscription to user
router.post('/admin/assign', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user!;
        if (user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { userId, planName, price, period, cycle, features } = req.body;

        // Calculate next billing date
        const nextBilling = new Date();
        if (cycle === 'Monthly') {
            nextBilling.setMonth(nextBilling.getMonth() + 1);
        } else {
            nextBilling.setDate(nextBilling.getDate() + 1);
        }

        // Deactivate any existing active subscription
        await prisma.subscription.updateMany({
            where: { userId, status: 'ACTIVE' },
            data: { status: 'CANCELLED' }
        });

        // Create new subscription
        const subscription = await prisma.subscription.create({
            data: {
                userId,
                planName,
                price: parseFloat(price) || 0,
                period,
                cycle,
                features: JSON.stringify(features || []),
                nextBilling,
                status: 'ACTIVE',
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        res.status(201).json(subscription);
    } catch (error) {
        console.error('Admin assign subscription error:', error);
        res.status(500).json({ error: 'Failed to assign subscription' });
    }
});

// Admin update any subscription
router.put('/admin/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user!;
        if (user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { id } = req.params;
        const { planName, price, period, cycle, features, status } = req.body;

        const existing = await prisma.subscription.findUnique({
            where: { id },
        });

        if (!existing) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        const updateData: any = {};
        if (planName) updateData.planName = planName;
        if (price) updateData.price = parseFloat(price);
        if (period) updateData.period = period;
        if (cycle) updateData.cycle = cycle;
        if (features) updateData.features = JSON.stringify(features);
        if (status) updateData.status = status;

        // Recalculate next billing if cycle changed
        if (cycle && cycle !== existing.cycle) {
            const nextBilling = new Date();
            if (cycle === 'Monthly') {
                nextBilling.setMonth(nextBilling.getMonth() + 1);
            } else {
                nextBilling.setDate(nextBilling.getDate() + 1);
            }
            updateData.nextBilling = nextBilling;
        }

        const subscription = await prisma.subscription.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        res.json(subscription);
    } catch (error) {
        console.error('Admin update subscription error:', error);
        res.status(500).json({ error: 'Failed to update subscription' });
    }
});

// Admin delete subscription
router.delete('/admin/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user!;
        if (user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { id } = req.params;

        await prisma.subscription.delete({
            where: { id },
        });

        res.json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        console.error('Admin delete subscription error:', error);
        res.status(500).json({ error: 'Failed to delete subscription' });
    }
});

export default router;
