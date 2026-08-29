const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");

const protect =
  typeof authMiddleware === "function"
    ? authMiddleware
    : authMiddleware.protect || ((req, res, next) => next());

router.get("/", jobController.getJobs);
router.post("/jnf", protect, jobController.createJNF);
router.post("/", protect, jobController.createJNF);

module.exports = router;