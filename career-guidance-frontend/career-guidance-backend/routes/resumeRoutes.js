const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload"); // ✅ ADD THIS
const { analyzeResume } = require("../controllers/resumeController"); // ✅ USE DIRECT

// ✅ ONLY THIS ROUTE NEEDED
router.post("/analyze", upload.single("resume"), analyzeResume);

module.exports = router;