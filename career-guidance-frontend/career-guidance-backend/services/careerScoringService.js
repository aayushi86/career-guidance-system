module.exports = {
  calculateCareerScore,
};
const careerProfiles = {
  "Data Scientist": {
    skills: [
      "Python",
      "Statistics",
      "Data Analysis",
      "SQL",
      "Machine Learning",
      "Artificial Intelligence",
    ],
    interests: [
      "Data",
      "AI",
      "Machine Learning",
      "Analytics",
    ],
    workStyles: [
      "Analytical",
      "Independent",
    ],
  },

  "Data Analyst": {
    skills: [
      "Python",
      "SQL",
      "Statistics",
      "Data Analysis",
      "Excel",
      "Power BI",
    ],
    interests: [
      "Data",
      "Analytics",
      "Business",
    ],
    workStyles: [
      "Analytical",
      "Collaborative",
    ],
  },

  "Full Stack Developer": {
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "MongoDB",
    ],
    interests: [
      "Web Development",
      "Development",
      "Programming",
    ],
    workStyles: [
      "Creative",
      "Collaborative",
      "Independent",
    ],
  },

  "Backend Developer": {
    skills: [
      "JavaScript",
      "Node.js",
      "Python",
      "Java",
      "SQL",
      "MongoDB",
    ],
    interests: [
      "Backend Development",
      "Programming",
      "Development",
    ],
    workStyles: [
      "Analytical",
      "Independent",
    ],
  },

  "Frontend Developer": {
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
    ],
    interests: [
      "Web Development",
      "UI",
      "Design",
    ],
    workStyles: [
      "Creative",
      "Collaborative",
    ],
  },

  "Machine Learning Engineer": {
    skills: [
      "Python",
      "Statistics",
      "Machine Learning",
      "Artificial Intelligence",
      "SQL",
    ],
    interests: [
      "AI",
      "Machine Learning",
      "Data",
    ],
    workStyles: [
      "Analytical",
      "Independent",
    ],
  },

  "AI Engineer": {
    skills: [
      "Python",
      "Machine Learning",
      "Artificial Intelligence",
      "Statistics",
    ],
    interests: [
      "AI",
      "Artificial Intelligence",
      "Machine Learning",
    ],
    workStyles: [
      "Analytical",
      "Creative",
    ],
  },

  "Database Administrator": {
    skills: [
      "SQL",
      "MongoDB",
      "MySQL",
      "Database",
    ],
    interests: [
      "Database",
      "Data",
    ],
    workStyles: [
      "Analytical",
      "Independent",
    ],
  },
};


function calculateCareerScore(
  selectedSkills = [],
  selectedInterests = [],
  workStyle = ""
) {
  const skills = selectedSkills.map((skill) =>
    skill.toLowerCase()
  );

  const interests = selectedInterests.map((interest) =>
    interest.toLowerCase()
  );

  const normalizedWorkStyle = workStyle.toLowerCase();

  const results = [];

  for (const [career, profile] of Object.entries(careerProfiles)) {

    const careerSkills = profile.skills.map((skill) =>
      skill.toLowerCase()
    );

    const careerInterests = profile.interests.map((interest) =>
      interest.toLowerCase()
    );

    const careerWorkStyles = profile.workStyles.map((style) =>
      style.toLowerCase()
    );


    // -------------------------
    // Skill Score
    // -------------------------

    const matchedSkills = skills.filter((skill) =>
      careerSkills.includes(skill)
    );

    const skillScore =
      careerSkills.length > 0
        ? (matchedSkills.length / careerSkills.length) * 60
        : 0;


    // -------------------------
    // Interest Score
    // -------------------------

    const matchedInterests = interests.filter((interest) =>
      careerInterests.includes(interest)
    );

    const interestScore =
      careerInterests.length > 0
        ? (matchedInterests.length / careerInterests.length) * 25
        : 0;


    // -------------------------
    // Work Style Score
    // -------------------------

    const workStyleScore =
      normalizedWorkStyle &&
      careerWorkStyles.includes(normalizedWorkStyle)
        ? 15
        : 0;


    // -------------------------
    // Final Score
    // -------------------------

    const finalScore = Math.round(
      skillScore +
      interestScore +
      workStyleScore
    );


    results.push({
      career,
      score: Math.min(finalScore, 100),
      matchedSkills,
      matchedInterests,
    });
  }


  // Highest score first

  results.sort((a, b) => b.score - a.score);

  return results;
}


module.exports = {
  calculateCareerScore,
};