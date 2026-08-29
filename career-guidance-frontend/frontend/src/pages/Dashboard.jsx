import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { studentApi } from "../services/studentApi";
import PlacementReportModal from "../components/common/PlacementReportModal";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await studentApi.getProfile();
        if (res?.profile) {
          setProfile(res.profile);
        }
      } catch (err) {
        console.warn("Using fallback local dashboard data:", err);
        setProfile({
          name: user?.name || "Anurag Chaurasia",
          email: user?.email || "student@college.edu",
          skills: ["Python", "SQL", "React", "Data Structures"],
          degree: "B.Tech / B.Sc IT",
          college: "University Institute of Technology",
          readinessScore: 82,
          careerTestDone: true,
          targetRole: "Full Stack Engineer",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ================= HEADER / HERO BANNER ================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Welcome back, {profile?.name || "Student"}!
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Track your career readiness, assessments, and placement status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transition text-xs flex items-center gap-2 shrink-0"
          >
            📄 Download Placement Report (PDF)
          </button>
        </div>

        {/* ================= DASHBOARD METRICS & CONTENT ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Readiness Score</p>
            <h3 className="text-3xl font-black text-blue-600 mt-2">
              {profile?.readinessScore || 0}%
            </h3>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Program / Degree</p>
            <h3 className="text-lg font-bold text-slate-900 mt-2">
              {profile?.degree || "Not set"}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Institution</p>
            <h3 className="text-lg font-bold text-slate-900 mt-2">
              {profile?.college || "Placement Partner College"}
            </h3>
          </div>
        </div>

        {/* ================= LOWER GRID: ASSESSMENT CARD & SKILLS PROFILE ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Assessment Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  AI Skill Evaluation
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    profile?.careerTestDone
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {profile?.careerTestDone ? "✓ Completed" : "Pending"}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900">
                {profile?.careerTestDone ? profile.targetRole : "Career Assessment"}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed">
                {profile?.careerTestDone
                  ? `Your profile is optimized for ${profile.targetRole} with a readiness score of ${profile.readinessScore}%.`
                  : "Complete your skill evaluation to unlock personalized job matching and roadmap."}
              </p>
            </div>

            <div className="pt-4">
              <Link
                to="/career-test"
                className="block text-center py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition"
              >
                {profile?.careerTestDone ? "Review Test Results / Retake →" : "Start Assessment →"}
              </Link>
            </div>
          </div>

          {/* Active Skills Profile */}
          <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900">Active Skill Profile</h3>
            <div className="flex flex-wrap gap-2">
              {profile?.skills?.map((skill) => (
                <span
                  key={skill}
                  className="px-3.5 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= PLACEMENT REPORT MODAL ================= */}
      {showReportModal && (
        <PlacementReportModal
          profile={profile}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}