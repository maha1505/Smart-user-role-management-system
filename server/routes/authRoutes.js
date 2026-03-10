const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { getDepartments } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/departments', getDepartments);

module.exports = router;
