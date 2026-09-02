const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const Job = require("../models/Job");

router.get("/", jobController.getJobs);
router.post("/jnf", jobController.createJNF);
router.post("/apply", jobController.applyJob);
router.get("/my-applications", jobController.getMyApplications); // 👈 NEW

// 🔥 NEW: JOB RECOMMENDATION BASED ON CAREER
router.get("/recommendations", async (req, res) => {
  try {
    const { career } = req.query;

    let jobs = [];

    if (career === "Data Scientist") {
      jobs = [
        {
          _id: "1",
          title: "Junior Data Scientist",
          company: "TCS",
          location: "Mumbai",
          salary: "6 LPA",
          jobType: "Full-Time",
          skillsRequired: ["Python", "ML", "SQL"],
        },
      ];
    } 
    
    else if (career === "Full Stack Developer") {
      jobs = [
        {
          _id: "2",
          title: "MERN Developer",
          company: "Infosys",
          location: "Pune",
          salary: "5 LPA",
          jobType: "Full-Time",
          skillsRequired: ["React", "Node.js", "MongoDB"],
        },
      ];
    }

    else if (career === "Cloud Engineer") {
      jobs = [
        {
          _id: "3",
          title: "Cloud Engineer",
          company: "Wipro",
          location: "Bangalore",
          salary: "7 LPA",
          jobType: "Full-Time",
          skillsRequired: ["AWS", "Linux"],
        },
      ];
    }

    else if (career === "Cybersecurity Analyst") {
      jobs = [
        {
          _id: "4",
          title: "Security Analyst",
          company: "Accenture",
          location: "Hyderabad",
          salary: "6 LPA",
          jobType: "Full-Time",
          skillsRequired: ["Networking", "Ethical Hacking"],
        },
      ];
    }

    return res.json({
      success: true,
      jobs,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching recommendations",
    });
  }
});

//delete job
router.delete("/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});

//update job
router.put("/:id", async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, job: updated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;