const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();


// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());


// ================= ROUTES =================

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const jobRoutes = require("./routes/jobRoutes");
const careerRoutes = require("./routes/careerRoutes");
const skillRoutes = require("./routes/skillRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const adminRoutes = require("./routes/adminRoutes");
const applicationRoutes = require("./routes/applicationRoutes");


// ================= API ROUTES =================

app.use("/api/auth", authRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/notifications", notificationRoutes);
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/jobs", jobRoutes);

app.use("/api/career", careerRoutes);

app.use("/api/career-test", careerRoutes);

app.use("/api/skills", skillRoutes);

app.use("/api/resume", resumeRoutes);

app.use("/api/recruiters", recruiterRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/admin", adminRoutes);


// ================= HOME =================

app.get("/", (req, res) => {
  res.send("CareerAI API is running...");
});


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 CareerAI server running on http://localhost:${PORT}`
  );
});