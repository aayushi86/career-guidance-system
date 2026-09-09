const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getAvailableRoles,
  analyzeSkillGap,
  generateCareerRoadmap,
  getMyRoadmap,
  updateRoadmapProgress,
} = require("../controllers/skillGapController");

// Roles and Skill Analysis
router.get("/roles", protect, getAvailableRoles);
router.post("/analyze", protect, analyzeSkillGap);

// AI Roadmap Generation and Retrieval
router.post("/generate-roadmap", protect, generateCareerRoadmap);
router.get("/my-roadmap", protect, getMyRoadmap);

// Progress Tracking
router.patch("/roadmap/:roadmapId/progress", protect, updateRoadmapProgress);

module.exports = router;