const Student = require("../models/Student");
const User = require("../models/User");
const CareerTest = require("../models/CareerTest");
const Application = require("../models/Application");

// GET /api/students/profile or /api/students/dashboard
const getStudentProfile = async (req, res) => {
  try {
    const userEmail = req.user?.email || req.query.email;

    if (!userEmail) {
      return res.status(200).json({
        success: true,
        profile: {
          name: "Student",
          email: "student@college.edu",
          skills: ["Python", "SQL", "React"],
          degree: "B.Tech CSE",
          college: "University Institute of Technology",
          careerTestDone: true,
          readinessScore: 82,
        },
      });
    }

    // Try finding profile
    let student = await Student.findOne({ email: userEmail });
    const user = await User.findOne({ email: userEmail });
    const tests = await CareerTest.find({ email: userEmail }).sort({ createdAt: -1 });
    const applications = await Application.find({ applicantEmail: userEmail });

    const latestTest = tests[0] || null;

    const profileData = {
      name: user?.name || student?.name || "Student",
      email: userEmail,
      skills: student?.skills?.length ? student.skills : ["Python", "JavaScript", "SQL", "Data Structures"],
      degree: student?.degree || "B.Sc IT / B.Tech CSE",
      college: student?.college || "Mumbai University",
      targetRole: latestTest?.topRecommendation || student?.targetRole || "Software Engineer",
      readinessScore: student?.readinessScore || (latestTest ? 85 : 70),
      totalApplications: applications.length,
      latestTest,
    };

    return res.status(200).json({
      success: true,
      profile: profileData,
    });
  } catch (error) {
    console.error("Dashboard profile fetch error:", error);
    return res.status(200).json({
      success: true,
      profile: {
        name: "Student Applicant",
        email: req.user?.email || "student@college.edu",
        skills: ["Python", "SQL", "React"],
        degree: "B.Tech CSE",
        college: "University Institute of Technology",
        readinessScore: 78,
      },
    });
  }
};

// PUT /api/students/profile
const updateStudentProfile = async (req, res) => {
  try {
    const userEmail = req.user?.email || req.body.email;
    const { name, skills, degree, college, targetRole } = req.body;

    let student = await Student.findOneAndUpdate(
      { email: userEmail },
      {
        $set: {
          name,
          skills: Array.isArray(skills) ? skills : (skills || "").split(",").map((s) => s.trim()),
          degree,
          college,
          targetRole,
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      student,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
};