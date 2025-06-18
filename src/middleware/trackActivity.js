const User = require('../models/User');

const trackActivity = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        isActive: true,
        lastActive: new Date(),
      });
    }
  } catch (err) {
    console.error('Error updating user activity:', err.message);
    
  }
  next();
};

module.exports = trackActivity;