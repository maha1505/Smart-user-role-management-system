const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, username, email, password } = req.body;

    const userExists = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        username,
        email,
        password,
        registrationStatus: 'pending',
        isActive: false,
        department: '' // Will be assigned by Admin during approval
    });


    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            registrationStatus: user.registrationStatus
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.comparePassword(password))) {
        if (!user.isActive) {
            return res.status(403).json({
                message: 'Account pending Admin approval. Please contact Admin.'
            });
        }

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                department: user.department,
            },
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
};

module.exports = { registerUser, loginUser };
