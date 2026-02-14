import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get all applications (Admin only)
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const applications = await prisma.companyApplication.findMany({
            include: {
                company: {
                    select: { name: true, employeeCount: true, industry: true, location: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(applications);
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ error: 'Failed to get applications' });
    }
});

// Get application by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const application = await prisma.companyApplication.findUnique({
            where: { id },
            include: {
                company: true,
            },
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        console.error('Get application error:', error);
        res.status(500).json({ error: 'Failed to get application' });
    }
});

// Create new company application
router.post('/', async (req, res) => {
    try {
        const {
            companyName,
            industry,
            employeeCount,
            location,
            contactName,
            contactEmail,
            phone,
            mealTypes,
            dietaryFocus,
            notes,
        } = req.body;

        // Create company first
        const company = await prisma.company.create({
            data: {
                name: companyName,
                industry,
                employeeCount: parseInt(employeeCount) || 0,
                location,
            },
        });

        // Create application
        const application = await prisma.companyApplication.create({
            data: {
                companyId: company.id,
                contactName,
                contactEmail,
                phone,
                mealTypes: JSON.stringify(mealTypes || []),
                dietaryFocus: JSON.stringify(dietaryFocus || []),
                notes,
                status: 'PENDING',
            },
            include: {
                company: true,
            },
        });

        res.status(201).json(application);
    } catch (error) {
        console.error('Create application error:', error);
        res.status(500).json({ error: 'Failed to create application' });
    }
});

// Approve application (Admin only)
router.post('/:id/approve', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { invoiceAmount } = req.body;

        const application = await prisma.companyApplication.update({
            where: { id },
            data: {
                status: 'APPROVED_UNPAID',
                invoiceAmount: parseFloat(invoiceAmount) || 0,
            },
            include: {
                company: true,
            },
        });

        res.json(application);
    } catch (error) {
        console.error('Approve application error:', error);
        res.status(500).json({ error: 'Failed to approve application' });
    }
});

// Reject application (Admin only)
router.post('/:id/reject', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const application = await prisma.companyApplication.update({
            where: { id },
            data: { status: 'REJECTED' },
            include: {
                company: true,
            },
        });

        res.json(application);
    } catch (error) {
        console.error('Reject application error:', error);
        res.status(500).json({ error: 'Failed to reject application' });
    }
});

// Mark as paid (simulate payment)
router.post('/:id/pay', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const application = await prisma.companyApplication.update({
            where: { id },
            data: { status: 'APPROVED_PAID' },
            include: {
                company: true,
            },
        });

        res.json(application);
    } catch (error) {
        console.error('Pay application error:', error);
        res.status(500).json({ error: 'Failed to process payment' });
    }
});

export default router;
