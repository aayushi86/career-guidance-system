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

    // ✅ Correct placed logic
    const placedCount = applications.filter(
        (a) => a.status === "Selected"
      ).length;

    const placementRate =
      totalStudents > 0
        ? Math.round((placedCount / totalStudents) * 100)
        : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalRecruiters,
        totalJobs,
        totalApplications: applications.length,
        placementRate,
      },
      recentActivity: applications.reverse(), // latest first
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

module.exports = { getAdminStats };