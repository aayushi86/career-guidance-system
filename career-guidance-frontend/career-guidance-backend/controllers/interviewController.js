const getQuestions = (req, res) => {
  const { role } = req.query;

  let questions = [];

  switch (role) {

    // ☁️ CLOUD ENGINEER
    case "Cloud Engineer":
      questions = [
        "What is AWS EC2?",
        "Explain Docker and its use cases",
        "What is a Load Balancer?",
        "Difference between IaaS, PaaS, SaaS",
        "What is Kubernetes?",
      ];
      break;

    // 🔐 CYBERSECURITY ANALYST
    case "Cybersecurity Analyst":
      questions = [
        "What is SQL Injection?",
        "Explain firewall and IDS/IPS",
        "What is phishing?",
        "Difference between symmetric & asymmetric encryption",
        "What is penetration testing?",
      ];
      break;

    // 🛡 SOC ANALYST
    case "SOC Analyst":
      questions = [
        "What is SIEM?",
        "Explain incident response lifecycle",
        "What is log analysis?",
        "Difference between SOC and NOC",
        "What are common cyber attack types?",
      ];
      break;

    // 📊 DATA ANALYST
    case "Data Analyst":
      questions = [
        "What is data cleaning?",
        "Difference between INNER JOIN and LEFT JOIN",
        "Explain data visualization",
        "What is regression analysis?",
        "What tools have you used (Python, SQL, Excel)?",
      ];
      break;

    // 💻 SOFTWARE ENGINEER
    case "Software Engineer":
      questions = [
        "Explain OOP concepts",
        "What is REST API?",
        "Difference between SQL and NoSQL",
        "What is time complexity?",
        "Explain your projects",
      ];
      break;

    // 🎨 FRONTEND DEVELOPER
    case "Frontend Developer":
      questions = [
        "What is React?",
        "Difference between state and props",
        "What is useEffect?",
        "Explain CSS Flexbox vs Grid",
        "What is responsive design?",
      ];
      break;

    // 🎨 UI/UX DESIGNER
    case "UI/UX Designer":
      questions = [
        "Difference between UI and UX",
        "What is wireframing?",
        "Explain user journey",
        "What tools do you use (Figma, Adobe XD)?",
        "What is usability testing?",
      ];
      break;

    // 🧪 QA TESTER
    case "QA Tester":
    case "Manual QA Tester":
      questions = [
        "What is software testing?",
        "Difference between manual and automation testing",
        "What is a test case?",
        "Explain bug lifecycle",
        "What is regression testing?",
      ];
      break;

    case "Automation QA Tester":
      questions = [
        "What is Selenium?",
        "Difference between manual and automation testing",
        "What is a test script?",
        "Explain CI/CD in testing",
        "What is API testing?",
      ];
      break;

    // 🔥 DEFAULT (fallback)
    default:
      questions = [
        "Tell me about yourself",
        "What are your strengths and weaknesses?",
        "Explain your projects",
        "Why should we hire you?",
        "Where do you see yourself in 5 years?",
      ];
  }

  res.json({
    success: true,
    role,
    questions,
  });
};

module.exports = { getQuestions };