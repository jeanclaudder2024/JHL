import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { authenticate, requireCompanyAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get company employees
router.get('/', authenticate, requireCompanyAdmin, async (req: AuthRequest, res: Response) => {
    try {
        // Get user's company
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: { companyId: true },
        });

        if (!user?.companyId) {
            return res.status(400).json({ error: 'User not associated with a company' });
        }

        const employees = await prisma.employee.findMany({
            where: { companyId: user.companyId },
            orderBy: { createdAt: 'desc' },
        });

        res.json(employees);
    } catch (error) {
        console.error('Get employees error:', error);
        res.status(500).json({ error: 'Failed to get employees' });
    }
});

// Get employee by ID
router.get('/:id', authenticate, requireCompanyAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const employee = await prisma.employee.findUnique({
            where: { id },
        });

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json(employee);
    } catch (error) {
        console.error('Get employee error:', error);
        res.status(500).json({ error: 'Failed to get employee' });
    }
});

// Add employee
router.post('/', authenticate, requireCompanyAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, dietary } = req.body;

        // Get user's company
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: { companyId: true },
        });

        if (!user?.companyId) {
            return res.status(400).json({ error: 'User not associated with a company' });
        }

        const employee = await prisma.employee.create({
            data: {
                companyId: user.companyId,
                name,
                email,
                dietary,
                status: 'INVITED',
            },
        });

        res.status(201).json(employee);
    } catch (error) {
        console.error('Create employee error:', error);
        res.status(500).json({ error: 'Failed to create employee' });
    }
});

// Update employee
router.put('/:id', authenticate, requireCompanyAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, dietary, status } = req.body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (dietary !== undefined) updateData.dietary = dietary;
        if (status) updateData.status = status;

        const employee = await prisma.employee.update({
            where: { id },
            data: updateData,
        });

        res.json(employee);
    } catch (error) {
        console.error('Update employee error:', error);
        res.status(500).json({ error: 'Failed to update employee' });
    }
});

// Delete employee
router.delete('/:id', authenticate, requireCompanyAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.employee.delete({ where: { id } });
        res.json({ message: 'Employee deleted' });
    } catch (error) {
        console.error('Delete employee error:', error);
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

export default router;
