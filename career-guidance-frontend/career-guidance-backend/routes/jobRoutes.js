const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

router.get("/", jobController.getJobs);
router.post("/jnf", jobController.createJNF);
router.post("/apply", jobController.applyJob);

module.exports = router;