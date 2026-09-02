const express = require("express");
const router = express.Router();
const { getCareerAdvice } = require("../controllers/assistantController");

router.post("/", getCareerAdvice);

module.exports = router;