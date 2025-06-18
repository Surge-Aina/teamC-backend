const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const trackActivity = require('../middleware/trackActivity');
const userController = require('../controllers/userController');
const User = require('../models/User');

// Admin-only: Get all users
router.get('/', protect, trackActivity, adminOnly, userController.getAllUsers);

// Admin-only: Get user by ID
router.get('/:id', protect, trackActivity, adminOnly, userController.getUserById);

// Update user (self or admin)
router.put('/:id', protect, trackActivity, async (req, res) => {
  const { name, description, status } = req.body;

  if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (name) user.name = name;
  if (description && req.user.role === 'user') {
    user.description = description;
    user.hasDescription = true;
  }
  if (status && req.user.role === 'admin') {
    user.status = status;
  }

  await user.save();
  res.json({ message: 'User updated', user });
});

// Delete user (self or admin)
router.delete('/:id', protect, trackActivity, async (req, res) => {
  if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.deleteOne();
  res.json({ message: 'User deleted' });
});

module.exports = router;