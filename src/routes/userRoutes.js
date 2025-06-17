const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');


router.get('/', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password -description');
  res.json(users);
});

router.get('/:id', protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json(user);
});

router.put('/:id', protect, async (req, res) => {
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


router.delete('/:id', protect, async (req, res) => {
  if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.deleteOne();
  res.json({ message: 'User deleted' });
});

module.exports = router;
