const User = require('../models/User');



exports.deleteAllUsers = async (req, res) => {
    const { password } = req.body;

    if (password !== process.env.DELETE_ALL_PASSWORD) {
        return res.status(403).json({ message: 'Forbidden: Incorrect delete password' });
    }

    try {
        await User.deleteMany({});
        res.status(200).json({ message: 'All users deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


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