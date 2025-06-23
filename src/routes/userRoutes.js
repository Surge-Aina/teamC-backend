const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const trackActivity = require('../middleware/trackActivity');
const userController = require('../controllers/userController');
const User = require('../models/User');
const { deleteAllUsers } = require('../controllers/userController');

// Admin-only: Get all users
router.get('/', protect, trackActivity, adminOnly, userController.getAllUsers);

// Get workers and managers (managers dash only)
router.get('/workers-managers', protect, (req, res) => {
    console.log("User role for /workers-managers:", req.user.role);
    if (req.user.role !== 'manager' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Managers or admins only' });
    }
    User.find({ role: { $in: ['worker', 'manager'] } })
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ message: 'Server error' }));
});

// Admin-only: Get user by ID
router.get('/:id', protect, trackActivity, adminOnly, userController.getUserById);

// Update user (self or admin)
router.put('/:id', protect, trackActivity, async(req, res) => {
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
router.delete('/:id', protect, trackActivity, async(req, res) => {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'User deleted' });
});

// Admin-only: Get user by ID
router.get('/:id', protect, trackActivity, adminOnly, userController.getUserById);
router.delete('/all', protect, adminOnly, deleteAllUsers); // Deleting all users

module.exports = router;