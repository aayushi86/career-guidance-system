import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CareerTest from "./pages/CareerTest";
import Jobs from "./pages/Jobs";
import SkillGap from "./pages/SkillGap";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import StudentDashboard from "./pages/StudentDashboard";
import MyApplications from "./pages/MyApplications";
import Navbar from "./components/Navbar/Navbar";
import StudentProfile from "./pages/StudentProfile";
import Contact from "./pages/Contact";
import JobDetail from "./pages/JobDetail";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AICareerAssistant from "./pages/AICareerAssistant";
import InterviewPrep from "./pages/InterviewPrep";

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">

      {/* NAVBAR */}
      <Navbar />

      <main className="relative">

        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}

          <Route path="/" element={<Home />} />
          <Route path="/career-test" element={<CareerTest />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/skill-gap" element={<SkillGap />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/contact" element={<Contact />} />
          

          {/* ================= STUDENT ROUTES ================= */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-applications"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyApplications />
              </ProtectedRoute>
            }
          />

          <Route path="/ai-assistant" element={<AICareerAssistant />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />


          {/* ================= RECRUITER ROUTE ================= */}

          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ROUTE ================= */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

        </Routes>

      </main>
    </div>
  );
}