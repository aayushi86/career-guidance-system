const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    applicantName: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    jobTitle: { type: String, required: true },
    companyName: { type: String, default: "Tech Partner" },
    careerScore: { type: Number, default: 85 },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Interview Scheduled", "Offer Extended", "Rejected"],
      default: "Applied",
    },
    // Interview Metadata
    interviewDate: { type: String },
    interviewTime: { type: String },
    interviewLink: { type: String },
    interviewNotes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);