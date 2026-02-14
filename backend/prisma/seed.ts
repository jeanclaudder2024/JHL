import { PrismaClient, UserRole, MealType, ApplicationStatus, EventStatus, EmployeeStatus, InvoiceStatus, TicketStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Clean existing data
    await prisma.chatMessage.deleteMany();
    await prisma.supportTicket.deleteMany();
    await prisma.mealRating.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.meal.deleteMany();
    await prisma.eventInquiry.deleteMany();
    await prisma.companyApplication.deleteMany();
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@jhl.com',
            password: adminPassword,
            name: 'JHL Admin',
            role: UserRole.ADMIN,
        },
    });
    console.log('✅ Admin user created');

    // Create Companies
    const companies = await Promise.all([
        prisma.company.create({
            data: {
                name: 'TechFlow Systems',
                industry: 'Technology',
                employeeCount: 120,
                location: 'San Francisco',
            },
        }),
        prisma.company.create({
            data: {
                name: 'Aura Creative',
                industry: 'Marketing',
                employeeCount: 45,
                location: 'New York',
            },
        }),
        prisma.company.create({
            data: {
                name: 'Nexus Finance',
                industry: 'Finance',
                employeeCount: 300,
                location: 'Chicago',
            },
        }),
    ]);
    console.log('✅ Companies created');

    // Create Company Applications
    await prisma.companyApplication.create({
        data: {
            companyId: companies[0].id,
            contactName: 'John Smith',
            contactEmail: 'hr@techflow.io',
            phone: '+1 555-0100',
            mealTypes: JSON.stringify(['Daily Lunch', 'Office Snacks']),
            dietaryFocus: JSON.stringify(['Balanced Standard', 'Vegetarian/Vegan']),
            notes: 'We need meals for 100+ employees daily',
            status: ApplicationStatus.PENDING,
        },
    });

    await prisma.companyApplication.create({
        data: {
            companyId: companies[1].id,
            contactName: 'Sarah Wilson',
            contactEmail: 'sarah@aura.com',
            phone: '+1 555-0101',
            mealTypes: JSON.stringify(['Daily Lunch', 'Breakfast Meetings']),
            dietaryFocus: JSON.stringify(['Balanced Standard']),
            status: ApplicationStatus.APPROVED_PAID,
            invoiceAmount: 3200.00,
        },
    });

    await prisma.companyApplication.create({
        data: {
            companyId: companies[2].id,
            contactName: 'Mike Johnson',
            contactEmail: 'ops@nexus.com',
            phone: '+1 555-0102',
            mealTypes: JSON.stringify(['Daily Lunch']),
            dietaryFocus: JSON.stringify(['Balanced Standard']),
            status: ApplicationStatus.REJECTED,
        },
    });
    console.log('✅ Company applications created');

    // Create users for approved company
    const companyAdminPassword = await bcrypt.hash('company123', 10);
    const companyAdmin = await prisma.user.create({
        data: {
            email: 'sarah@aura.com',
            password: companyAdminPassword,
            name: 'Sarah Jenkins',
            role: UserRole.COMPANY_ADMIN,
            companyId: companies[1].id,
        },
    });

    // Create individual user
    const userPassword = await bcrypt.hash('user123', 10);
    const individualUser = await prisma.user.create({
        data: {
            email: 'jane@example.com',
            password: userPassword,
            name: 'Jane Doe',
            role: UserRole.INDIVIDUAL,
        },
    });
    console.log('✅ Users created');

    // Create Employees for approved company
    await prisma.employee.createMany({
        data: [
            { companyId: companies[1].id, name: 'Alice Cooper', email: 'alice@aura.com', status: EmployeeStatus.ACTIVE, dietary: 'Vegetarian' },
            { companyId: companies[1].id, name: 'Bob Smith', email: 'bob@aura.com', status: EmployeeStatus.ACTIVE, dietary: 'Standard' },
            { companyId: companies[1].id, name: 'Charlie Day', email: 'charlie@aura.com', status: EmployeeStatus.INVITED, dietary: null },
        ],
    });
    console.log('✅ Employees created');

    // Create Invoices
    await prisma.invoice.createMany({
        data: [
            { companyId: companies[1].id, date: new Date('2024-05-01'), amount: 4200.00, status: InvoiceStatus.PAID, items: 'April Catering (120 meals)' },
            { companyId: companies[1].id, date: new Date('2024-06-01'), amount: 4200.00, status: InvoiceStatus.PENDING, items: 'May Catering (120 meals)' },
        ],
    });
    console.log('✅ Invoices created');

    // Create Event Inquiries
    await prisma.eventInquiry.createMany({
        data: [
            {
                eventType: 'Product Launch',
                eventDate: new Date('2024-08-12'),
                startTime: '18:00',
                location: 'SoHo Loft, NYC',
                guestCount: 150,
                contactName: 'Elena Fisher',
                contactEmail: 'elena@brand.com',
                phone: '+1 555-0200',
                serviceStyle: JSON.stringify(['Cocktail & Canapés']),
                dietaryFocus: JSON.stringify(['Standard', 'Vegetarian']),
                budget: '$15k - $50k',
                vision: 'Modern, minimalist aesthetic with innovative fusion cuisine',
                status: EventStatus.NEW,
            },
            {
                eventType: 'Private Dinner',
                eventDate: new Date('2024-06-20'),
                startTime: '19:30',
                location: 'Private Residence, Brooklyn',
                guestCount: 20,
                contactName: 'Marcus Low',
                contactEmail: 'm.low@gmail.com',
                phone: '+1 555-0201',
                serviceStyle: JSON.stringify(['Seated Multi-Course']),
                dietaryFocus: JSON.stringify(['Standard']),
                budget: '$5k - $15k',
                vision: 'Intimate dinner party with Mediterranean theme',
                status: EventStatus.IN_DISCUSSION,
            },
            {
                eventType: 'Wedding',
                eventDate: new Date('2024-09-01'),
                startTime: '16:00',
                location: 'Botanical Gardens, Central Park',
                guestCount: 200,
                contactName: 'Sophie Turner',
                contactEmail: 'sophie@wed.com',
                phone: '+1 555-0202',
                serviceStyle: JSON.stringify(['Seated Multi-Course', 'Buffet / Family Style']),
                dietaryFocus: JSON.stringify(['Standard', 'Vegetarian', 'Vegan']),
                budget: '$50k+',
                vision: 'Garden party elegance with seasonal farm-to-table menu',
                status: EventStatus.CONFIRMED,
            },
        ],
    });
    console.log('✅ Event inquiries created');

    // Create Meals
    const meals = await Promise.all([
        prisma.meal.create({
            data: {
                name: 'Miso Glazed Salmon',
                description: 'Wild caught salmon with organic brown rice and steamed bok choy.',
                calories: 650,
                image: 'https://picsum.photos/id/1080/800/600',
                date: new Date('2024-05-20'),
                type: MealType.Standard,
                ingredients: JSON.stringify(['Wild Salmon', 'Brown Rice', 'Bok Choy', 'Miso Paste', 'Mirin', 'Sesame Seeds', 'Green Onion']),
                protein: 45,
                carbs: 48,
                fats: 22,
            },
        }),
        prisma.meal.create({
            data: {
                name: 'Truffle Mushroom Risotto',
                description: 'Creamy arborio rice with black truffle oil, aged parmesan, and wild mushrooms.',
                calories: 580,
                image: 'https://picsum.photos/id/292/800/600',
                date: new Date('2024-05-21'),
                type: MealType.Vegetarian,
                ingredients: JSON.stringify(['Arborio Rice', 'Portobello Mushrooms', 'Vegetable Broth', 'Parmesan Cheese', 'Truffle Oil', 'White Wine', 'Thyme']),
                protein: 18,
                carbs: 75,
                fats: 20,
            },
        }),
        prisma.meal.create({
            data: {
                name: 'Quinoa Power Bowl',
                description: 'Nutrient-packed bowl with avocado, chickpeas, kale, and lemon tahini dressing.',
                calories: 450,
                image: 'https://picsum.photos/id/493/800/600',
                date: new Date('2024-05-22'),
                type: MealType.Vegan,
                ingredients: JSON.stringify(['Quinoa', 'Chickpeas', 'Curly Kale', 'Avocado', 'Lemon Juice', 'Tahini', 'Cherry Tomatoes', 'Cucumber']),
                protein: 20,
                carbs: 55,
                fats: 18,
            },
        }),
    ]);
    console.log('✅ Meals created');

    // Create Subscription for individual user
    await prisma.subscription.create({
        data: {
            userId: individualUser.id,
            planName: 'The Executive Daily',
            price: 750.00,
            period: 'per month',
            cycle: 'Monthly',
            features: JSON.stringify(['5 Meals/Week', 'Monthly']),
            nextBilling: new Date('2024-06-20'),
        },
    });
    console.log('✅ Subscriptions created');

    // Create Support Tickets
    await prisma.supportTicket.createMany({
        data: [
            { userId: individualUser.id, subject: 'Late Delivery', status: TicketStatus.OPEN, lastMessage: 'My lunch arrived 30 mins late.' },
            { userId: companyAdmin.id, subject: 'Invoice Question', status: TicketStatus.RESOLVED, lastMessage: 'Thank you for clarifying.' },
        ],
    });
    console.log('✅ Support tickets created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('  Admin: admin@jhl.com / admin123');
    console.log('  Company Admin: sarah@aura.com / company123');
    console.log('  Individual: jane@example.com / user123');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
