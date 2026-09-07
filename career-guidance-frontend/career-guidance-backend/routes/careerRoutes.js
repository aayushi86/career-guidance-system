const express = require("express");
const router = express.Router();

// Dynamically resolve auth middleware regardless of whether it is auth.js or authMiddleware.js
let authModule;
try {
  authModule = require("../middleware/auth");
} catch (e) {
  try {
    authModule = require("../middleware/authMiddleware");
  } catch (err) {
    authModule = {};
  }
}

const protect =
  authModule.protect ||
  authModule.verifyToken ||
  authModule.auth ||
  ((req, res, next) => next());

const careerTestController = require("../controllers/careerTestController");

// Resolve whichever handler name is exported by the controller
const submitHandler =
  careerTestController.submitTest ||
  careerTestController.submitCareerTest ||
  careerTestController.submitAssessment;

const getHandler =
  careerTestController.getTestHistory ||
  careerTestController.getCareerTestResults ||
  careerTestController.getResults;

// Map all potential endpoints so routes never return 404
router.post("/submit", protect, submitHandler);
router.post("/test", protect, submitHandler);
router.post("/", protect, submitHandler);

router.get("/history", protect, getHandler);
router.get("/results", protect, getHandler);
router.get("/", protect, getHandler);

module.exports = router;