const express = require("express");
const router = express.Router();
const {
  submitCareerTest,
  getCareerTestResults,
} = require("../controllers/careerTestController");
const { protect } = require("../middleware/authMiddleware");

router.post("/test", protect, submitCareerTest);
router.post("/", protect, submitCareerTest);
router.get("/results", protect, getCareerTestResults);
router.get("/", protect, getCareerTestResults);

module.exports = router;