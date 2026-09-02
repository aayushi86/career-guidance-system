const express = require("express");
const router = express.Router();

const jobController = require("../controllers/jobController");
const Job = require("../models/Job");

// ===============================
// JOB ROUTES
// ===============================

// Get all jobs
router.get("/", jobController.getJobs);

// Recruiter publishes JNF
router.post("/jnf", jobController.createJNF);

// Student applies for job
router.post("/apply", jobController.applyJob);

// Student's applications
router.get("/my-applications", jobController.getMyApplications);

// ===============================
// DELETE JOB
// ===============================

router.delete("/:id", async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete job",
    });
  }
});

// ===============================
// UPDATE JOB
// ===============================

router.put("/:id", async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      message: "Job updated successfully",
      job: updated,
    });
  } catch (error) {
    console.error("Update job error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update job",
    });
  }
});

module.exports = router;