const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const adminExists = await User.findOne({ role: 'admin' });

        if (adminExists) {
            console.log('Admin account already exists.');
            process.exit();
        }

        const admin = new User({
            name: 'System Administrator',
            username: 'admin',
            email: 'admin@system.com',
            password: 'adminpassword123', // Will be hashed by pre-save hook
            role: 'admin',
            registrationStatus: 'approved',
            isActive: true,
            joiningDate: new Date()
        });

        await admin.save();
        console.log('Admin account created successfully!');
        console.log('Username: admin');
        console.log('Password: adminpassword123');

        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
