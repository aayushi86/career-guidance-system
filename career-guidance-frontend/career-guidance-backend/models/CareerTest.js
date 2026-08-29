const mongoose = require("mongoose");

const careerTestSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Student Assessment" },
    email: { type: String, required: true },
    score: { type: Number, default: 85 },
    recommendedCareer: { type: String, default: "Software Developer" },
    topRecommendation: { type: String, default: "Software Developer" },
    matchScores: { type: Array, default: [] },
    responses: { type: Array, default: [] },
    roadmap: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerTest", careerTestSchema);