const User = require('../models/User');

const trackActivity = async (req, res, next) => {
  try {
    if (!req.user) return next();

    const cookieLastActive = req.cookies.lastActive;
    const now = Date.now();

    const TIMEOUT = 10 * 60 * 1000; // 10 minutes

    if (!cookieLastActive || now - new Date(cookieLastActive).getTime() > TIMEOUT) {
      // If no cookie or too old, mark user inactive
      await User.findByIdAndUpdate(req.user._id, { isActive: false });
    } else {
      // User is still active → update in DB
      await User.findByIdAndUpdate(req.user._id, {
        isActive: true,
        lastActive: new Date()
      });
    }

    // Always update cookie to current time
    res.cookie('lastActive', new Date().toISOString(), {
      httpOnly: true,
      sameSite: 'Strict',
      secure: false // change to true if using HTTPS
    });
  } catch (err) {
    console.error('Error tracking activity via cookie:', err.message);
  }

  next();
};

module.exports = trackActivity;