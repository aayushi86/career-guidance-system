const express = require("express");
const router = express.Router();
const {
  getRecruiterDashboard,
  postJob,
  updateApplicationStatus,
} = require("../controllers/recruiterController");
const { protect } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, getRecruiterDashboard);
router.post("/jobs", protect, postJob);
router.put("/applications/:id/status", protect, updateApplicationStatus);

module.exports = router;