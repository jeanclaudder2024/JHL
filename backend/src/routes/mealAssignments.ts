import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get user's meal assignments (for user dashboard)
router.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;

        const assignments = await prisma.mealAssignment.findMany({
            where: {
                userId,
                status: 'SCHEDULED'
            },
            include: {
                meal: true
            },
            orderBy: { assignedDate: 'asc' },
        });

        res.json(assignments);
    } catch (error) {
        console.error('Get my assignments error:', error);
        res.status(500).json({ error: 'Failed to get meal assignments' });
    }
});

// Get user's upcoming meals (next 7 days)
router.get('/upcoming', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const assignments = await prisma.mealAssignment.findMany({
            where: {
                userId,
                status: 'SCHEDULED',
                assignedDate: {
                    gte: today,
                    lt: nextWeek
                }
            },
            include: {
                meal: true
            },
            orderBy: { assignedDate: 'asc' },
        });

        res.json(assignments);
    } catch (error) {
        console.error('Get upcoming meals error:', error);
        res.status(500).json({ error: 'Failed to get upcoming meals' });
    }
});

// ========== ADMIN ENDPOINTS ==========

// Get all meal assignments (admin)
router.get('/admin/all', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user!;
        if (user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const assignments = await prisma.mealAssignment.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                },
                meal: true
            },
            orderBy: { assignedDate: 'desc' },
        });

        res.json(assignments);
    } catch (error) {
        console.error('Admin get assignments error:', error);
        res.status(500).json({ error: 'Failed to get assignments' });
    }
});

// Get assignments for a specific user (admin)
router.get('/admin/user/:userId', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user!;
        if (user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { userId } = req.params;

        const assignments = await prisma.mealAssignment.findMany({
            where: { userId },
            include: {
                meal: true
            },
            orderBy: { assignedDate: 'desc' },
        });

        res.json(assignments);
    } catch (error) {
        console.error('Admin get user assignments error:', error);
        res.status(500).json({ error: 'Failed to get assignments' });
    }
});

// Assign a single meal to a user (admin)
router.post('/admin/assign', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user!;
        if (user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { userId, mealId, assignedDate, deliveryTime, notes } = req.body;

        const assignment = await prisma.mealAssignment.create({
            data: {
                userId,
                mealId,
                assignedDate: new Date(assignedDate),
                deliveryTime: deliveryTime || 'Lunch',
                notes,
                status: 'SCHEDULED',
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                },
                meal: true
            }
        });

        res.status(201).json(assignment);
    } catch (error: any) {
        console.error('Admin assign meal error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Meal already assigned for this date' });
        }
        res.status(500).json({ error: 'Failed to assign meal' });
    }
});

// Bulk assign meals for multiple days (admin) - for weekly/monthly plans
router.post('/admin/assign-bulk', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user!;
        if (user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { userId, assignments } = req.body;
        // assignments: [{ mealId, assignedDate, deliveryTime }]

        const results = [];
        for (const a of assignments) {
            try {
                const assignment = await prisma.mealAssignment.create({
                    data: {
                        userId,
                        mealId: a.mealId,
                        assignedDate: new Date(a.assignedDate),
                        deliveryTime: a.deliveryTime || 'Lunch',
                        status: 'SCHEDULED',
                    },
                    include: {
                        meal: true
                    }
                });
                results.push({ success: true, assignment });
            } catch (error: any) {
                results.push({ success: false, date: a.assignedDate, error: error.message });
            }
        }

        res.status(201).json({
            message: `Assigned ${results.filter(r => r.success).length} meals successfully`,
            results
        });
    } catch (error) {
        console.error('Admin bulk assign error:', error);
        res.status(500).json({ error: 'Failed to assign meals' });
    }
});

// Update assignment status (admin)
router.put('/admin/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user!;
        if (user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { id } = req.params;
        const { status, notes, deliveryTime } = req.body;

        const assignment = await prisma.mealAssignment.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(notes !== undefined && { notes }),
                ...(deliveryTime && { deliveryTime }),
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                },
                meal: true
            }
        });

        res.json(assignment);
    } catch (error) {
        console.error('Admin update assignment error:', error);
        res.status(500).json({ error: 'Failed to update assignment' });
    }
});

// Delete assignment (admin)
router.delete('/admin/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user!;
        if (user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { id } = req.params;

        await prisma.mealAssignment.delete({
            where: { id },
        });

        res.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        console.error('Admin delete assignment error:', error);
        res.status(500).json({ error: 'Failed to delete assignment' });
    }
});

export default router;
