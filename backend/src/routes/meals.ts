import { Router, Response } from 'express';
import { prisma } from '../index.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get all meals
router.get('/', async (req, res) => {
    try {
        const { date, type, active } = req.query;

        const where: any = {};
        if (date) where.date = new Date(date as string);
        if (type) where.type = type;
        if (active !== undefined) where.isActive = active === 'true';

        const meals = await prisma.meal.findMany({
            where,
            orderBy: { date: 'desc' },
        });

        res.json(meals);
    } catch (error) {
        console.error('Get meals error:', error);
        res.status(500).json({ error: 'Failed to get meals' });
    }
});

// Get meal by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const meal = await prisma.meal.findUnique({
            where: { id },
            include: {
                ratings: {
                    include: {
                        user: { select: { name: true } },
                    },
                },
            },
        });

        if (!meal) {
            return res.status(404).json({ error: 'Meal not found' });
        }

        res.json(meal);
    } catch (error) {
        console.error('Get meal error:', error);
        res.status(500).json({ error: 'Failed to get meal' });
    }
});

// Create meal (Admin only)
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const {
            name,
            description,
            calories,
            image,
            date,
            type,
            ingredients,
            protein,
            carbs,
            fats,
        } = req.body;

        const meal = await prisma.meal.create({
            data: {
                name,
                description,
                calories: parseInt(calories) || 0,
                image,
                date: new Date(date),
                type,
                ingredients: JSON.stringify(ingredients || []),
                protein: protein ? parseInt(protein) : null,
                carbs: carbs ? parseInt(carbs) : null,
                fats: fats ? parseInt(fats) : null,
            },
        });

        res.status(201).json(meal);
    } catch (error) {
        console.error('Create meal error:', error);
        res.status(500).json({ error: 'Failed to create meal' });
    }
});

// Update meal (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        if (updateData.date) updateData.date = new Date(updateData.date);
        if (updateData.calories) updateData.calories = parseInt(updateData.calories);
        if (updateData.ingredients) updateData.ingredients = JSON.stringify(updateData.ingredients);
        if (updateData.protein) updateData.protein = parseInt(updateData.protein);
        if (updateData.carbs) updateData.carbs = parseInt(updateData.carbs);
        if (updateData.fats) updateData.fats = parseInt(updateData.fats);

        const meal = await prisma.meal.update({
            where: { id },
            data: updateData,
        });

        res.json(meal);
    } catch (error) {
        console.error('Update meal error:', error);
        res.status(500).json({ error: 'Failed to update meal' });
    }
});

// Delete meal (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.meal.delete({ where: { id } });
        res.json({ message: 'Meal deleted' });
    } catch (error) {
        console.error('Delete meal error:', error);
        res.status(500).json({ error: 'Failed to delete meal' });
    }
});

// Rate a meal
router.post('/:id/rate', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id: mealId } = req.params;
        const { rating, feedback } = req.body;
        const userId = req.user!.id;

        const mealRating = await prisma.mealRating.upsert({
            where: {
                mealId_userId: { mealId, userId },
            },
            create: {
                mealId,
                userId,
                rating: parseInt(rating),
                feedback,
            },
            update: {
                rating: parseInt(rating),
                feedback,
            },
        });

        res.json(mealRating);
    } catch (error) {
        console.error('Rate meal error:', error);
        res.status(500).json({ error: 'Failed to rate meal' });
    }
});

// Get user's meal history with ratings
router.get('/history/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;

        const ratings = await prisma.mealRating.findMany({
            where: { userId },
            include: {
                meal: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(ratings);
    } catch (error) {
        console.error('Get meal history error:', error);
        res.status(500).json({ error: 'Failed to get meal history' });
    }
});

export default router;
