const User = require('../models/User');

// GET manager info for logged-in worker
exports.getMyManager = async (req, res) => {
  try {
    const worker = await User.findById(req.user._id);
    const manager = await User.findById(worker.managerId);
    res.json(manager);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving manager' });
  }
};

// DELETE worker's own profile
exports.deleteOwnProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting profile' });
  }
};