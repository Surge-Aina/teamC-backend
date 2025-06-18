const User = require('../models/User');


exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find().select('name role email _id');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name role email _id');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};