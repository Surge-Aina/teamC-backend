const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role },
        process.env.JWT_SECRET, { expiresIn: '1d' }
    );
};


exports.signup = async(req, res) => {

    const { name, email, password, description, phone, role } = req.body;

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


exports.login = async(req, res) => {
    const { email, password } = req.body;

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