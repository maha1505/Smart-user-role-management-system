const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Department = require('../models/Department');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const departments = [
    { name: 'Engineering', color: '#58a6ff', description: 'Technical development and infrastructure' },
    { name: 'Human Resources', color: '#ff7b72', description: 'People management and recruitment' },
    { name: 'Finance', color: '#79c0ff', description: 'Financial planning and accounting' },
    { name: 'Marketing', color: '#d29922', description: 'Brand awareness and growth' },
    { name: 'Sales', color: '#3fb950', description: 'Revenue generation and client relations' },
    { name: 'Operations', color: '#a5d6ff', description: 'Daily business processes and logistics' },
];

const seedDepartments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        for (const dept of departments) {
            const exists = await Department.findOne({ name: dept.name });
            if (!exists) {
                await Department.create(dept);
                console.log(`Created department: ${dept.name}`);
            } else {
                console.log(`Department already exists: ${dept.name}`);
            }
        }

        console.log('Seeding completed successfully.');
        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedDepartments();
