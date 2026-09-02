const getCareerAdvice = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({
        success: true,
        reply: "Please ask something 😊",
      });
    }

    const msg = message.toLowerCase();

    let reply = "I am your AI Career Assistant 🤖";

    // ☁️ CLOUD ENGINEER
    if (msg.includes("cloud")) {
      reply = `To become a Cloud Engineer:
- Learn AWS / Azure / GCP
- Docker & Kubernetes
- Linux & Networking
- Build real cloud projects`;
    }

    // 🔐 CYBERSECURITY ANALYST
    else if (msg.includes("cyber")) {
      reply = `For Cybersecurity:
- Networking & Linux
- Ethical Hacking
- Tools: Wireshark, Metasploit
- Practice on TryHackMe`;
    }

    // 🛡 SOC ANALYST
    else if (msg.includes("soc")) {
      reply = `To become a SOC Analyst:
- Learn SIEM tools (Splunk)
- Log analysis
- Incident response
- Networking fundamentals`;
    }

    // 📊 DATA ANALYST
    else if (msg.includes("data")) {
      reply = `For Data Analyst:
- Learn Python & SQL
- Excel & Power BI
- Statistics basics
- Work on real datasets`;
    }

    // 💻 SOFTWARE ENGINEER
    else if (msg.includes("software") || msg.includes("developer")) {
      reply = `To become a Software Engineer:
- Learn DSA (very important)
- Choose stack (MERN / Java / Python)
- Build projects
- Practice coding daily`;
    }

    // 🎨 FRONTEND
    else if (msg.includes("frontend")) {
      reply = `Frontend Developer Roadmap:
- HTML, CSS, JavaScript
- React.js
- Responsive design
- Build UI projects`;
    }

    // 🎨 UI/UX DESIGN
    else if (msg.includes("ui") || msg.includes("ux")) {
      reply = `UI/UX Designer:
- Learn Figma / Adobe XD
- Understand user experience
- Wireframing & prototyping
- Portfolio is very important`;
    }

    // 🧪 QA TESTER
    else if (msg.includes("qa") || msg.includes("testing")) {
      reply = `QA Tester:
- Learn manual testing basics
- Test cases & bug lifecycle
- Automation tools (Selenium)
- API testing (Postman)`;
    }

    // 🎯 INTERVIEW
    else if (msg.includes("interview")) {
      reply = `Interview Tips:
- Prepare DSA
- Revise projects deeply
- Practice HR questions
- Improve communication`;
    }

    // 🔥 DEFAULT
    else {
      reply = `I can help with:
- Cloud, Software, Data, SOC, Cyber, Software, Frontend, UI/UX, QA Tester ... careers
- Interview preparation
- Skills roadmap

Try asking:
👉 "How to become Cloud Engineer?"
👉 "Skills for Data Analyst?"`;
    }

    res.json({
      success: true,
      reply,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

module.exports = { getCareerAdvice };