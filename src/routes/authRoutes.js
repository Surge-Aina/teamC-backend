const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController'); // import the two controller functions

/**
 * @route POST /api/auth/signup
 * @description Registers a new user in the system
 * @param {Object} req - Express request object containing user registration details
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with status and message/error
 */
router.post('/signup', signup);

/**
 * @route POST /api/auth/login
 * @description Authenticates an existing user and returns an access token
 * @param {Object} req - Express request object containing login credentials
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with status, message/error, and authentication token
 */
router.post('/login', login);

module.exports = router;