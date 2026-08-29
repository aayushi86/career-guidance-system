const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, default: "Mumbai / Hybrid" },
    jobType: { type: String, default: "Full-time", enum: ["Full-time", "Internship", "Remote"] },
    
    // JNF Compensation Details
    ctcPackage: { type: String, default: "10-14 LPA" },
    baseSalary: { type: String, default: "8.5 LPA" },
    joiningBonus: { type: String, default: "1.5 LPA" },

    // Institutional Eligibility Requirements
    minAssessmentScore: { type: Number, default: 75 },
    minCgpa: { type: Number, default: 7.0 },
    eligibleBranches: {
      type: [String],
      default: ["B.Sc IT", "B.Tech CSE", "B.Sc CS", "MCA", "Data Science"],
    },
    requiredSkills: {
      type: [String],
      default: ["Python", "SQL", "JavaScript"],
    },

    // Recruitment Process Steps
    selectionProcess: {
      type: [String],
      default: ["AI Skill Screening", "Online Coding Round", "Technical Interview", "HR Discussion"],
    },

    description: { type: String, default: "Seeking high-performing engineering students for campus hiring." },
    deadline: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    postedBy: { type: String, default: "Recruiter" },
    recruiterEmail: { type: String, default: "recruiter@company.com" },
    status: { type: String, default: "Active", enum: ["Active", "Closed", "Under Review"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);