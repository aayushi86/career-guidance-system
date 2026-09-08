require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const resumeRoutes = require("./routes/resumeRoutes");
const careerRoutes = require("./routes/careerRoutes");

const app = express();

// ==========================================
// DATABASE (Handles resilient connection)
// ==========================================
connectDB();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// ==========================================
// ROUTES
// ==========================================

// Authentication
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

// Students
app.use(
  "/api/students",
  require("./routes/studentRoutes")
);

// Jobs
app.use(
  "/api/jobs",
  require("./routes/jobRoutes")
);

// Applications
app.use(
  "/api/applications",
  require("./routes/applicationRoutes")
);

// Resume
app.use(
  "/api/resumes",
  resumeRoutes
);

// Compatibility alias
app.use(
  "/api/resume",
  resumeRoutes
);

// Career Test
app.use(
  "/api/career-test",
  require("./routes/careerRoutes")
);

// Compatibility alias
app.use(
  "/api/assessment",
  require("./routes/careerRoutes")
);

// Skills
app.use(
  "/api/skills",
  require("./routes/skillRoutes")
);

// Notifications
app.use(
  "/api/notifications",
  require("./routes/notificationRoutes")
);

// Recruiter
app.use(
  "/api/recruiter",
  require("./routes/recruiterRoutes")
);

// Admin
app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

// AI Assistant
app.use("/api/assistant", require("./routes/assistantRoutes"));
// Interview Preparation
app.use(
  "/api/interviews",
  require("./routes/interviewRoutes")
);

// ==========================================
// SERVER INITIALIZATION
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 CareerAI server running on http://localhost:${PORT}`);
});