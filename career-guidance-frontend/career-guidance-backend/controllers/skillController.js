// POST /api/skills/analyze or /api/skill-gap/analyze
const analyzeSkillGap = async (req, res) => {
  try {
    const { currentSkills = [], targetRole = "Full Stack Developer" } = req.body;

    const skillsList =
      Array.isArray(currentSkills) && currentSkills.length > 0
        ? currentSkills
        : ["Python", "JavaScript", "SQL"];

    const analysisData = {
      targetRole: targetRole || "Full Stack Software Engineer",
      readinessPercentage: 82,
      levelClassification: "Intermediate → Production Ready",
      verifiedProficiencies: skillsList,
      criticalMissingSkills: [
        {
          skill: "Docker & Containerization",
          priority: "High",
          whyNeeded: "Essential for packaging services and CI/CD pipelines.",
        },
        {
          skill: "System Design & Redis",
          priority: "High",
          whyNeeded: "Tested in technical interview rounds for high-scale systems.",
        },
        {
          skill: "Automated Testing (Jest / PyTest)",
          priority: "Medium",
          whyNeeded: "Required for production software engineering quality.",
        },
      ],
      recommendedProjects: [
        {
          projectTitle: "Distributed Task Queue & Caching Layer",
          techStack: "Node.js, Redis, Docker, MongoDB",
          impact: "Demonstrates asynchronous job processing and state caching.",
        },
        {
          projectTitle: "Full-Stack Microservices Placement Portal",
          techStack: "React, Node.js, Express, Tailwind CSS",
          impact: "Proves end-to-end full stack architecture and authentication skills.",
        },
      ],
      topInterviewQuestionsToPrepare: [
        "Explain the internal mechanics of database indexing (B-Trees vs LSM Trees).",
        "How do you handle race conditions and cache invalidation in distributed APIs?",
        "Explain the event loop and asynchronous concurrency model in Node.js.",
      ],
    };

    return res.status(200).json({
      success: true,
      data: analysisData,
    });
  } catch (error) {
    console.error("Skill gap evaluation error:", error);
    return res.status(500).json({ success: false, message: "Error calculating skill gap" });
  }
};

module.exports = {
  analyzeSkillGap,
  getSkillGap: analyzeSkillGap,
};