const ResumeAnalysis = require("../models/ResumeAnalysis");
const ROLE_REQUIREMENTS = require("../config/roleRequirements");
const CareerRoadmap = require("../models/CareerRoadmap");
const { generateAIResponse } = require("../services/huggingfaceService");

// Normalize skill string for fuzzy matching
const normalizeSkill = (skill = "") =>
  skill
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

const hasSkill = (studentSkills, requiredSkill) => {
  const normalizedRequired = normalizeSkill(requiredSkill);

  return studentSkills.some((skill) => {
    const normalizedStudent = normalizeSkill(skill);
    return (
      normalizedStudent === normalizedRequired ||
      normalizedStudent.includes(normalizedRequired) ||
      normalizedRequired.includes(normalizedStudent)
    );
  });
};

// ============================================
// GET AVAILABLE ROLES
// GET /api/skill-gap/roles
// ============================================
const getAvailableRoles = async (req, res) => {
  try {
    const roles = Object.keys(ROLE_REQUIREMENTS);
    return res.status(200).json({ success: true, roles });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch roles.",
      error: error.message,
    });
  }
};

// ============================================
// ANALYZE SKILL GAP ONLY
// POST /api/skill-gap/analyze
// ============================================
const analyzeSkillGap = async (req, res) => {
  try {
    const { targetRole } = req.body;

    if (!targetRole || !ROLE_REQUIREMENTS[targetRole]) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid supported target role.",
      });
    }

    const userId = req.user._id || req.user.id;

    const latestResume = await ResumeAnalysis.findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!latestResume) {
      return res.status(404).json({
        success: false,
        message: "Please analyze your resume before checking your skill gap.",
      });
    }

    const currentSkills = [
      ...new Set(
        (latestResume.matchedSkills || [])
          .filter(Boolean)
          .map((s) => s.trim())
      ),
    ];

    const roleRequirements = ROLE_REQUIREMENTS[targetRole];
    const requiredSkills = [
      ...(roleRequirements.coreSkills || []),
      ...(roleRequirements.technicalSkills || []),
      ...(roleRequirements.recommendedSkills || []),
    ];

    const matchedSkills = requiredSkills.filter((s) =>
      hasSkill(currentSkills, s)
    );
    const missingSkills = requiredSkills.filter(
      (s) => !hasSkill(currentSkills, s)
    );

    const readinessScore =
      requiredSkills.length > 0
        ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
        : 0;

    return res.status(200).json({
      success: true,
      targetRole,
      readinessScore,
      skillGapPercentage: 100 - readinessScore,
      currentSkills,
      matchedSkills,
      missingSkills,
      atsScore: latestResume.atsScore,
      fileName: latestResume.fileName,
    });
  } catch (error) {
    console.error("Skill gap analysis error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to analyze skill gap.",
      error: error.message,
    });
  }
};

// ============================================
// GENERATE AI PERSONALIZED ROADMAP
// POST /api/skill-gap/generate-roadmap
// ============================================
const generateCareerRoadmap = async (req, res) => {
  try {
    const { targetRole } = req.body;

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: "Please select a dream target role.",
      });
    }

    const roleRequirements = ROLE_REQUIREMENTS[targetRole];

    if (!roleRequirements) {
      return res.status(400).json({
        success: false,
        message: "Selected career role is not supported.",
      });
    }

    const userId = req.user._id || req.user.id;

    const latestResume = await ResumeAnalysis.findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!latestResume) {
      return res.status(404).json({
        success: false,
        message:
          "Please analyze your resume before generating a personalized roadmap.",
      });
    }

    const currentSkills = [
      ...new Set(
        (latestResume.matchedSkills || [])
          .filter(Boolean)
          .map((skill) => skill.trim())
      ),
    ];

    const requiredSkills = [
      ...(roleRequirements.coreSkills || []),
      ...(roleRequirements.technicalSkills || []),
      ...(roleRequirements.recommendedSkills || []),
    ];

    const matchedSkills = requiredSkills.filter((skill) =>
      hasSkill(currentSkills, skill)
    );

    const missingSkills = requiredSkills.filter(
      (skill) => !hasSkill(currentSkills, skill)
    );

    const readinessScore =
      requiredSkills.length > 0
        ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
        : 0;

    const skillGapPercentage = 100 - readinessScore;

    const prompt = `
You are an expert Career Mentor, Technical Recruiter, and Learning Roadmap Architect.

Create a highly personalized 4-month learning roadmap for a student.

TARGET DREAM ROLE: ${targetRole}
STUDENT'S CURRENT VERIFIED SKILLS: ${currentSkills.join(", ") || "No verified skills detected"}
MISSING SKILLS FOR THE ROLE: ${missingSkills.join(", ") || "No major skill gaps detected"}
CURRENT CAREER READINESS SCORE: ${readinessScore}%
LATEST ATS SCORE: ${latestResume.atsScore}%

Your task:
Create a realistic, structured 4-month learning roadmap.

Important rules:
1. Do NOT overload the student.
2. Prioritize missing core skills first.
3. Build from beginner concepts to advanced concepts.
4. Each month should have a clear career goal.
5. Include practical activities.
6. Include one portfolio project where appropriate.
7. The roadmap should prepare the student for placement opportunities.
8. Focus on practical learning and employability.
9. Do not recommend learning unnecessary technologies.
10. Return ONLY valid JSON.

Use EXACTLY this JSON structure:
{
  "roadmapSummary": "Short personalized summary explaining the student's journey.",
  "careerOutcome": "Expected outcome after completing the roadmap.",
  "months": [
    {
      "month": 1,
      "title": "Month title",
      "goal": "Main goal for this month",
      "skills": ["Skill 1", "Skill 2"],
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "activities": ["Practical activity 1", "Practical activity 2"],
      "project": "Small project or practice project",
      "milestone": "What the student should achieve by the end of the month"
    },
    {
      "month": 2,
      "title": "Month title",
      "goal": "Main goal",
      "skills": [],
      "topics": [],
      "activities": [],
      "project": "",
      "milestone": ""
    },
    {
      "month": 3,
      "title": "Month title",
      "goal": "Main goal",
      "skills": [],
      "topics": [],
      "activities": [],
      "project": "",
      "milestone": ""
    },
    {
      "month": 4,
      "title": "Month title",
      "goal": "Main goal",
      "skills": [],
      "topics": [],
      "activities": [],
      "project": "",
      "milestone": ""
    }
  ]
}
`;

    const aiResponse = await generateAIResponse([
      {
        role: "system",
        content:
          "You are a professional career roadmap generator. Always return strictly valid raw JSON. Never output markdown fences or commentary.",
      },
      {
        role: "user",
        content: prompt,
      },
    ]);

    let roadmapData;

    try {
      let cleaned = String(aiResponse)
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");

      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        cleaned = cleaned.slice(jsonStart, jsonEnd + 1).trim();
      }

      roadmapData = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Roadmap AI JSON parse error:", aiResponse);
      return res.status(500).json({
        success: false,
        message: "AI returned an invalid roadmap format. Please try again.",
      });
    }

    if (
      !roadmapData.months ||
      !Array.isArray(roadmapData.months) ||
      roadmapData.months.length !== 4
    ) {
      return res.status(500).json({
        success: false,
        message:
          "AI failed to generate a complete 4-month roadmap. Please try again.",
      });
    }

    await CareerRoadmap.updateMany(
      { userId, status: "active" },
      { status: "archived" }
    );

    const roadmap = await CareerRoadmap.create({
      userId,
      targetRole,
      currentSkills,
      missingSkills,
      readinessScore,
      skillGapPercentage,
      roadmapSummary: roadmapData.roadmapSummary || "",
      careerOutcome: roadmapData.careerOutcome || "",
      months: roadmapData.months.map((month) => ({
        month: month.month,
        title: month.title || "",
        goal: month.goal || "",
        skills: month.skills || [],
        topics: month.topics || [],
        activities: month.activities || [],
        project: month.project || "",
        milestone: month.milestone || "",
        completed: false,
      })),
      progress: {
        completedTasks: [],
        completedMonths: [],
        overallProgress: 0,
      },
    });

    return res.status(201).json({
      success: true,
      message:
        "Your personalized AI career roadmap has been generated successfully.",
      roadmap,
    });
  } catch (error) {
    console.error("Generate roadmap error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate personalized career roadmap.",
      error: error.message,
    });
  }
};

// ============================================
// GET MY ROADMAP (Auto-load saved roadmap)
// GET /api/skill-gap/my-roadmap
// ============================================
const getMyRoadmap = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const roadmap = await CareerRoadmap.findOne({
      userId,
      status: "active",
    }).sort({ createdAt: -1 });

    if (!roadmap) {
      // Fallback: check for any recent roadmap if active is not flagged
      const fallback = await CareerRoadmap.findOne({ userId }).sort({
        createdAt: -1,
      });

      if (!fallback) {
        return res.status(404).json({
          success: false,
          message: "No career roadmap found. Generate one first.",
        });
      }

      return res.status(200).json({
        success: true,
        roadmap: fallback,
      });
    }

    return res.status(200).json({
      success: true,
      roadmap,
    });
  } catch (error) {
    console.error("Get roadmap error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch career roadmap.",
      error: error.message,
    });
  }
};

// ============================================
// UPDATE ROADMAP PROGRESS
// PATCH /api/skill-gap/roadmap/:roadmapId/progress
// ============================================
const updateRoadmapProgress = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required.",
      });
    }

    const userId = req.user._id || req.user.id;

    const roadmap = await CareerRoadmap.findOne({
      _id: roadmapId,
      userId,
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found.",
      });
    }

    if (!roadmap.progress) {
      roadmap.progress = {
        completedTasks: [],
        completedMonths: [],
        overallProgress: 0,
      };
    }

    if (!Array.isArray(roadmap.progress.completedTasks)) {
      roadmap.progress.completedTasks = [];
    }

    const completedTasks = roadmap.progress.completedTasks;
    const taskIndex = completedTasks.indexOf(taskId);

    // Toggle task ID
    if (taskIndex > -1) {
      completedTasks.splice(taskIndex, 1);
    } else {
      completedTasks.push(taskId);
    }

    // Calculate total possible tasks across all 4 months
    let totalTasks = 0;
    roadmap.months.forEach((month) => {
      totalTasks += month.skills?.length || 0;
      totalTasks += month.topics?.length || 0;
      totalTasks += month.activities?.length || 0;
      if (month.project) totalTasks += 1;
    });

    const completedCount = completedTasks.length;
    const overallProgress =
      totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    roadmap.progress.overallProgress = Math.min(100, Math.max(0, overallProgress));

    await roadmap.save();

    return res.status(200).json({
      success: true,
      message: "Roadmap progress updated successfully.",
      progress: roadmap.progress,
    });
  } catch (error) {
    console.error("Update roadmap progress error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update roadmap progress.",
      error: error.message,
    });
  }
};

module.exports = {
  getAvailableRoles,
  analyzeSkillGap,
  generateCareerRoadmap,
  getMyRoadmap,
  updateRoadmapProgress,
};