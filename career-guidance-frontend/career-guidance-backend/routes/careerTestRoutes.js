const express = require("express");
const router = express.Router();

const CareerTest = require("../models/CareerTest");
const { calculateCareerScore } = require("../services/careerScoringService");
const { getCareerRoadmap } = require("../services/careerRoadmapService");

// POST /api/career-test - Submit test, calculate scores, and store in MongoDB
router.post("/", async (req, res) => {
  try {
    const { name, email, interests = [], skills = [], education, preferredWorkStyle } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required.",
      });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one skill.",
      });
    }

    // 1. Calculate scores and match
    const careerResults = calculateCareerScore(skills, interests, preferredWorkStyle);
    const bestCareer = careerResults[0] || { career: "Software Engineer", score: 60 };
    const rawRoadmap = getCareerRoadmap(bestCareer.career);

    const roadmap = rawRoadmap.map((item) => ({
      ...item,
      completed: false,
    }));

    const reason = `Based on your selected skills (${skills.slice(0, 3).join(", ")}) and ${preferredWorkStyle || "analytical"} work style, ${bestCareer.career} is your highest match.`;

    // 2. Persist to MongoDB
    const newSubmission = await CareerTest.create({
      name,
      email,
      education,
      preferredWorkStyle,
      interests,
      skills,
      recommendedCareer: bestCareer.career,
      score: bestCareer.score,
      reason,
      careerMatches: careerResults,
      roadmap,
    });

    return res.status(201).json({
      success: true,
      message: "Career test analyzed and saved successfully.",
      result: {
        id: newSubmission._id,
        career: newSubmission.recommendedCareer,
        score: newSubmission.score,
        reason: newSubmission.reason,
        careerMatches: newSubmission.careerMatches,
        roadmap: newSubmission.roadmap,
      },
    });
  } catch (error) {
    console.error("Error processing career test:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error processing career test.",
    });
  }
});

// PATCH /api/career-test/:id/roadmap-step - Toggle step completion
router.patch("/:id/roadmap-step", async (req, res) => {
  try {
    const { stepNumber, completed } = req.body;
    const { id } = req.params;

    const record = await CareerTest.findById(id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    const stepIndex = record.roadmap.findIndex((s) => s.step === Number(stepNumber));
    if (stepIndex === -1) {
      return res.status(400).json({ success: false, message: "Invalid step number" });
    }

    record.roadmap[stepIndex].completed = completed;
    await record.save();

    return res.json({
      success: true,
      message: "Roadmap progress updated",
      roadmap: record.roadmap,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;