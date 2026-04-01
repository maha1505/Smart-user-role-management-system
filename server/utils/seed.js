const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Department = require('../models/Department');

dotenv.config();

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

const seedData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Seed Departments
        console.log('Seeding departments...');
        for (const dept of departments) {
            await Department.findOneAndUpdate(
                { name: dept.name },
                dept,
                { upsert: true, new: true }
            );
        }
        console.log('Departments seeded successfully!');

        // Seed Admin User
        console.log('Seeding admin user...');
        const adminExists = await User.findOne({ username: adminUser.username });
        if (!adminExists) {
            await User.create(adminUser);
            console.log('Admin user created successfully!');
            console.log('Credentials:');
            console.log(`  Username: ${adminUser.username}`);
            console.log(`  Password: ${adminUser.password}`);
        } else {
            console.log('Admin user already exists.');
        }

        console.log('Seeding process complete! Closing connection...');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err.message);
        process.exit(1);
    }
};

seedData();

