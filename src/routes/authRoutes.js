const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { signup, login } = require('../controllers/authController');
const User = require('../models/User'); // adjust path if needed


router.post('/signup', signup);


router.post('/login', login);


router.post('/google', async (req, res) => {
  const { credential } = req.body;

  try {
    const decoded = JSON.parse(Buffer.from(credential.split('.')[1], 'base64').toString());
    const { email, name } = decoded;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password: 'google_oauth', role: 'user' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Google sign-in error:", error);
    res.status(400).json({ message: 'Invalid Google credential' });
  }
});

module.exports = router;