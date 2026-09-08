const express = require("express");
const router = express.Router();

let authModule;
try {
  authModule = require("../middleware/auth");
} catch {
  try {
    authModule = require("../middleware/authMiddleware");
  } catch {
    authModule = {};
  }
}

const protect =
  authModule.protect ||
  authModule.verifyToken ||
  authModule.auth ||
  ((req, res, next) => next());

let recruiterController = {};
try {
  recruiterController = require("../controllers/recruiterController");
} catch {
  // Safe fallback if controller is partially implemented
}

const {
  getRecruiterDashboard,
  postJob,
  updateApplicationStatus,
  getApplications,
} = recruiterController;

const Application = require("../models/Application");
const Job = require("../models/Job");

// ==========================================
// RECRUITER ROLE GUARD
// ==========================================
const authorizeRecruiter = (req, res, next) => {
  if (req.user && (req.user.role === "recruiter" || req.user.role === "admin")) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access forbidden: Requires recruiter privileges.",
  });
};

// ==========================================
// ROUTES
// ==========================================

if (typeof getRecruiterDashboard === "function") {
  router.get("/dashboard", protect, authorizeRecruiter, getRecruiterDashboard);
}

if (typeof postJob === "function") {
  router.post("/jobs", protect, authorizeRecruiter, postJob);
}

// GET /api/recruiter/applications
router.get("/applications", protect, authorizeRecruiter, async (req, res) => {
  try {
    if (typeof getApplications === "function") {
      return getApplications(req, res);
    }

    // Dynamic schema path discovery
    const schemaPaths = Object.keys(Application.schema.paths);
    const userField = schemaPaths.includes("studentId")
      ? "studentId"
      : schemaPaths.includes("student")
      ? "student"
      : schemaPaths.includes("applicant")
      ? "applicant"
      : schemaPaths.includes("user")
      ? "user"
      : null;

    const jobField = schemaPaths.includes("jobId")
      ? "jobId"
      : schemaPaths.includes("job")
      ? "job"
      : null;

    // Optional company isolation if recruiter represents a specific company
    let filter = {};
    if (req.user?.role === "recruiter" && req.user?.company && jobField) {
      const companyJobs = await Job.find({
        $or: [{ postedBy: req.user._id }, { company: req.user.company }],
      }).select("_id");

      const jobIds = companyJobs.map((j) => j._id);
      if (jobIds.length > 0) {
        filter[jobField] = { $in: jobIds };
      }
    }

    let query = Application.find(filter).sort({ createdAt: -1 });

    if (userField) {
      query = query.populate({
        path: userField,
        select: "name email readinessScore skills cgpa branch",
        options: { strictPopulate: false },
      });
    }

    if (jobField) {
      query = query.populate({
        path: jobField,
        select: "title company location salary jobType",
        options: { strictPopulate: false },
      });
    }

    const rawApplications = await query.exec();

    // Map output to normalize both studentId and jobId shape for the frontend
    const applications = rawApplications.map((app) => {
      const doc = app.toObject ? app.toObject() : { ...app };
      return {
        ...doc,
        studentId: doc.studentId || doc.student || doc.applicant || doc.user,
        jobId: doc.jobId || doc.job,
      };
    });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
      data: applications,
    });
  } catch (err) {
    console.error("Error fetching recruiter applications:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch applications.",
    });
  }
});

// Update Application Status (Support both PUT and PATCH)
const handleStatusUpdate = async (req, res) => {
  if (typeof updateApplicationStatus === "function") {
    return updateApplicationStatus(req, res);
  }

  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required." });
    }

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { $set: { status: status.toUpperCase() } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    return res.status(200).json({
      success: true,
      message: `Status updated to ${status.toUpperCase()}`,
      application: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

router.put("/applications/:id/status", protect, authorizeRecruiter, handleStatusUpdate);
router.patch("/applications/:id/status", protect, authorizeRecruiter, handleStatusUpdate);

module.exports = router;