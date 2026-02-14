import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get all event inquiries (Admin only)
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const events = await prisma.eventInquiry.findMany({
            orderBy: { createdAt: 'desc' },
        });

        res.json(events);
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ error: 'Failed to get events' });
    }
});

// Get event by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const event = await prisma.eventInquiry.findUnique({
            where: { id },
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({ error: 'Failed to get event' });
    }
});

// Create new event inquiry
router.post('/', async (req, res) => {
    try {
        const {
            eventType,
            eventDate,
            startTime,
            location,
            guestCount,
            contactName,
            contactEmail,
            phone,
            serviceStyle,
            dietaryFocus,
            budget,
            vision,
        } = req.body;

        const event = await prisma.eventInquiry.create({
            data: {
                eventType,
                eventDate: new Date(eventDate),
                startTime,
                location,
                guestCount: parseInt(guestCount) || 0,
                contactName,
                contactEmail,
                phone,
                serviceStyle: JSON.stringify(serviceStyle || []),
                dietaryFocus: JSON.stringify(dietaryFocus || []),
                budget,
                vision,
                status: 'NEW',
            },
        });

        res.status(201).json(event);
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// Update event status (Admin only)
router.put('/:id/status', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const event = await prisma.eventInquiry.update({
            where: { id },
            data: { status },
        });

        res.json(event);
    } catch (error) {
        console.error('Update event status error:', error);
        res.status(500).json({ error: 'Failed to update event status' });
    }
});

// Update event details
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.eventDate) {
            updateData.eventDate = new Date(updateData.eventDate);
        }
        if (updateData.guestCount) {
            updateData.guestCount = parseInt(updateData.guestCount);
        }
        if (updateData.serviceStyle) {
            updateData.serviceStyle = JSON.stringify(updateData.serviceStyle);
        }
        if (updateData.dietaryFocus) {
            updateData.dietaryFocus = JSON.stringify(updateData.dietaryFocus);
        }

        const event = await prisma.eventInquiry.update({
            where: { id },
            data: updateData,
        });

        res.json(event);
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
});

export default router;
