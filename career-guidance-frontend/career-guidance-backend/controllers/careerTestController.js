const CareerTest = require("../models/CareerTest");
const Student = require("../models/Student");

const submitCareerTest = async (req, res) => {
  try {
    const {
      skills = [],
      interests = [],
      education = "B.Tech / B.Sc IT",
      workStyle = "Analytical & Research Oriented",
      email,
      name,
      score,
      recommendedCareer,
      topRecommendation,
      roadmap,
    } = req.body;

    const userEmail = email || req.user?.email || "student@college.edu";
    const studentName = name || req.user?.name || "Student Applicant";
    
    let chosenRole = "Software Developer";
    let finalRoadmap = [];

    // 🔥 CLOUD
    if (
      interests.includes("Cloud Computing") ||
      skills.includes("AWS") ||
      skills.includes("Docker")
    ) {
      chosenRole = "Cloud Engineer";

      finalRoadmap = [
        { title: "Learn Networking", duration: "2 Weeks" },
        { title: "Learn Linux", duration: "2 Weeks" },
        { title: "Learn AWS / Azure", duration: "3 Weeks" },
        { title: "Docker & Kubernetes", duration: "3 Weeks" },
        { title: "Deploy Projects on Cloud", duration: "2 Weeks" },
      ];
    }

    // 🔥 CYBERSECURITY
    else if (
      interests.includes("CyberSecurity") ||
      skills.includes("Networking")
    ) {
      chosenRole = "Cybersecurity Analyst";

      finalRoadmap = [
        { title: "Learn Networking Basics", duration: "2 Weeks" },
        { title: "Learn Linux", duration: "2 Weeks" },
        { title: "Learn Ethical Hacking", duration: "3 Weeks" },
        { title: "Practice Labs (TryHackMe)", duration: "3 Weeks" },
        { title: "Prepare Certifications", duration: "2 Weeks" },
      ];
    }

    // 🔥 WEB DEV
    else if (
      interests.includes("Web Development") ||
      skills.includes("React") ||
      skills.includes("JavaScript")
    ) {
      chosenRole = "Full Stack Developer";

      finalRoadmap = [
        { title: "HTML, CSS, JS", duration: "2 Weeks" },
        { title: "React", duration: "2 Weeks" },
        { title: "Node.js & Express", duration: "2 Weeks" },
        { title: "MongoDB", duration: "1 Week" },
        { title: "Build MERN Projects", duration: "3 Weeks" },
      ];
    }

    // 🔥 DATA / AI
    else if (
      skills.includes("Python") ||
      interests.includes("AI") ||
      interests.includes("Data")
    ) {
      chosenRole = "Data Analyst";

      finalRoadmap = [
        { title: "Learn Python", duration: "2 Weeks" },
        { title: "Pandas & NumPy", duration: "2 Weeks" },
        { title: "SQL", duration: "1 Week" },
        { title: "Power BI / Tableau", duration: "2 Weeks" },
        { title: "Build Data Projects", duration: "3 Weeks" },
      ];
    }

    // 🔥 DEFAULT
    else {
      finalRoadmap = [
        { title: "Learn Programming", duration: "2 Weeks" },
        { title: "Learn DSA", duration: "3 Weeks" },
        { title: "Build Projects", duration: "3 Weeks" },
      ];
    }

    const testScore = typeof score === "number" ? score : 88;

    const defaultRoadmap = [
      {
        phase: "Phase 1: Fundamentals & DSA",
        title: "Phase 1: Fundamentals & DSA",
        duration: "Weeks 1-4",
        description: "Master core algorithmic problem solving and database indexing.",
      },
      {
        phase: "Phase 2: Production Full Stack Project",
        title: "Phase 2: Production Full Stack Project",
        duration: "Weeks 5-8",
        description: "Build secure REST APIs, authentication layers, and responsive UI.",
      },
      {
        phase: "Phase 3: ATS Resume & Interview Drills",
        title: "Phase 3: ATS Resume & Interview Drills",
        duration: "Weeks 9-12",
        description: "Optimize keywords and prepare technical system design questions.",
      },
    ];


    const domainScores = [
      {
        domain: chosenRole,
        matchPercentage: Math.floor(Math.random() * 20) + 80,
      },
    ];

    // 1. Create CareerTest record with all possible field aliases
    const savedTest = await CareerTest.create({
      name: studentName,
      email: userEmail,
      score: testScore,
      recommendedCareer: chosenRole,
      topRecommendation: chosenRole,
      matchScores: domainScores,
      roadmap: finalRoadmap,
    });

    // 2. Persist directly to Student record
    await Student.findOneAndUpdate(
      { email: userEmail },
      {
        $set: {
          name: studentName,
          email: userEmail,
          skills: skills.length ? skills : ["Python", "SQL", "React"],
          degree: education,
          targetRole: chosenRole,
          readinessScore: testScore,
          careerTestDone: true,
          latestTestId: savedTest._id,
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    return res.status(201).json({
      success: true,
      message: "Career assessment complete!",
      result: {
        topRecommendation: chosenRole,
        recommendedCareer: chosenRole,
        career: chosenRole,
        overallMatchScore: testScore,
        score: testScore,
        domainBreakdown: domainScores,
        roadmap: finalRoadmap,
        _id: savedTest._id,
      },
    });
  } catch (error) {
    console.error("Career test submit error:", error);
    return res.status(500).json({ success: false, message: "Error submitting career test" });
  }
};

const getCareerTestResults = async (req, res) => {
  try {
    const userEmail = req.user?.email || req.query.email;
    if (!userEmail) {
      return res.status(200).json({ success: true, results: [] });
    }
    const results = await CareerTest.find({ email: userEmail }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, results });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch results" });
  }
};

module.exports = {
  submitCareerTest,
  getCareerTestResults,
};