import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

export default function RecruiterDashboard() {
  // Applications & UI states
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showCandidateModal, setShowCandidateModal] = useState(false);

  // Interview Schedule Modal State
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState({
    date: "",
    time: "",
    link: "https://meet.google.com/abc-defg-hij",
  });

  // JNF Modal State
  const [showJNFModal, setShowJNFModal] = useState(false);
  const [jnfForm, setJnfForm] = useState({
    company: "",
    title: "",
    ctcPackage: "12-16 LPA",
    minAssessmentScore: 75,
    minCgpa: 7.0,
    eligibleBranches: "B.Sc IT, B.Tech CSE, MCA",
    requiredSkills: "Python, SQL, React",
    description: "",
  });

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [sortByScore, setSortByScore] = useState("none");

  // Base API configuration
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Read stored user safely
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return { name: "Corporate Recruiter" };
    }
  })();

  // Fetch Real Applications from Atlas
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/recruiter/applications`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data?.success) {
        setApplications(res.data.applications || []);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error("Failed to fetch applications from MongoDB Atlas:", err.message);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Status Updater with Backend Sync
  const updateStatus = async (appId, newStatus, extraData = {}) => {
    setApplications((prev) =>
      prev.map((app) =>
        app._id === appId ? { ...app, status: newStatus, ...extraData } : app
      )
    );

    if (selectedCandidate && selectedCandidate._id === appId) {
      setSelectedCandidate((prev) => ({ ...prev, status: newStatus, ...extraData }));
    }

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/api/recruiter/applications/${appId}`,
        { status: newStatus, ...extraData },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
    } catch (err) {
      console.error("Failed to update status on server:", err.message);
    }
  };

  // Schedule Interview Submit (Atlas synced)
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppId) return;

    await updateStatus(selectedAppId, "Interview Scheduled", {
      interviewDate: interviewDetails.date,
      interviewTime: interviewDetails.time,
      interviewLink: interviewDetails.link,
    });

    alert("📅 Interview saved to Atlas and notification sent to student!");
    setShowInterviewModal(false);
    setSelectedAppId(null);
  };

  // JNF Form Submit (Saves to MongoDB Atlas & Broadcasts)
  const handleJnfSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/api/jobs`, jnfForm, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data?.success) {
        alert("✅ JNF drive successfully created in MongoDB Atlas and broadcast to students!");
        setShowJNFModal(false);
        setJnfForm({
          company: "",
          title: "",
          ctcPackage: "12-16 LPA",
          minAssessmentScore: 75,
          minCgpa: 7.0,
          eligibleBranches: "B.Sc IT, B.Tech CSE, MCA",
          requiredSkills: "Python, SQL, React",
          description: "",
        });
      }
    } catch (err) {
      console.error("JNF Submission Error:", err);
      alert(`❌ Failed to publish JNF: ${err.response?.data?.message || err.message}`);
    }
  };

  // Dynamic unique roles for dropdown
  const uniqueRoles = useMemo(() => {
    const roles = Array.from(new Set(applications.map((app) => app.jobTitle).filter(Boolean)));
    return ["All Roles", ...roles];
  }, [applications]);

  // Filtered & Sorted Applications
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const matchesQuery =
          app.applicantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.applicantEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.skills?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus =
          statusFilter === "All" || app.status?.toLowerCase() === statusFilter.toLowerCase();

        const matchesRole =
          roleFilter === "All Roles" || app.jobTitle === roleFilter;

        return matchesQuery && matchesStatus && matchesRole;
      })
      .sort((a, b) => {
        if (sortByScore === "high-to-low") return (b.careerScore || 0) - (a.careerScore || 0);
        if (sortByScore === "low-to-high") return (a.careerScore || 0) - (b.careerScore || 0);
        return 0;
      });
  }, [applications, searchQuery, statusFilter, roleFilter, sortByScore]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
            IITM CDC Standard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Welcome, {user?.name || "Corporate Partner"} 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review candidate rubrics, manage interview calls, and publish placement drives.
          </p>
        </div>

        <button
          onClick={() => setShowJNFModal(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition text-xs flex items-center gap-2 whitespace-nowrap"
        >
          📋 Publish New JNF Drive
        </button>
      </div>

      {/* Metrics Counter */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Applications", value: applications.length, icon: "📄" },
          { label: "AI Shortlisted", value: applications.filter((a) => a.status === "Shortlisted").length, icon: "⚡" },
          { label: "Interviews Scheduled", value: applications.filter((a) => a.status === "Interview Scheduled").length, icon: "🎯" },
          { label: "Offers Extended", value: applications.filter((a) => a.status === "Offer Extended").length, icon: "🎉" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
            <span className="text-xl">{item.icon}</span>
            <p className="text-2xl font-black text-slate-900">{item.value}</p>
            <p className="text-xs font-semibold text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          {/* Search Bar */}
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search candidate by name, email, role, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-blue-500"
            />
          </div>

          {/* Role & Score Sort Selectors */}
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-blue-500"
            >
              {uniqueRoles.map((role, idx) => (
                <option key={idx} value={role}>{role}</option>
              ))}
            </select>

            <select
              value={sortByScore}
              onChange={(e) => setSortByScore(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-blue-500"
            >
              <option value="none">Sort: Default</option>
              <option value="high-to-low">AI Match: Highest → Lowest</option>
              <option value="low-to-high">AI Match: Lowest → Highest</option>
            </select>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {["All", "Applied", "Shortlisted", "Interview Scheduled", "Offer Extended", "Rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900">Student Applications</h2>
            <p className="text-xs text-slate-500">
              {loading ? "Connecting to Atlas..." : `Showing ${filteredApplications.length} candidate(s)`}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Applied Role</th>
                <th className="py-3 px-4">AI Score</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Key Skills</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{app.applicantName}</p>
                      <p className="text-[11px] text-slate-400">{app.applicantEmail}</p>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {app.jobTitle}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        {app.careerScore || 0}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-emerald-600">
                      {app.applicantCgpa || "N/A"}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {app.skills?.slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          app.status === "Shortlisted"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : app.status === "Interview Scheduled"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : app.status === "Offer Extended"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : app.status === "Rejected"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => {
                            setSelectedCandidate(app);
                            setShowCandidateModal(true);
                          }}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold hover:bg-slate-200 transition"
                        >
                          View
                        </button>

                        <button
                          onClick={() => updateStatus(app._id, "Shortlisted")}
                          className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-[10px] font-bold hover:bg-green-100 transition"
                        >
                          Shortlist
                        </button>

                        <button
                          onClick={() => {
                            setSelectedAppId(app._id);
                            setShowInterviewModal(true);
                          }}
                          className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-bold hover:bg-purple-100 transition"
                        >
                          Schedule
                        </button>

                        <button
                          onClick={() => updateStatus(app._id, "Offer Extended")}
                          className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-bold hover:bg-amber-100 transition"
                        >
                          Offer
                        </button>

                        <button
                          onClick={() => updateStatus(app._id, "Rejected")}
                          className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-[10px] font-bold hover:bg-red-100 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 font-medium">
                    {loading ? "Loading candidate pool..." : "No candidate applications match the selected criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= CANDIDATE PROFILE MODAL ================= */}
      {showCandidateModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Candidate Profile
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Candidate application details & AI Assessment breakdown
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCandidateModal(false);
                  setSelectedCandidate(null);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-2xl font-black text-white">
                  {selectedCandidate.applicantName
                    ? selectedCandidate.applicantName.charAt(0).toUpperCase()
                    : "C"}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {selectedCandidate.applicantName}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {selectedCandidate.applicantEmail}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                    AI Match Score
                  </p>
                  <p className="mt-1 text-2xl font-black text-blue-600">
                    {selectedCandidate.careerScore || 0}%
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                    CGPA
                  </p>
                  <p className="mt-1 text-2xl font-black text-emerald-600">
                    {selectedCandidate.applicantCgpa || "N/A"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <h3 className="mb-4 text-sm font-black text-slate-900">
                  Application Details
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Applied Role
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedCandidate.jobTitle}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Company
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedCandidate.companyName}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Education
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedCandidate.education || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Matched Career
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedCandidate.matchedCareer || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-black text-slate-900">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills && selectedCandidate.skills.length > 0 ? (
                    selectedCandidate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700"
                      >
                        {skill.trim()}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">No skills provided</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Application Status
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-800">
                      {selectedCandidate.status}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-600">
                    {selectedCandidate.status}
                  </span>
                </div>
              </div>

              {selectedCandidate.status === "Interview Scheduled" && (
                <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                  <h3 className="mb-3 text-sm font-black text-purple-900">
                    Interview Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-bold">Date:</span>{" "}
                      {selectedCandidate.interviewDate || "Not specified"}
                    </p>
                    <p>
                      <span className="font-bold">Time:</span>{" "}
                      {selectedCandidate.interviewTime || "Not specified"}
                    </p>
                    {selectedCandidate.interviewLink && (
                      <a
                        href={selectedCandidate.interviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block font-bold text-purple-600 underline"
                      >
                        Join Interview
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-5">
                <button
                  onClick={() => updateStatus(selectedCandidate._id, "Shortlisted")}
                  className="rounded-xl bg-green-50 px-4 py-2 text-xs font-bold text-green-600 hover:bg-green-100"
                >
                  Shortlist
                </button>

                <button
                  onClick={() => {
                    setSelectedAppId(selectedCandidate._id);
                    setShowCandidateModal(false);
                    setShowInterviewModal(true);
                  }}
                  className="rounded-xl bg-purple-50 px-4 py-2 text-xs font-bold text-purple-600 hover:bg-purple-100"
                >
                  Schedule Interview
                </button>

                <button
                  onClick={() => updateStatus(selectedCandidate._id, "Rejected")}
                  className="rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= INTERVIEW SCHEDULING MODAL ================= */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                Schedule Technical Interview
              </h3>
              <button
                onClick={() => setShowInterviewModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Interview Date *</label>
                <input
                  type="date"
                  required
                  value={interviewDetails.date}
                  onChange={(e) => setInterviewDetails({ ...interviewDetails, date: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Interview Time *</label>
                <input
                  type="time"
                  required
                  value={interviewDetails.time}
                  onChange={(e) => setInterviewDetails({ ...interviewDetails, time: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Meeting Link *</label>
                <input
                  type="url"
                  required
                  value={interviewDetails.link}
                  onChange={(e) => setInterviewDetails({ ...interviewDetails, link: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInterviewModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= JNF CREATION MODAL ================= */}
      {showJNFModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Job Notification Form (JNF)</h3>
                <p className="text-xs text-slate-500">Publish recruitment drive requirements & cutoffs</p>
              </div>
              <button
                onClick={() => setShowJNFModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleJnfSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Microsoft, TCS"
                  value={jnfForm.company}
                  onChange={(e) => setJnfForm({ ...jnfForm, company: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Role / Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Associate Software Engineer"
                  value={jnfForm.title}
                  onChange={(e) => setJnfForm({ ...jnfForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">CTC Package</label>
                  <input
                    type="text"
                    value={jnfForm.ctcPackage}
                    onChange={(e) => setJnfForm({ ...jnfForm, ctcPackage: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min AI Score Cutoff (%)</label>
                  <input
                    type="number"
                    value={jnfForm.minAssessmentScore}
                    onChange={(e) => setJnfForm({ ...jnfForm, minAssessmentScore: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Eligible Branches</label>
                <input
                  type="text"
                  value={jnfForm.eligibleBranches}
                  onChange={(e) => setJnfForm({ ...jnfForm, eligibleBranches: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowJNFModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Publish Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}