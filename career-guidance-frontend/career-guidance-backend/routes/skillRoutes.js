const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skillController");

const analyzeHandler =
  skillController?.analyzeSkillGap ||
  skillController?.getSkillGap ||
  ((req, res) => res.status(200).json({ success: true, message: "Skill service ready" }));

router.post("/analyze", analyzeHandler);
router.post("/", analyzeHandler);
router.get("/analyze", analyzeHandler);
router.get("/", analyzeHandler);

module.exports = router;