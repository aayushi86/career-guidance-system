import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { jobsApi } from "../services/jobsApi";
import { careerApi } from "../services/careerApi";

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("All");
  const [appliedIds, setAppliedIds] = useState([]);
  const [applyingId, setApplyingId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const triggerToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3500);
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobsApi.getAll({
        search,
        ...(jobType !== "All" ? { jobType } : {}),
      });
      if (res.success) setJobs(res.jobs);
    } catch (err) {
      setError(err.message || "Failed to load job listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [jobType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApply = async (job) => {
    if (!user) {
      triggerToast("Please sign in to apply for openings.");
      return;
    }

    const targetJobId = job._id || job.id;
    setApplyingId(targetJobId);

    try {
      const res = await careerApi.applyJob({
        jobId: targetJobId,
        jobTitle: job.title,
        companyName: job.company,
        applicantName: user.name,
        applicantEmail: user.email,
        matchedCareer: job.targetCareer || job.title,
        careerScore: 85,
      });

      if (res.success) {
        setAppliedIds((prev) => [...prev, targetJobId]);
        triggerToast(`Applied to ${job.title} at ${job.company}!`);
      }
    } catch (err) {
      triggerToast(err.message || "Application failed.");
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold">
            {toast.message}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-4xl font-black text-slate-900">Explore Placement Openings</h1>
          <p className="text-slate-500 text-sm">
            Browse live campus recruitment drives, internships, and full-time tech roles.
          </p>
        </div>

        {/* Filter Bar */}
        <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by role, company, or keyword (e.g. Python, Analyst)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:bg-white"
          >
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm transition shadow-md shadow-blue-500/20"
          >
            Search
          </button>
        </form>

        {/* Listings Grid */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-slate-500 font-semibold">Finding matching roles...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-semibold">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
            No openings found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {jobs.map((job) => {
              const jobId = job._id || job.id;
              const isApplied = appliedIds.includes(jobId);
              const isApplying = applyingId === jobId;
              const skillsList = job.requiredSkills || job.skillsRequired || [];

              return (
                <div
                  key={jobId}
                  className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {job.jobType || "Full-time"} • {job.location || "Hybrid"}
                        </span>
                        <h3 className="text-lg font-black text-slate-900 mt-2">{job.title}</h3>
                        <p className="text-xs font-semibold text-slate-500">{job.company}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-600 block">
                          {job.ctcPackage || job.salary || "₹10-14 LPA"}
                        </span>
                        <span className="text-[10px] text-slate-400">Campus Drive CTC</span>
                      </div>
                    </div>

                    {job.description && (
                      <p className="text-sm text-slate-500 line-clamp-2">{job.description}</p>
                    )}

                    {skillsList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {skillsList.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Min AI Score Cutoff:{" "}
                      <strong className="text-slate-800">
                        {job.minAssessmentScore || 75}%
                      </strong>
                    </span>

                    <button
                      type="button"
                      disabled={isApplied || isApplying}
                      onClick={() => handleApply(job)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                        isApplied
                          ? "bg-emerald-600 text-white cursor-default"
                          : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                      }`}
                    >
                      {isApplied ? "✓ Applied" : isApplying ? "Applying..." : "1-Click Apply →"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}