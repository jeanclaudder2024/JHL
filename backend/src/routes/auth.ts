import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, role = 'GUEST' } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user - new users start as GUEST until they choose a service
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role === 'ADMIN' ? 'GUEST' : role, // Prevent self-registration as admin
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });

        // Generate token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'default-secret',
            { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
        );

        res.status(201).json({ user, token });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            include: { company: true },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'default-secret',
            { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            include: { company: true },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

// Demo login (for quick access during development)
router.post('/demo-login', async (req, res) => {
    try {
        const { role } = req.body;

        let email: string;
        switch (role) {
            case 'ADMIN':
                email = 'admin@jhl.com';
                break;
            case 'COMPANY_ADMIN':
                email = 'sarah@aura.com';
                break;
            case 'GUEST':
                // For GUEST demo, create a temporary user or find existing guest
                const guestUser = await prisma.user.findFirst({
                    where: { role: 'GUEST' }
                });

                if (guestUser) {
                    const token = jwt.sign(
                        { userId: guestUser.id },
                        process.env.JWT_SECRET || 'default-secret',
                        { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
                    );
                    const { password: _, ...userWithoutPassword } = guestUser;
                    return res.json({ user: userWithoutPassword, token });
                }

                // Create a new guest user for demo
                const newGuest = await prisma.user.create({
                    data: {
                        email: `guest_${Date.now()}@demo.jhl.com`,
                        password: await bcrypt.hash('guest123', 10),
                        name: 'Guest User',
                        role: 'GUEST'
                    }
                });

                const guestToken = jwt.sign(
                    { userId: newGuest.id },
                    process.env.JWT_SECRET || 'default-secret',
                    { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
                );
                const { password: __, ...newGuestWithoutPassword } = newGuest;
                return res.json({ user: newGuestWithoutPassword, token: guestToken });
            default:
                email = 'jane@example.com';
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: { company: true },
        });

        if (!user) {
            return res.status(404).json({ error: 'Demo user not found. Please run db:seed' });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'default-secret',
            { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
        );

        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        console.error('Demo login error:', error);
        res.status(500).json({ error: 'Demo login failed' });
    }
});

export default router;
