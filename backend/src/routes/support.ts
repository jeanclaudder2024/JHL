import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get user's tickets or all tickets (admin)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const isAdmin = req.user!.role === 'ADMIN';

        const where = isAdmin ? {} : { userId };

        const tickets = await prisma.supportTicket.findMany({
            where,
            include: {
                user: { select: { name: true, email: true } },
            },
            orderBy: { updatedAt: 'desc' },
        });

        res.json(tickets);
    } catch (error) {
        console.error('Get tickets error:', error);
        res.status(500).json({ error: 'Failed to get tickets' });
    }
});

// Get ticket by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const isAdmin = req.user!.role === 'ADMIN';

        const ticket = await prisma.supportTicket.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, email: true } },
            },
        });

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Check access
        if (!isAdmin && ticket.userId !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(ticket);
    } catch (error) {
        console.error('Get ticket error:', error);
        res.status(500).json({ error: 'Failed to get ticket' });
    }
});

// Create support ticket
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { subject, message } = req.body;

        const ticket = await prisma.supportTicket.create({
            data: {
                userId,
                subject,
                lastMessage: message,
                status: 'OPEN',
            },
        });

        res.status(201).json(ticket);
    } catch (error) {
        console.error('Create ticket error:', error);
        res.status(500).json({ error: 'Failed to create ticket' });
    }
});

// Update ticket (add message)
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { message, status } = req.body;
        const userId = req.user!.id;
        const isAdmin = req.user!.role === 'ADMIN';

        // Verify access
        const existing = await prisma.supportTicket.findUnique({
            where: { id },
        });

        if (!existing) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        if (!isAdmin && existing.userId !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const updateData: any = {};
        if (message) updateData.lastMessage = message;
        if (status && isAdmin) updateData.status = status;

        const ticket = await prisma.supportTicket.update({
            where: { id },
            data: updateData,
        });

        res.json(ticket);
    } catch (error) {
        console.error('Update ticket error:', error);
        res.status(500).json({ error: 'Failed to update ticket' });
    }
});

// Resolve ticket (Admin only)
router.post('/:id/resolve', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const ticket = await prisma.supportTicket.update({
            where: { id },
            data: { status: 'RESOLVED' },
        });

        res.json(ticket);
    } catch (error) {
        console.error('Resolve ticket error:', error);
        res.status(500).json({ error: 'Failed to resolve ticket' });
    }
});

export default router;
