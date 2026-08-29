const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Student = require("../models/Student");

// GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalJobs = await Job.countDocuments();
    const applications = await Application.find();

    const placedCount = applications.filter((a) => a.status === "Shortlisted" || a.status === "Interview Scheduled").length;
    const placementRate = totalStudents > 0 ? Math.min(100, Math.round((placedCount / totalStudents) * 100)) : 0;

    // Aggregate domain statistics
    const jobs = await Job.find();
    const domainCounts = {};
    jobs.forEach((j) => {
      const domain = j.targetCareer || "General";
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalRecruiters,
        totalJobs,
        totalApplications: applications.length,
        placementRate,
        domainDistribution: domainCounts,
      },
      recentActivity: applications.slice(0, 8),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error loading admin stats" });
  }
};

module.exports = { getAdminStats };