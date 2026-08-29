const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

// Handle root, /student, and /my endpoints
router.get("/", protect, getNotifications);
router.get("/student", protect, getNotifications);
router.get("/my", protect, getNotifications);

router.put("/read-all", protect, markAllAsRead);
router.put("/:id/read", protect, markAsRead);

module.exports = router;