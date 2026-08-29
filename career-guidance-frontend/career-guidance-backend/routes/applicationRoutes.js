const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const mongoose = require("mongoose");

// POST /api/applications - Submit a new job application
router.post("/", async (req, res) => {
  try {
    const {
      jobId,
      jobTitle,
      companyName,
      applicantName,
      applicantEmail,
      education,
      skills = [],
      matchedCareer,
      careerScore,
    } = req.body;

    // Required fields check
    if (!jobTitle || !companyName || !applicantName || !applicantEmail) {
      return res.status(400).json({
        success: false,
        message: "Job details, applicant name, and email are required.",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicantEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({
      applicantEmail,
      jobTitle,
      companyName,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this role.",
      });
    }

    // Handle valid vs dummy ObjectId
    const validJobId = mongoose.Types.ObjectId.isValid(jobId) ? jobId : null;

    const newApplication = await Application.create({
      jobId: validJobId,
      jobTitle,
      companyName,
      applicantName,
      applicantEmail,
      education,
      skills,
      matchedCareer,
      careerScore,
      status: "Applied",
    });

    return res.status(201).json({
      success: true,
      message: `Successfully applied to ${jobTitle} at ${companyName}!`,
      application: newApplication,
    });
  } catch (error) {
    console.error("Error creating job application:", error);
    return res.status(500).json({
      success: false,
      message: "Server error submitting application.",
      error: error.message,
    });
  }
});

// GET /api/applications/my?email=student@example.com - View applicant history
router.get("/my", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email query param is required.",
      });
    }

    const applications = await Application.find({ applicantEmail: email }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching applications.",
    });
  }
});

module.exports = router;