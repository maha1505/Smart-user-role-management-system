const User = require('../models/User');
const Department = require('../models/Department');

const departments = [
    { name: 'Engineering', color: '#58a6ff', description: 'Technical and development team' },
    { name: 'Human Resources', color: '#7ee787', description: 'Handling people and recruitment' },
    { name: 'Marketing', color: '#d2a8ff', description: 'Brand and market growth' },
    { name: 'Finance', color: '#ffa657', description: 'Accounts and payroll' },
    { name: 'Sales', color: '#ff7b72', description: 'Revenue generation' }
];

const adminUser = {
    name: 'Admin',
    username: 'admin',
    email: 'admin@sys.com',
    password: 'admin123', // Will be hashed by User model pre-save hook
    role: 'admin',
    registrationStatus: 'approved',
    isActive: true,
    department: 'Engineering',
    joiningDate: new Date()
};

const autoSeedData = async () => {
    try {
        // Only seed if departments are empty
        const deptCount = await Department.countDocuments();
        if (deptCount > 0) {
            console.log('Database already has data. Skipping auto-seeding.');
            return;
        }

        console.log('Database is empty. Starting auto-seeding...');

        // Seed Departments
        for (const dept of departments) {
            await Department.findOneAndUpdate(
                { name: dept.name },
                dept,
                { upsert: true, new: true }
            );
        }
        console.log('Departments seeded successfully!');

        // Seed Admin User
        const adminExists = await User.findOne({ username: adminUser.username });
        if (!adminExists) {
            await User.create(adminUser);
            console.log('Admin user created successfully!');
            console.log('Initial Admin Credentials: admin / admin123');
        } else {
            console.log('Admin user already exists.');
        }

        console.log('Auto-seeding complete!');
    } catch (err) {
        console.error('Auto-seeding Error:', err.message);
    }
};

module.exports = autoSeedData;


