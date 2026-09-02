const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const Student = require("../models/Student");

// 1. GET ALL APPLICATIONS FOR RECRUITER (Real DB data)
router.get("/recruiter/applications", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, applications });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error fetching applications", error: err.message });
  }
});

// 2. UPDATE APPLICATION STATUS & DISPATCH NOTIFICATION
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

    // Automatically create a notification document in MongoDB Atlas
    if (status === "Interview Scheduled") {
      await Notification.create({
        recipientEmail: updatedApp.applicantEmail.toLowerCase().trim(),
        title: "🎯 Interview Scheduled",
        message: `Your interview for ${updatedApp.jobTitle} at ${updatedApp.companyName} is scheduled on ${interviewDate} at ${interviewTime}.`,
        type: "INTERVIEW_SCHEDULED",
        jobId: updatedApp.jobId,
      });
    } else if (status === "Selected" || status === "Offer Extended") {
      await Notification.create({
        recipientEmail: updatedApp.applicantEmail.toLowerCase().trim(),
        title: "🎉 Application Update: Offer Extended",
        message: `Congratulations! ${updatedApp.companyName} has extended an offer for ${updatedApp.jobTitle}.`,
        type: "APPLICATION_UPDATE",
        jobId: updatedApp.jobId,
      });
    }

    return res.status(200).json({ success: true, application: updatedApp });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error updating status", error: err.message });
  }
});

// 3. POST JNF DRIVE & BROADCAST TO STUDENTS
router.post("/jobs", async (req, res) => {
  try {
    const { company, title, ctcPackage, minAssessmentScore, minCgpa, eligibleBranches, requiredSkills, description } = req.body;

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

    // Broadcast to all registered students
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

    return res.status(201).json({ success: true, message: "Job drive saved to Atlas and students notified", job: newJob });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to create JNF", error: err.message });
  }
});

module.exports = router;