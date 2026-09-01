const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    applicantName: {
      type: String,
      required: true,
      trim: true,
    },
    applicantEmail: {
      type: String,
      required: true,
      trim: true,
    },
    applicantCgpa: {
      type: String,
      default: "N/A",
    },
    education: {
      type: String,
      default: "B.Sc IT",
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    jobTitle: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    matchedCareer: {
      type: String,
      default: "Software Engineer",
    },
    careerScore: {
      type: Number,
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: [
        "Applied",
        "Shortlisted",
        "Interview Scheduled",
        "Selected",
        "Offer Extended",
        "Rejected",
      ],
      default: "Applied",
    },
    interviewDate: {
      type: String,
      default: "",
    },
    interviewTime: {
      type: String,
      default: "",
    },
    interviewLink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);