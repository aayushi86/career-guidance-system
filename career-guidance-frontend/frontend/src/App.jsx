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
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Contact from "./pages/Contact";
import JobDetail from "./pages/JobDetail";
import ProtectedRoute from "./components/common/ProtectedRoute";




export default function App() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      <Navbar />
      <main className="relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/career-test" element={<CareerTest />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/skill-gap" element={<SkillGap />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-applications" element={<MyApplications />} />
          {/* Recruiter Protected Route */}
<Route
  path="/recruiter/dashboard"
  element={
    <ProtectedRoute allowedRoles={["recruiter"]}>
      <RecruiterDashboard />
    </ProtectedRoute>
  }
/>

{/* Admin Protected Route */}
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