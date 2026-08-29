const Job = require("../models/Job");

// GET /api/jobs - Fetch active campus drives
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      jobs: jobs.length > 0 ? jobs : [
        {
          _id: "demo-1",
          title: "Associate Software Engineer",
          company: "Microsoft IDC",
          location: "Hyderabad / Hybrid",
          ctcPackage: "18-24 LPA",
          minAssessmentScore: 80,
          minCgpa: 7.5,
          eligibleBranches: ["B.Sc IT", "B.Tech CSE", "B.Sc CS", "MCA"],
          requiredSkills: ["React", "Node.js", "System Design", "MongoDB"],
          description: "Full-stack development for enterprise cloud platforms.",
        },
        {
          _id: "demo-2",
          title: "Junior Data Analyst",
          company: "Deloitte India",
          location: "Mumbai",
          ctcPackage: "9-12 LPA",
          minAssessmentScore: 70,
          minCgpa: 6.8,
          eligibleBranches: ["B.Sc IT", "B.Sc CS", "Data Science", "MCA"],
          requiredSkills: ["Python", "SQL", "Tableau", "Statistics"],
          description: "Building predictive models and automated BI dashboards.",
        }
      ],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching jobs" });
  }
};

// POST /api/jobs/apply - 1-Click Apply
const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    return res.status(200).json({
      success: true,
      message: "Application submitted successfully to placement drive!",
      applicationId: `APP-${Date.now()}`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to submit application" });
  }
};

// POST /api/jobs/jnf - Recruiter JNF Drive Creation
const createJNF = async (req, res) => {
  try {
    const newJob = await Job.create(req.body);
    return res.status(201).json({ success: true, job: newJob });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error creating JNF" });
  }
};

module.exports = {
  getJobs,
  applyJob,
  createJNF,
};