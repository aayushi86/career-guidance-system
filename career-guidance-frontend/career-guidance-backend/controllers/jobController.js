const Job = require("../models/Job");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const User = require("../models/User"); // Using User/Student collection

// POST /api/jobs/jnf - Recruiter JNF Drive Creation with Automated Notification
// POST /api/jobs/jnf - Recruiter JNF Drive Creation
const createJNF = async (req, res) => {
  try {
    // 1. Create and store the job
    const newJob = await Job.create(req.body);

    // 2. Get all students
    const students = await Student.find({}, "email");

    // 3. Create notification for every student
    if (students.length > 0) {
      const notifications = students.map((student) => ({
        recipientEmail: student.email,
        title: "🚀 New Job Opportunity",
        message: `${newJob.company} has posted a new job: ${newJob.title}`,
        type: "JOB_POSTED",
        jobId: newJob._id,
      }));

      await Notification.insertMany(notifications);
    }

    return res.status(201).json({
      success: true,
      message: "Job posted and students notified successfully",
      job: newJob,
    });

  } catch (error) {
    console.error("Create JNF Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error creating JNF",
    });
  }
};

 
// GET /api/jobs/my-applications - Scoped to the logged-in student
const getMyApplications = async (req, res) => {
  try {
    const studentEmail = req.query.email || req.user?.email;

    // Filter by email if provided, otherwise fetch relevant user records
    const filter = studentEmail ? { applicantEmail: studentEmail } : {};
    const apps = await Application.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications: apps,
    });
  } catch (error) {
    console.error("Error fetching student applications:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve student applications",
    });
  }
};

// GET /api/jobs - List all active jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: { $ne: "Closed" } }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching jobs" });
  }
};

// POST /api/jobs/apply - 1-Click Apply
const applyJob = async (req, res) => {
  try {
    const { jobId, applicantName, applicantEmail, applicantCgpa, education, matchedCareer, careerScore, skills, companyName, jobTitle } = req.body;

    const newApp = await Application.create({
      applicantName: applicantName || req.user?.name || "Student Applicant",
      applicantEmail: applicantEmail || req.user?.email || "student@example.com",
      applicantCgpa: applicantCgpa || "8.0",
      education: education || "B.Sc IT",
      jobId,
      jobTitle: jobTitle || "Software Engineer",
      companyName: companyName || "Partner Company",
      matchedCareer: matchedCareer || "Software Engineer",
      careerScore: Number(careerScore) || 75,
      skills: Array.isArray(skills) ? skills : ["Problem Solving"],
      status: "Applied",
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      application: newApp,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error submitting application", error: error.message });
  }
};

module.exports = {
  createJNF,
  getMyApplications,
  getJobs,
  applyJob,
};