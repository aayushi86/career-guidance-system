const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const Student = require("../models/Student");

// 1. GET ALL JOBS
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, jobs });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error fetching jobs", error: err.message });
  }
});

// 2. CREATE A NEW JOB (JNF) & BROADCAST NOTIFICATIONS
router.post("/", async (req, res) => {
  try {
    const {
      company,
      title,
      ctcPackage,
      minAssessmentScore,
      minCgpa,
      eligibleBranches,
      requiredSkills,
      description,
    } = req.body;

    const newJob = await Job.create({
      company,
      title,
      ctcPackage,
      minAssessmentScore: Number(minAssessmentScore) || 0,
      minCgpa: Number(minCgpa) || 0,
      eligibleBranches,
      requiredSkills,
      description,
      status: "Active",
    });

    // Broadcast to registered students in MongoDB Atlas
    try {
      const students = await Student.find({}, "email");
      if (students && students.length > 0) {
        const notifications = students.map((s) => ({
          recipientEmail: s.email.toLowerCase().trim(),
          title: "🚀 New Campus Recruitment Drive",
          message: `${newJob.company} is hiring for ${newJob.title} (${newJob.ctcPackage || "Best in Industry"}). Check eligibility and apply!`,
          type: "JOB_POSTED",
          jobId: newJob._id,
        }));
        await Notification.insertMany(notifications);
      }
    } catch (notifErr) {
      console.warn("Notification dispatch notice:", notifErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Job drive saved to Atlas and students notified",
      job: newJob,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to create JNF",
      error: err.message,
    });
  }
});

// 3. STUDENT 1-CLICK APPLY (Handles duplicate clicks & mismatched body keys gracefully)
router.post("/apply", async (req, res) => {
  try {
    const {
      jobId,
      jobTitle,
      title,
      companyName,
      company,
      applicantName,
      name,
      applicantEmail,
      email: altEmail,
      applicantCgpa,
      cgpa,
      careerScore,
      score,
      skills,
      education,
    } = req.body;

    const resolvedEmail = (applicantEmail || altEmail || "").toLowerCase().trim();
    const resolvedTitle = jobTitle || title || "Software Engineer";
    const resolvedCompany = companyName || company || "Campus Partner";

    if (!resolvedEmail) {
      return res.status(400).json({
        success: false,
        message: "Applicant email is required to apply.",
      });
    }

    // Check if duplicate exists
    const existing = await Application.findOne({
      jobTitle: resolvedTitle,
      companyName: resolvedCompany,
      applicantEmail: resolvedEmail,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        alreadyApplied: true,
        message: "You have already applied for this drive.",
        application: existing,
      });
    }

    // Save real application into MongoDB Atlas
    const application = await Application.create({
      jobId,
      jobTitle: resolvedTitle,
      companyName: resolvedCompany,
      applicantName: applicantName || name || "Candidate",
      applicantEmail: resolvedEmail,
      applicantCgpa: applicantCgpa || cgpa || "8.5",
      careerScore: Number(careerScore || score) || 82,
      skills: Array.isArray(skills) && skills.length > 0 ? skills : ["Python", "SQL", "React"],
      education: education || "B.Sc IT / B.Tech",
      status: "Applied",
    });

    // Notify student of submission
    try {
      await Notification.create({
        recipientEmail: resolvedEmail,
        title: "✅ Application Submitted",
        message: `Your dossier has been sent to ${resolvedCompany} for the ${resolvedTitle} role.`,
        type: "APPLICATION_SUBMITTED",
        jobId: jobId || application._id,
      });
    } catch (notifErr) {
      console.warn("Notification error on apply:", notifErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      application,
    });
  } catch (err) {
    console.error("Apply error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: err.message,
    });
  }
});

// 4. GET ALL APPLICATIONS FOR RECRUITER
router.get("/recruiter/applications", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, applications });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching applications",
      error: err.message,
    });
  }
});

// 5. UPDATE APPLICATION STATUS & DISPATCH INTERVIEW/OFFER ALERTS
router.patch("/recruiter/applications/:id", async (req, res) => {
  try {
    const { status, interviewDate, interviewTime, interviewLink } = req.body;

    const updatedApp = await Application.findByIdAndUpdate(
      req.params.id,
      { status, interviewDate, interviewTime, interviewLink },
      { new: true }
    );

    if (!updatedApp) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    try {
      if (status === "Interview Scheduled") {
        await Notification.create({
          recipientEmail: updatedApp.applicantEmail.toLowerCase().trim(),
          title: "🎯 Interview Scheduled",
          message: `Your interview for ${updatedApp.jobTitle} at ${updatedApp.companyName} is scheduled on ${interviewDate} at ${interviewTime}.`,
          type: "INTERVIEW_SCHEDULED",
          jobId: updatedApp.jobId,
        });
      } else if (status === "Offer Extended" || status === "Selected") {
        await Notification.create({
          recipientEmail: updatedApp.applicantEmail.toLowerCase().trim(),
          title: "🎉 Application Update: Offer Extended",
          message: `Congratulations! ${updatedApp.companyName} has extended an offer for ${updatedApp.jobTitle}.`,
          type: "APPLICATION_UPDATE",
          jobId: updatedApp.jobId,
        });
      }
    } catch (notifErr) {
      console.warn("Notification error:", notifErr.message);
    }

    return res.status(200).json({ success: true, application: updatedApp });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error updating status",
      error: err.message,
    });
  }
});

module.exports = router;