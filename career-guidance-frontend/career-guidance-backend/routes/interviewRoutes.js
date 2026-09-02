const express = require("express");
const router = express.Router();
const { getQuestions } = require("../controllers/interviewController");

router.get("/", getQuestions);

module.exports = router;