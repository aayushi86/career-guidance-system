
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { analyzeResume } = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Support both /analyze and /grade endpoints
router.post("/analyze", upload.single("resume"), analyzeResume);
router.post("/grade", upload.single("resume"), analyzeResume);

module.exports = router;
