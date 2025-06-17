const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController'); // import the two controller functions

// 🔐 POST /api/auth/signup → Registers a new user
router.post('/signup', signup);

// 🔐 POST /api/auth/login → Authenticates an existing user
router.post('/login', login);

module.exports = router;