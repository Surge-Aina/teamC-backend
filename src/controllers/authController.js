const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;


/**
 * Generates a JWT token for the given user
 * @param {Object} user - The user object containing user data
 * @param {string} user._id - The user's unique identifier
 * @param {string} user.role - The user's role
 * @returns {string} JWT token signed with the application's secret
 */
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role },
        process.env.JWT_SECRET, { expiresIn: '1d' }
    );
};


/**
 * Handles user registration
 * @async
 * @function signup
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing user registration data
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password (will be hashed)
 * @param {string} [req.body.description] - Optional user description
 * @param {string} [req.body.phone] - Optional user phone number
 * @param {string} [req.body.role='user'] - Optional user role (defaults to 'user')
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response with user data and JWT token
 * @throws {Error} If user already exists or server error occurs
 */
exports.signup = async(req, res) => {
    const { name, email, password, description, phone, role } = req.body;

    // Validate email type
    if (typeof email !== 'string') {
        return res.status(400).json({ message: 'Email must be a string.' });
    }

    // Validate password type
    if (typeof password !== 'string') {
        return res.status(400).json({ message: 'Password must be a string.' });
    }

    // Validate password strength
    if (!strongPasswordRegex.test(password)) {
        return res.status(400).json({
            message: 'Password must be at least 12 characters long and include uppercase, lowercase, number, and special character.'
        });
    }


    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            description,
            hasDescription: !!description,
            phone,
            role: role || 'user' // use provided role or default to 'user'
        });

        const token = generateToken(user);
        res.status(201).json({ user, token });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/**
 * Handles user authentication
 * @async
 * @function login
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing login credentials
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response with user data and JWT token
 * @throws {Error} If user not found, invalid credentials, or server error occurs
 */
exports.login = async(req, res) => {
    const { email, password } = req.body;

    // Validate email type
    if (typeof email !== 'string') {
        return res.status(400).json({ message: 'Email must be a string.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.status(200).json({ user, token });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};