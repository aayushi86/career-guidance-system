require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const resumeRoutes = require("./routes/resumeRoutes");


const app = express();


// ==========================================
// DATABASE
// ==========================================

connectDB();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: "http://localhost:5173",
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

app.use("/api/resumes", resumeRoutes);
app.use("/api/resume", resumeRoutes);
// Career Test
app.use("/api/career-test", require("./routes/careerRoutes"));
app.use("/api/assessment", require("./routes/careerRoutes"));


// Assessment
app.use("/api/assessment", require("./routes/careerRoutes"));

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


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CareerAI backend is running",
  });
});


// ==========================================
// 404
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.stack);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 CareerAI server running on http://localhost:${PORT}`
  );
});