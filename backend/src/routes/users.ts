import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get all users (Admin only)
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                company: { select: { name: true } },
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
});

// Get user by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Users can only view their own profile unless admin
        if (req.user!.role !== 'ADMIN' && req.user!.id !== id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            include: { company: true },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

// Update user
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        // Users can only update their own profile unless admin
        if (req.user!.role !== 'ADMIN' && req.user!.id !== id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;

        // Only admin can change roles
        if (role && req.user!.role === 'ADMIN') {
            updateData.role = role;
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                company: { select: { name: true } },
            },
        });

        res.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete user (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.user.delete({ where: { id } });
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

export default router;
