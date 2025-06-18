const User = require('../models/User');

// GET all workers under this manager
exports.getWorkersUnderManager = async (req, res) => {
  try {
    const workers = await User.find({ managerId: req.user._id, role: 'worker' });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE a worker under this manager
exports.deleteWorker = async (req, res) => {
  try {
    const worker = await User.findById(req.params.id);
    if (!worker || worker.role !== 'worker' || String(worker.managerId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this worker' });
    }

    await worker.deleteOne();
    res.json({ message: 'Worker deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET active managers and workers
exports.getActiveUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['manager', 'worker'] }, isActive: true });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST create new worker (from manager)
exports.addWorker = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newWorker = new User({
      name,
      email,
      password,
      role: 'worker',
      managerId: req.user._id
    });
    await newWorker.save();
    res.status(201).json(newWorker);
  } catch (err) {
    res.status(400).json({ message: 'Error creating worker' });
  }
};