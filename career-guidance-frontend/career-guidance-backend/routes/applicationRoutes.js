const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const mongoose = require("mongoose");

// POST - Apply Job
router.post("/", async (req, res) => {
  try {
  const {
  jobId,
  jobTitle,
  companyName,
  applicantName,
  applicantEmail,
  education,
  applicantCgpa,
  skills = [],
  matchedCareer,
  careerScore,
} = req.body;

    if (!jobTitle || !companyName || !applicantName || !applicantEmail) {
      return res.status(400).json({
        success: false,
        message: "Job details, applicant name, and email are required.",
      });
    }

    const cleanEmail = applicantEmail.toLowerCase().trim();

    const existingApplication = await Application.findOne({
      applicantEmail: cleanEmail,
      jobTitle,
      companyName,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this role.",
      });
    }

    const validJobId = mongoose.Types.ObjectId.isValid(jobId) ? jobId : null;

   const newApplication = await Application.create({
  jobId: validJobId,
  jobTitle,
  companyName,
  applicantName,
  applicantEmail: cleanEmail,

  education,
  applicantCgpa,
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// GET MY APPLICATIONS
router.get("/my", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const applications = await Application.find({
      applicantEmail: cleanEmail,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching applications",
    });
  }
});

// GET ALL (Recruiter/Admin)
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching applications",
    });
  }
});

// UPDATE STATUS
// UPDATE APPLICATION STATUS / INTERVIEW
router.put("/:id", async (req, res) => {
  try {
    const {
      status,
      interviewDate,
      interviewTime,
      interviewLink,
      interviewNotes,
    } = req.body;

    const updatedApp = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status,
        interviewDate,
        interviewTime,
        interviewLink,
        interviewNotes,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedApp) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.json({
      success: true,
      application: updatedApp,
    });
  } catch (err) {
    console.error("Update application error:", err);

    return res.status(500).json({
      success: false,
      message: "Update failed",
      error: err.message,
    });
  }
});

module.exports = router;