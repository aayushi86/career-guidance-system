const Job = require("../models/Job");

// POST /api/jobs/jnf - Submit Job Notification Form
const createJNF = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      ctcPackage,
      baseSalary,
      minAssessmentScore,
      minCgpa,
      eligibleBranches,
      requiredSkills,
      selectionProcess,
      description,
      deadline,
      recruiterEmail,
    } = req.body;

    if (!title || !company) {
      return res.status(400).json({ success: false, message: "Role title and company are required." });
    }

    const newJob = await Job.create({
      title,
      company,
      location: location || "Mumbai / Hybrid",
      jobType: jobType || "Full-time",
      ctcPackage: ctcPackage || "8-12 LPA",
      baseSalary: baseSalary || "7.5 LPA",
      minAssessmentScore: Number(minAssessmentScore) || 75,
      minCgpa: Number(minCgpa) || 7.0,
      eligibleBranches: Array.isArray(eligibleBranches)
        ? eligibleBranches
        : (eligibleBranches || "").split(",").map((b) => b.trim()),
      requiredSkills: Array.isArray(requiredSkills)
        ? requiredSkills
        : (requiredSkills || "").split(",").map((s) => s.trim()),
      selectionProcess: Array.isArray(selectionProcess)
        ? selectionProcess
        : ["AI Skill Screening", "Technical Interview", "HR Discussion"],
      description: description || "Official campus drive opening.",
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      recruiterEmail: recruiterEmail || req.user?.email || "recruiter@partner.com",
    });

    return res.status(201).json({
      success: true,
      message: "Job Notification Form (JNF) submitted successfully!",
      job: newJob,
    });
  } catch (error) {
    console.error("JNF submission error:", error);
    return res.status(500).json({ success: false, message: "Error submitting JNF" });
  }
};

// GET /api/jobs - List all active openings
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Active" }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching openings" });
  }
};

module.exports = {
  createJNF,
  getJobs,
};