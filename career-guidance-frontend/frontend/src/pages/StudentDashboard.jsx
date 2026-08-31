import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { studentApi } from "../services/studentApi";
import PlacementReportModal from "../components/common/PlacementReportModal";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await studentApi.getDashboard(user.email);   
        if (res.success) {
          setData(res.profile);
        }
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
  console.log("Dashboard Data:", data);
}, [data]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-2xl font-bold mb-4">
          🔒
        </div>
        <h2 className="text-2xl font-black text-slate-900">Sign in to view your dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">Access your placement stats, career match, and active tracks.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
        {error}
      </div>
    );
  }

  const latestTest = data?.latestTest;

  <button
  onClick={() => setShowReportModal(true)}
  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transition text-xs flex items-center gap-2"
>
  📄 Download Placement Report (PDF)
</button>
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/20">
              Student Placement Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mt-2">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Here is an overview of your AI recommendations, learning milestones, and job applications.
            </p>
          </div>
          <Link
            to="/career-test"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition text-center shrink-0"
          >
            {latestTest ? "Retake Career Test" : "Take Career Test →"}
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Primary Career Fit</p>
            <h3 className="text-2xl font-black text-slate-900 mt-2">
              {latestTest?.career || "Not Assessed"}
            </h3>
            <p className="text-xs text-blue-600 font-semibold mt-1">
              {latestTest?.score ? `${latestTest.score}% Match Compatibility` : "Take test to calculate fit"}
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Applications Sent</p>
            <h3 className="text-2xl font-black text-slate-900 mt-2">
              {data?.totalApplications || 0}
            </h3>
            <Link to="/my-applications" className="text-xs text-blue-600 font-semibold mt-1 hover:underline block">
              View all applications →
            </Link>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Shortlisted Status</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-2">
              {data?.shortlistedCount || 0}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Candidates under review</p>
          </div>
        </div>

        {/* Active Roadmap & Recent Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Active Roadmap Summary */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Active Learning Roadmap</h3>
              {latestTest && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                  {latestTest.career}
                </span>
              )}
            </div>

            {latestTest?.roadmap?.length > 0 ? (
              <div className="space-y-3">
                {latestTest.roadmap.slice(0, 4).map((step) => (
                  <div
                    key={step.step}
                    className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3.5"
                  >
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {step.step}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{step.title}</p>
                      <p className="text-xs text-slate-500 truncate">{step.description}</p>
                    </div>
                  </div>
                ))}
                <Link
                  to="/career-test"
                  className="block text-center text-xs font-bold text-blue-600 hover:underline pt-2"
                >
                  View full roadmap in Career Test →
                </Link>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-500 text-sm">
                No active roadmap yet. Take the Career Assessment to generate one.
              </div>
            )}
          </div>

          {/* Recent Applications List */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Recent Applications</h3>
              <Link to="/my-applications" className="text-xs font-bold text-blue-600 hover:underline">
                View All
              </Link>
            </div>

            {data?.recentApplications?.length > 0 ? (
              <div className="space-y-3">
                {data.recentApplications.map((app) => (
                  <div
                    key={app._id}
                    className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900">{app.jobTitle}</p>
                      <p className="text-xs text-slate-500">{app.companyName}</p>
                    </div>
                    <span className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shrink-0">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-500 text-sm">
                You haven't submitted any job applications yet.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}