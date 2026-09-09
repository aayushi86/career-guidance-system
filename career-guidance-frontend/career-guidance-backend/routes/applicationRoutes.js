const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Student = require("../models/Student");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
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
// ==========================================
// UPDATE APPLICATION STATUS & NOTIFY STUDENT
// PATCH /api/applications/recruiter/applications/:id
// ==========================================

router.patch("/recruiter/applications/:id", async (req, res) => {
  try {
    const {
      status,
      interviewDate,
      interviewTime,
      interviewLink,
      interviewNotes,
    } = req.body;

    const allowedStatuses = [
      "Applied",
      "Shortlisted",
      "Interview Scheduled",
      "Offer Extended",
      "Rejected",
      "Selected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const previousStatus = application.status;

    // Update application details
    application.status = status;

    if (interviewDate !== undefined) {
      application.interviewDate = interviewDate;
    }

    if (interviewTime !== undefined) {
      application.interviewTime = interviewTime;
    }

    if (interviewLink !== undefined) {
      application.interviewLink = interviewLink;
    }

    if (interviewNotes !== undefined) {
      application.interviewNotes = interviewNotes;
    }

    await application.save();


    // ==========================================
    // CREATE NOTIFICATION ONLY WHEN STATUS CHANGES
    // ==========================================

    if (previousStatus !== status) {

      const recipientEmail =
        application.applicantEmail
          .toLowerCase()
          .trim();


      // ------------------------------------------
      // SHORTLISTED
      // ------------------------------------------

      if (status === "Shortlisted") {

        await Notification.create({
          recipientEmail,

          title: "🎉 You Have Been Shortlisted!",

          message:
            `Congratulations! You have been shortlisted for the ${application.jobTitle} position at ${application.companyName}. Stay prepared for the next stage.`,

          type: "SHORTLISTED",

          jobId: application.jobId,

          applicationId: application._id,
        });
      }


      // ------------------------------------------
      // INTERVIEW SCHEDULED
      // ------------------------------------------

      if (status === "Interview Scheduled") {

        await Notification.create({
          recipientEmail,

          title: "🎯 Interview Scheduled",

          message:
            `Your interview for ${application.jobTitle} at ${application.companyName} is scheduled on ${application.interviewDate || "the provided date"} at ${application.interviewTime || "the provided time"}.`,

          type: "INTERVIEW",

          jobId: application.jobId,

          applicationId: application._id,
        });
      }


      // ------------------------------------------
      // OFFER EXTENDED
      // ------------------------------------------

      if (
        status === "Selected" ||
        status === "Offer Extended"
      ) {

        await Notification.create({
          recipientEmail,

          title: "🎉 Congratulations! Application Update",

          message:
            `Congratulations! ${application.companyName} has updated your application for the ${application.jobTitle} position.`,

          type: "OFFER",

          jobId: application.jobId,

          applicationId: application._id,
        });
      }


      // ------------------------------------------
      // REJECTED
      // ------------------------------------------

      if (status === "Rejected") {

        await Notification.create({
          recipientEmail,

          title: "Application Status Updated",

          message:
            `Your application for ${application.jobTitle} at ${application.companyName} has been updated. Thank you for participating in the recruitment process.`,

          type: "REJECTED",

          jobId: application.jobId,

          applicationId: application._id,
        });
      }
    }


    return res.status(200).json({
      success: true,

      message: "Application status updated successfully.",

      application,
    });

  } catch (error) {

    console.error(
      "Application status update error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to update application status.",

      error: error.message,
    });
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