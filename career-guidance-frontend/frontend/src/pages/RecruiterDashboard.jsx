import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { recruiterApi } from "../services/recruiterApi";
import JNFModal from "../components/Recruiters/JNFModal";

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [showJNFModal, setShowJNFModal] = useState(false);
  
  // Post Job Form State
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "Mumbai / Hybrid",
    salary: "6 - 10 LPA",
    jobType: "Full-time",
    targetCareer: "Data Scientist",
    skillsRequired: "Python, SQL, Machine Learning",
    description: "",
  });

  // Schedule Interview Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    interviewDate: "",
    interviewTime: "10:00 AM",
    interviewLink: "https://meet.google.com/abc-defg-hij",
    interviewNotes: "Technical round discussing DSA and projects.",
  });

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loadData = async () => {
    try {
      const res = await recruiterApi.getDashboard();
      if (res.success) setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadData();
    else setLoading(false);
  }, [user]);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const res = await recruiterApi.postJob(jobForm);
      if (res.success) {
        showToastMsg("Job opening posted successfully!");
        setShowJobModal(false);
        setJobForm({
          title: "",
          company: "",
          location: "Mumbai / Hybrid",
          salary: "6 - 10 LPA",
          jobType: "Full-time",
          targetCareer: "Data Scientist",
          skillsRequired: "Python, SQL, Machine Learning",
          description: "",
        });
        loadData();
      }
    } catch (err) {
      showToastMsg(err.message || "Failed to post job.");
    }
  };

  const handleDirectStatus = async (appId, newStatus) => {
    try {
      const res = await recruiterApi.updateStatus(appId, { status: newStatus });
      if (res.success) {
        showToastMsg(`Candidate marked as ${newStatus}`);
        loadData();
      }
    } catch (err) {
      showToastMsg("Failed to update status");
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      const res = await recruiterApi.updateStatus(selectedApp._id, {
        status: "Interview Scheduled",
        ...interviewForm,
      });

      if (res.success) {
        showToastMsg(`Interview scheduled with ${selectedApp.applicantName}!`);
        setSelectedApp(null);
        loadData();
      }
    } catch (err) {
      showToastMsg("Failed to schedule interview");
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-slate-900">Sign in to access Recruiter Portal</h2>
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
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold">
          {toast}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider border border-indigo-100">
              Placement Partner Console
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Recruiter Dashboard</h1>
            <p className="text-slate-500 text-sm">Review candidate applications and schedule campus interviews.</p>
          </div>
          <button
            onClick={() => setShowJobModal(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition text-sm"
          >
            + Post New Opening
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Active Postings</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{data?.stats?.totalJobs || 0}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Total Applicants</p>
            <h3 className="text-2xl font-black text-blue-600 mt-1">{data?.stats?.totalApplicants || 0}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Shortlisted</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{data?.stats?.shortlistedCount || 0}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Interviews Scheduled</p>
            <h3 className="text-2xl font-black text-purple-600 mt-1">{data?.stats?.interviewCount || 0}</h3>
          </div>
        </div>

        {/* Applicants Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-900">Student Applications</h3>
            <span className="text-xs font-semibold text-slate-400">Actionable candidates</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="p-4 pl-6">Candidate</th>
                  <th className="p-4">Applied Role</th>
                  <th className="p-4">Match Score</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {data?.recentApplications?.length > 0 ? (
                  data.recentApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-slate-900">{app.applicantName}</p>
                        <p className="text-xs text-slate-400">{app.applicantEmail}</p>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">{app.jobTitle}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg">
                          {app.careerScore}%
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 font-bold text-xs rounded-full ${
                            app.status === "Interview Scheduled"
                              ? "bg-purple-100 text-purple-700"
                              : app.status === "Shortlisted"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right space-x-1.5">
                        <button
                          onClick={() => handleDirectStatus(app._id, "Shortlisted")}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl transition"
                        >
                          📅 Schedule Interview
                        </button>
                        <button
                          onClick={() => handleDirectStatus(app._id, "Rejected")}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 text-sm">
                      No applications submitted for your postings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>

            <h3 className="text-xl font-black text-slate-900">Schedule Interview</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Inviting <strong>{selectedApp.applicantName}</strong> for <strong>{selectedApp.jobTitle}</strong>
            </p>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={interviewForm.interviewDate}
                    onChange={(e) => setInterviewForm({ ...interviewForm, interviewDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 11:30 AM"
                    value={interviewForm.interviewTime}
                    onChange={(e) => setInterviewForm({ ...interviewForm, interviewTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Meeting Link</label>
                <input
                  type="url"
                  required
                  placeholder="https://meet.google.com/..."
                  value={interviewForm.interviewLink}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewLink: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Instructions / Agenda</label>
                <textarea
                  rows={3}
                  value={interviewForm.interviewNotes}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewNotes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 transition text-xs uppercase tracking-wider"
              >
                Confirm & Send Interview Invite →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowJobModal(false)}
              className="absolute top-5 right-5 text-slate-400 font-bold hover:text-slate-600"
            >
              ✕
            </button>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Post Placement Opening</h3>
            
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Associate Data Scientist"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TCS Innovation Labs"
                  value={jobForm.company}
                  onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Salary / Package</label>
                  <input
                    type="text"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={jobForm.skillsRequired}
                  onChange={(e) => setJobForm({ ...jobForm, skillsRequired: e.target.value })}
                  placeholder="React, Node.js, Python"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Job Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Details regarding the campus hiring role..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition text-sm"
              >
                Publish Opening Now →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}