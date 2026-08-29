function generateCareerRecommendation({
  skills = [],
  interests = [],
  preferredWorkStyle = "",
}) {
  const allData = [
    ...skills,
    ...interests,
    preferredWorkStyle,
  ]
    .join(" ")
    .toLowerCase();

  const careerResults = calculateCareerScore(
  skills,
  interests,
  preferredWorkStyle
);

const bestCareer = careerResults[0];

  // DATA SCIENCE
  if (
    allData.includes("python") &&
    (allData.includes("statistics") ||
      allData.includes("data analysis") ||
      allData.includes("machine learning") ||
      allData.includes("data"))
  ) {
    career = "Data Scientist";

    reason =
      "Your combination of Python, data-related skills, and analytical interests makes Data Science a strong career match.";

    roadmap = [
      "Strengthen Python programming",
      "Learn Statistics and Probability",
      "Master NumPy and Pandas",
      "Learn Data Visualization with Matplotlib",
      "Learn SQL for data analysis",
      "Learn Machine Learning",
      "Build 3 Data Science projects",
      "Create a strong Data Science portfolio",
    ];
  }

  // AI / ML
  else if (
    allData.includes("artificial intelligence") ||
    allData.includes("machine learning") ||
    allData.includes("ai")
  ) {
    career = "AI / Machine Learning Engineer";

    reason =
      "Your interest in AI and machine learning indicates a strong potential for an AI-focused career.";

    roadmap = [
      "Master Python",
      "Learn Mathematics for Machine Learning",
      "Study Statistics and Probability",
      "Learn NumPy and Pandas",
      "Learn Machine Learning algorithms",
      "Learn Scikit-learn",
      "Study Deep Learning",
      "Build AI/ML projects",
    ];
  }

  // WEB DEVELOPMENT
  else if (
    allData.includes("react") ||
    allData.includes("javascript") ||
    allData.includes("html") ||
    allData.includes("web")
  ) {
    career = "Full Stack Developer";

    reason =
      "Your web development skills and JavaScript-related interests make Full Stack Development a suitable career path.";

    roadmap = [
      "Master HTML and CSS",
      "Master JavaScript",
      "Learn React",
      "Learn Node.js and Express",
      "Learn MongoDB",
      "Build full-stack applications",
      "Learn Git and GitHub",
      "Prepare for developer interviews",
    ];
  }

  // DATA ANALYST
  else if (
    allData.includes("sql") &&
    (allData.includes("excel") ||
      allData.includes("power bi") ||
      allData.includes("data analysis"))
  ) {
    career = "Data Analyst";

    reason =
      "Your SQL and data-analysis-oriented skills indicate a strong fit for Data Analytics.";

    roadmap = [
      "Master Excel",
      "Learn SQL",
      "Learn Python for Data Analysis",
      "Master Pandas",
      "Learn Data Visualization",
      "Learn Power BI",
      "Practice business case studies",
      "Build a Data Analytics portfolio",
    ];
  }

  // JAVA
  else if (allData.includes("java")) {
    career = "Java Software Developer";

    reason =
      "Your Java programming skills indicate a strong foundation for a software development career.";

    roadmap = [
      "Master Core Java",
      "Learn Object-Oriented Programming",
      "Learn Data Structures and Algorithms",
      "Learn SQL",
      "Learn Spring Boot",
      "Build REST APIs",
      "Build Java projects",
      "Prepare for technical interviews",
    ];
  }

  return {
    career,
    reason,
    roadmap,
  };
}

export default generateCareerRecommendation;