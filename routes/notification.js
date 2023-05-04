const Notification = require('../models/notification');

exports.createNotification = async (req, res) => {
    try {
        const notification = new Notification({
            message: req.body.message,
            type: req.body.type,
            user: req.user._id
        });
        await notification.save();
        res.status(201).json(notification);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id }).sort('-createdAt');
        res.json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
