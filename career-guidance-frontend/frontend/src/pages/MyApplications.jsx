import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { applicationApi } from "../services/applicationApi";

export default function MyApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const res = await applicationApi.getUserApplications(user.email);
        if (res.success) {
          setApplications(res.applications || []);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.warn("Could not fetch user applications:", err);
        setError("Unable to load applications directly from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-3xl font-black mb-4">
          🎓
        </div>
        <h2 className="text-2xl font-black text-slate-900">Sign in to view your applications</h2>
        <p className="text-slate-500 text-sm mt-2">Track your interview calls and placement submissions.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider border border-blue-100">
              Placement Tracker
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">My Job Applications</h1>
            <p className="text-slate-500 text-sm">
              Tracking placement submissions for <strong className="text-slate-700">{user.email}</strong>
            </p>
          </div>
          <Link
            to="/jobs"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition text-sm"
          >
            Explore More Jobs →
          </Link>
        </div>

        {/* Applications List */}
        {applications.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {app.companyName || "Partner Recruiter"}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-400">
                      Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900">{app.jobTitle}</h3>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-100">
                      Match Score: {app.careerScore || 85}%
                    </span>

                    <span
                      className={`px-3 py-0.5 font-bold text-xs rounded-full ${
                        app.status === "Interview Scheduled"
                          ? "bg-purple-100 text-purple-700 border border-purple-200 animate-pulse"
                          : app.status === "Shortlisted"
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : app.status === "Rejected"
                          ? "bg-rose-100 text-rose-700 border border-rose-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      ● {app.status}
                    </span>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="w-full md:w-auto flex items-center justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {app.status === "Interview Scheduled" ? (
                    <button
                      onClick={() => setSelectedInterview(app)}
                      className="w-full md:w-auto px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/25 transition flex items-center justify-center gap-2"
                    >
                      <span>📅</span> View Interview Details
                    </button>
                  ) : app.status === "Shortlisted" ? (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                      ✨ Awaiting Interview Slot
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl">
                      Under Review
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 text-2xl rounded-2xl flex items-center justify-center mx-auto">
              📋
            </div>
            <h3 className="text-xl font-black text-slate-900">No applications yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore available campus drives and apply to positions matching your AI career assessment.
            </p>
            <Link
              to="/jobs"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition hover:bg-blue-700"
            >
              Browse Openings →
            </Link>
          </div>
        )}

      </div>

      {/* Interview Details Modal */}
      {selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-2xl relative space-y-5">
            <button
              onClick={() => setSelectedInterview(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>

            <div>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-black uppercase rounded-full tracking-wider border border-purple-100">
                Official Interview Call
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">Interview Scheduled</h3>
              <p className="text-xs text-slate-500">
                Role: <strong>{selectedInterview.jobTitle}</strong> ({selectedInterview.companyName || "Tech Partner"})
              </p>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500 uppercase text-[10px]">Interview Date</span>
                <span className="font-black text-slate-900">{selectedInterview.interviewDate || "To be confirmed"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500 uppercase text-[10px]">Interview Time</span>
                <span className="font-black text-slate-900">{selectedInterview.interviewTime || "10:00 AM"}</span>
              </div>
            </div>

            {selectedInterview.interviewNotes && (
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Recruiter Notes & Agenda</p>
                <p className="text-xs text-slate-700 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                  {selectedInterview.interviewNotes}
                </p>
              </div>
            )}

            <div className="pt-2 space-y-2">
              {selectedInterview.interviewLink ? (
                <a
                  href={selectedInterview.interviewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/25 transition uppercase tracking-wider"
                >
                  🚀 Launch Google Meet / Interview Link
                </a>
              ) : (
                <p className="text-center text-xs text-slate-400 italic">
                  Meeting link will be shared by recruiter via email.
                </p>
              )}

              <button
                onClick={() => setSelectedInterview(null)}
                className="block w-full text-center py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}