const Notification = require("../v1/notifications/models/notificationModel");

module.exports.addNotification = async (userid, message, type, section) => {
    try {
        const notification = new Notification({
            userId: userid,
            message,
            type,
            section,
        });
        console.log(notification)
        await notification.save();
    } catch (error) {
        console.error(error);
    }
}

module.exports.getNotification = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json({
            status: 200,
            notifications,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            error: "Internal Server Error",
        });
    }
}

module.exports.readAllNotification = async (req, res) => {
    try {
        await Notification.updateMany({}, { $set: { isRead: true } });

        const notifications = await Notification.find();

        res.status(200).json({
            status: 200,
            message: "All notifications marked as read",
            notifications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            error: "Internal Server Error",
        });
    }
}