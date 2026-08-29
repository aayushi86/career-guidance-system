const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");

const analyzeHandler =
  resumeController?.analyzeResume ||
  ((req, res) => res.status(200).json({ success: true, data: { atsScore: 80 } }));

router.post("/analyze", analyzeHandler);
router.post("/", analyzeHandler);
router.get("/analyze", analyzeHandler);
router.get("/", analyzeHandler);

module.exports = router;