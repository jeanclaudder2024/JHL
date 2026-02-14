import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { authenticate, requireCompanyAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get company invoices
router.get('/', authenticate, requireCompanyAdmin, async (req: AuthRequest, res: Response) => {
    try {
        // Get user's company
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: { companyId: true, role: true },
        });

        let where: any = {};

        // Admin can see all invoices
        if (user?.role !== 'ADMIN') {
            if (!user?.companyId) {
                return res.status(400).json({ error: 'User not associated with a company' });
            }
            where.companyId = user.companyId;
        }

        const invoices = await prisma.invoice.findMany({
            where,
            include: {
                company: { select: { name: true } },
            },
            orderBy: { date: 'desc' },
        });

        res.json(invoices);
    } catch (error) {
        console.error('Get invoices error:', error);
        res.status(500).json({ error: 'Failed to get invoices' });
    }
});

// Get invoice by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                company: true,
            },
        });

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.json(invoice);
    } catch (error) {
        console.error('Get invoice error:', error);
        res.status(500).json({ error: 'Failed to get invoice' });
    }
});

// Create invoice (Admin only - usually happens automatically)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { companyId, amount, items } = req.body;

        const invoice = await prisma.invoice.create({
            data: {
                companyId,
                date: new Date(),
                amount: parseFloat(amount) || 0,
                items,
                status: 'PENDING',
            },
        });

        res.status(201).json(invoice);
    } catch (error) {
        console.error('Create invoice error:', error);
        res.status(500).json({ error: 'Failed to create invoice' });
    }
});

// Update invoice status
router.put('/:id/status', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const invoice = await prisma.invoice.update({
            where: { id },
            data: { status },
        });

        res.json(invoice);
    } catch (error) {
        console.error('Update invoice status error:', error);
        res.status(500).json({ error: 'Failed to update invoice status' });
    }
});

export default router;
