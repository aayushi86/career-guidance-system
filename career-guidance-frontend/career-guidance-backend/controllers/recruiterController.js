const Job = require("../models/Job");
const Application = require("../models/Application");
const Notification = require("../models/Notification");

// GET /api/recruiters/dashboard
const getRecruiterDashboard = async (req, res) => {
  try {
    const recruiterEmail = req.user?.email;

    // 1. Fetch jobs posted by this recruiter, or fall back to all jobs
    let jobs = [];
    if (recruiterEmail) {
      jobs = await Job.find({ postedBy: recruiterEmail }).sort({ createdAt: -1 });
    }

    // If this recruiter has no specific postings yet, fetch all available drives
    if (!jobs || jobs.length === 0) {
      jobs = await Job.find().sort({ createdAt: -1 });
    }

    // 2. Fetch all student applications
    const applications = await Application.find().sort({ createdAt: -1 });

    const totalApplicants = applications.length;
    const shortlistedCount = applications.filter((a) => a.status === "Shortlisted").length;
    const interviewCount = applications.filter((a) => a.status === "Interview Scheduled").length;

    return res.status(200).json({
      success: true,
      stats: {
        totalJobs: jobs.length,
        totalApplicants,
        shortlistedCount,
        interviewCount,
      },
      jobs,
      recentApplications: applications,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ success: false, message: "Error fetching recruiter dashboard" });
  }
};

// POST /api/recruiters/jobs
const postJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      location,
      salary,
      jobType,
      targetCareer,
      skillsRequired,
    } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, Company, and Description are required.",
      });
    }

    const newJob = await Job.create({
      title,
      company,
      description,
      location: location || "Remote / Hybrid",
      salary: salary || "Competitive Stipend / LPA",
      jobType: jobType || "Full-time",
      targetCareer: targetCareer || title,
      skillsRequired: Array.isArray(skillsRequired)
        ? skillsRequired
        : skillsRequired ? skillsRequired.split(",").map((s) => s.trim()) : [],
      postedBy: req.user.email,
    });

    return res.status(201).json({
      success: true,
      message: "Job drive posted successfully!",
      job: newJob,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error creating job posting" });
  }
};

// PUT /api/recruiters/applications/:id/status
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, interviewDate, interviewTime, interviewLink, interviewNotes } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Application ID is required" });
    }

    const updateData = { status: status || "Interview Scheduled" };
    if (interviewDate) updateData.interviewDate = interviewDate;
    if (interviewTime) updateData.interviewTime = interviewTime;
    if (interviewLink) updateData.interviewLink = interviewLink;
    if (interviewNotes) updateData.interviewNotes = interviewNotes;

    const application = await Application.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: false }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: "Application record not found" });
    }

    // Trigger notification if candidate has an assigned user/applicantId
    if (application.applicantId || application.user) {
      const recipientId = application.applicantId || application.user;

      let title = `Application Update: ${application.jobTitle}`;
      let message = `Your application status for ${application.jobTitle} has been updated to "${application.status}".`;

      if (application.status === "Interview Scheduled") {
        title = `🎯 Interview Scheduled: ${application.jobTitle}`;
        message = `You have an interview scheduled on ${interviewDate || "TBD"} at ${interviewTime || "TBD"}. Check your applications portal for details.`;
      }

      await Notification.create({
        recipient: recipientId,
        title,
        message,
        type: application.status === "Interview Scheduled" ? "interview" : "application",
        link: "/my-applications",
      }).catch((err) => console.error("Notification creation skipped:", err.message));
    }

    return res.status(200).json({
      success: true,
      message: `Status updated to ${application.status}`,
      application,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to update status" });
  }
};

module.exports = {
  getRecruiterDashboard,
  postJob,
  updateApplicationStatus,
};