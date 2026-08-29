import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jobsApi } from "../services/jobsApi";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobsApi.getJobById(id);
        if (res.success) setJob(res.job);
      } catch (err) {
        setError("Unable to load job posting details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) return alert("Please sign in as a student to apply.");
    setApplying(true);
    try {
      const res = await jobsApi.applyJob({
        jobId: job._id,
        jobTitle: job.title,
        companyName: job.company,
        applicantEmail: user.email,
        applicantName: user.name,
        careerScore: 92,
      });
      if (res.success) setApplied(true);
    } catch (err) {
      alert(err.message || "Failed to submit application.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-black text-slate-900">Job Not Found</h2>
        <Link to="/jobs" className="mt-4 text-blue-600 font-bold text-sm hover:underline">
          ← Back to All Drives
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition">
          ← Back to Placement Drives
        </Link>

        {/* Hero Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider border border-emerald-100">
                {job.jobType || "Full-time"}
              </span>
              <h1 className="text-3xl font-black text-slate-900 mt-2">{job.title}</h1>
              <p className="text-base font-bold text-slate-600 mt-0.5">{job.company}</p>
            </div>

            <button
              onClick={handleApply}
              disabled={applied || applying}
              className={`px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg transition ${
                applied
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-none cursor-default"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"
              }`}
            >
              {applied ? "✓ Applied Successfully" : applying ? "Submitting..." : "Apply for Opening →"}
            </button>
          </div>

          {/* Quick Details Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Location</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{job.location || "Remote / On-site"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Package / CTC</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{job.salary || "Competitive"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Target Domain</p>
              <p className="text-sm font-bold text-blue-600 mt-0.5">{job.targetCareer || job.title}</p>
            </div>
          </div>

          {/* Role Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-black text-slate-900">Job Description & Responsibilities</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {/* Required Skills */}
          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-black text-slate-900">Required Competencies</h3>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired && job.skillsRequired.length > 0 ? (
                job.skillsRequired.map((s, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/60">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">Standard domain skills required.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}