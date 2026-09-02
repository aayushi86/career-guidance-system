const express = require("express");

const router = express.Router();

const {
  getNotificationsByEmail,
  markNotificationRead,
} = require("../controllers/notificationController");

router.get("/:email", getNotificationsByEmail);

router.patch("/:id/read", markNotificationRead);

module.exports = router;
