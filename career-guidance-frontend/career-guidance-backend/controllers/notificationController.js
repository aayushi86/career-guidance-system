const Notification = require("../models/Notification");

// GET /api/notifications/:email
const getNotificationsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const notifications = await Notification.find({
      recipientEmail: email.toLowerCase().trim(),
    })
      .sort({ createdAt: -1 })
      .limit(15);

    const unreadCount = await Notification.countDocuments({
      recipientEmail: email.toLowerCase().trim(),
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// PATCH /api/notifications/:id/read
const markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    return res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating notification" });
  }
};

module.exports = {
  getNotificationsByEmail,
  markNotificationRead,
};