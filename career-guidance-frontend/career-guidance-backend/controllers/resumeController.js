const analyzeResume = async (req, res) => {
  try {
    let detectedRole = "Software Engineer";

    if (req.file) {
      const fileName = req.file.originalname.toLowerCase();

      if (fileName.includes("cloud")) {
        detectedRole = "Cloud Engineer";
      } else if (fileName.includes("cyber")) { 
        detectedRole = "Cybersecurity Analyst";
      } else if (fileName.includes("data")) {
        detectedRole = "Data Analyst";
      }
    }

    const { targetRole = detectedRole } = req.body;

    let skillsDetected = [];
    let missingKeywords = [];
    let atsScore = 60;

    const text = (req.body.resumeText || req.file?.originalname || "").toLowerCase();

    if (text.includes("python")) skillsDetected.push("Python");
    if (text.includes("react")) skillsDetected.push("React");
    if (text.includes("aws")) skillsDetected.push("AWS");
    if (text.includes("docker")) skillsDetected.push("Docker");

    const roleSkills = {
      "Software Engineer": ["JavaScript", "React", "Node.js", "Git"],
      "Cloud Engineer": ["AWS", "Docker", "Linux", "Networking"],
      "Data Analyst": ["Python", "SQL", "Excel", "Statistics"],
      "Cybersecurity Analyst": ["Networking", "Security", "Linux", "Python"],
    };

    const required = roleSkills[detectedRole] || [];

    missingKeywords = required.filter(skill => !skillsDetected.includes(skill));

    atsScore = Math.min(100, 50 + skillsDetected.length * 10);

      const keywordScore = Math.min(100, skillsDetected.length * 20);
      const actionScore = Math.min(100, 50 + skillsDetected.length * 5);
      const structureScore = Math.min(100, 60 + skillsDetected.length * 5);

    const evaluation = {
      atsScore,
      verdict: atsScore > 80 ? "Strong Resume" : "Needs Improvement",

  rubricBreakdown: {
    parsabilityScore: structureScore,
    actionVerbDensity: actionScore,
    quantifiedImpactScore: keywordScore,
    keywordMatchScore: keywordScore,
  },

      detectedRole,
      missingKeywords,

      strongActionVerbs: ["Built", "Developed", "Optimized"],

      weakPhrasesToReplace: [
        {
          weak: "Worked on project",
          replacement: "Developed scalable application using MERN stack",
        },
      ],

      bulletPointImprovements: [
        `Add missing skills: ${missingKeywords.join(", ")}`,
      ],

      executiveSummary: `Resume matches ${detectedRole} role at ${atsScore}%`,
    };

    return res.status(200).json({
      success: true,
      detectedRole,
      analysis: evaluation,
    });

  } catch (error) {
    console.error("Resume analysis error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to evaluate resume",
    });
  }
};  

module.exports = { analyzeResume };