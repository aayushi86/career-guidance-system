const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const Student = require("../models/Student");


// Updated Auth Middleware Import
let protect;
try {
  ({ protect } = require("../middleware/authMiddleware"));
} catch (err) {
  ({ protect } = require("../middleware/auth"));
}

// ==========================================
// 1. GET ALL JOBS
// ==========================================
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, jobs });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching jobs",
      error: err.message,
    });
  }
});

// ==========================================
// 2. GET JOB RECOMMENDATIONS (Must precede /:id)
// ==========================================
router.get("/recommendations", async (req, res) => {
  try {
    const { career } = req.query;

    if (!career) {
      return res.status(400).json({
        success: false,
        message: "Career query param is required",
      });
    }

    const jobs = await Job.find({
      $or: [
        { title: { $regex: career, $options: "i" } },
        { requiredSkills: { $regex: career, $options: "i" } },
        { description: { $regex: career, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching recommendations",
      error: err.message,
    });
  }
});

// ==========================================
// 3. GET APPLICATIONS FOR A STUDENT (Must precede /:id)
// ==========================================
router.get("/my-applications", protect, async (req, res) => {
  try {
    const email = (req.user?.email || req.query.email || "").toLowerCase().trim();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const applications = await Application.find({
      applicantEmail: email,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
      data: applications,
    });
  } catch (err) {
    console.error("Error fetching student applications:", err);
    return res.status(500).json({
      success: false,
      message: "Server error fetching applications",
      error: err.message,
    });
  }
});

// ==========================================
// 4. CREATE A NEW JOB (JNF) & BROADCAST ALERTS
// ==========================================
router.post("/", protect, async (req, res) => {
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
      company: company || req.user?.company || "Campus Partner",
      title,
      ctcPackage,
      minAssessmentScore: Number(minAssessmentScore) || 0,
      minCgpa: Number(minCgpa) || 0,
      eligibleBranches,
      requiredSkills,
      description,
      status: "Active",
      postedBy: req.user?._id,
    });

    try {
      const studentFilter = minCgpa ? { cgpa: { $gte: Number(minCgpa) } } : {};
      const students = await Student.find(studentFilter, "email");

      if (students && students.length > 0) {
        const notifications = students.map((s) => ({
          recipientEmail: s.email.toLowerCase().trim(),
          title: "🚀 New Campus Recruitment Drive",
          message: `${newJob.company} is hiring for ${newJob.title} (${newJob.ctcPackage || "Best in Industry"}).`,
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
      message: "Job drive posted and notifications dispatched",
      job: newJob,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to create job drive",
      error: err.message,
    });
  }
});

// ==========================================
// 5. STUDENT 1-CLICK APPLY
// ==========================================
router.post("/apply", protect, async (req, res) => {
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

    const resolvedEmail = (req.user?.email || applicantEmail || altEmail || "").toLowerCase().trim();
    const resolvedTitle = jobTitle || title || "Software Engineer";
    const resolvedCompany = companyName || company || "Campus Partner";

    if (!resolvedEmail) {
      return res.status(400).json({
        success: false,
        message: "Applicant email is required to apply.",
      });
    }

    const query = jobId
      ? { jobId, applicantEmail: resolvedEmail }
      : { jobTitle: resolvedTitle, companyName: resolvedCompany, applicantEmail: resolvedEmail };

    const existing = await Application.findOne(query);
    if (existing) {
      return res.status(200).json({
        success: true,
        alreadyApplied: true,
        message: "You have already applied for this drive.",
        application: existing,
      });
    }

    const application = await Application.create({
      jobId,
      jobTitle: resolvedTitle,
      companyName: resolvedCompany,
      applicantName: req.user?.name || applicantName || name || "Candidate",
      applicantEmail: resolvedEmail,
      applicantCgpa: applicantCgpa || cgpa || req.user?.cgpa || "8.0",
      careerScore: Number(careerScore || score) || 80,
      skills: Array.isArray(skills) && skills.length > 0 ? skills : ["Problem Solving"],
      education: education || req.user?.branch || "B.Sc IT / B.Tech",
      status: "Applied",
    });

    try {
      await Notification.create({
        recipientEmail: resolvedEmail,
        title: "✅ Application Submitted",
        message: `Your dossier has been sent to ${resolvedCompany} for the ${resolvedTitle} role.`,
        type: "APPLICATION",
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

// ==========================================
// 6. GET ALL APPLICATIONS FOR RECRUITER
// ==========================================
router.get("/recruiter/applications", protect, async (req, res) => {
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

// ==========================================
// 7. UPDATE APPLICATION STATUS & ALERTS
// ==========================================
router.patch("/recruiter/applications/:id", protect, async (req, res) => {
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
      const recipient = updatedApp.applicantEmail.toLowerCase().trim();

      if (status === "Interview Scheduled") {
        await Notification.create({
          recipientEmail: recipient,
          title: "🎯 Interview Scheduled",
          message: `Your interview for ${updatedApp.jobTitle} at ${updatedApp.companyName} is scheduled on ${interviewDate || "soon"} at ${interviewTime || "TBD"}.`,
          type: "INTERVIEW",
          jobId: updatedApp.jobId,
        });
      } else if (status === "Offer Extended" || status === "Selected") {
        await Notification.create({
          recipientEmail: recipient,
          title: "🎉 Offer Extended",
          message: `Congratulations! ${updatedApp.companyName} has extended an offer for ${updatedApp.jobTitle}.`,
          type: "OFFER",
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

// ==========================================
// 8. GET JOB BY ID (Must follow static subroutes)
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
      data: job,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message,
    });
  }
});

module.exports = router;