// POST /api/resume/analyze
const analyzeResume = async (req, res) => {
  try {
    const { resumeText = "", targetRole = "Software Engineer" } = req.body;

    const evaluation = {
      atsScore: 84,
      verdict: "Strong Foundation — Add Quantifiable Business Metrics",
      rubricBreakdown: {
        parsabilityScore: 88,
        actionVerbDensity: 82,
        quantifiedImpactScore: 75,
        keywordMatchScore: 85,
      },
      detectedRole: targetRole,
      missingKeywords: ["Docker", "REST API Security", "Redis", "Unit Testing"],
      strongActionVerbs: ["Architected", "Engineered", "Optimized", "Integrated"],
      weakPhrasesToReplace: [
        { weak: "Helped with frontend", replacement: "Architected responsive client components with React" },
        { weak: "Handled data", replacement: "Optimized database queries, reducing latency by 30%" },
      ],
      bulletPointImprovements: [
        "Include concrete metrics (e.g., 'Reduced query latency by 40%', 'Supported 500+ daily requests').",
        "Ensure every project details the exact technology stack used in production.",
      ],
      executiveSummary: "The candidate presents strong technical foundations. Adding quantified metrics and deployment tools will improve screening pass rates.",
    };

    return res.status(200).json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    console.error("Resume analysis error:", error);
    return res.status(500).json({ success: false, message: "Failed to evaluate resume" });
  }
};

module.exports = {
  analyzeResume,
};