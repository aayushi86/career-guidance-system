const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    name: { type: String, default: "Student Applicant" },
    email: { type: String, required: true, unique: true },
    degree: { type: String, default: "B.Sc IT / B.Tech CSE" },
    college: { type: String, default: "University Institute of Technology" },
    skills: { type: [String], default: ["Python", "SQL", "JavaScript"] },
    targetRole: { type: String, default: "Software Engineer" },
    readinessScore: { type: Number, default: 80 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);