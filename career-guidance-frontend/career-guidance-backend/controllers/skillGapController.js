// POST /api/skill-gap/analyze or /api/skills/analyze
const analyzeSkillGap = async (req, res) => {
  try {
    const { currentSkills = [], targetRole = "Full Stack Developer" } = req.body;

    const skillsList = Array.isArray(currentSkills) && currentSkills.length > 0
      ? currentSkills
      : ["Python", "JavaScript", "SQL"];

    const analysisData = {
      targetRole: targetRole || "Full Stack Software Engineer",
      readinessPercentage: 78,
      levelClassification: "Intermediate → Production Ready",
      verifiedProficiencies: skillsList,
      criticalMissingSkills: [
        {
          skill: "Docker & Containerization",
          priority: "High",
          whyNeeded: "Essential for microservices packaging and cloud deployments.",
        },
        {
          skill: "System Design & Caching (Redis)",
          priority: "High",
          whyNeeded: "Evaluated extensively in campus technical interview rounds.",
        },
        {
          skill: "Automated Testing (Jest / Unit Tests)",
          priority: "Medium",
          whyNeeded: "Ensures production code reliability and code coverage standards.",
        },
      ],
      recommendedProjects: [
        {
          projectTitle: "Distributed Task Queue & Caching Layer",
          techStack: "Node.js / Express, Redis, Docker",
          impact: "Demonstrates high-throughput asynchronous job processing and state caching.",
        },
        {
          projectTitle: "Full-Stack Microservices Placement Portal",
          techStack: "React, Node.js, MongoDB, Tailwind CSS",
          impact: "Proves competency in end-to-end full stack architecture and authentication.",
        },
      ],
      topInterviewQuestionsToPrepare: [
        "Explain the internal mechanics of database indexing (B-Trees vs LSM Trees).",
        "How do you resolve race conditions and cache invalidation in distributed APIs?",
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
};