const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const Job = require("../models/Job");

router.get("/", jobController.getJobs);
router.post("/jnf", jobController.createJNF);
router.post("/apply", jobController.applyJob);
router.get("/my-applications", jobController.getMyApplications); // 👈 NEW

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