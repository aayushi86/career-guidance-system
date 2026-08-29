import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

// ======================================================
// CONSTANTS & OPTIONS
// ======================================================
const availableSkills = [
  "Python", "Java", "JavaScript", "C", "C++", "SQL", "MongoDB", 
  "React", "Node.js", "HTML", "CSS", "Data Analysis", "Statistics", 
  "Machine Learning", "Artificial Intelligence", "Excel", "Power BI", 
  "Git", "GitHub"
];

const availableInterests = [
  "Data", "AI", "Machine Learning", "Web Development", 
  "Programming", "Analytics", "Business", "UI", "Design", "Database"
];

export default function CareerTest() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interests: [],
    skills: [],
    education: "B.Sc IT",
    preferredWorkStyle: "Analytical",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [applyingId, setApplyingId] = useState(null);

  // Modern Toast notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const resultsRef = useRef(null);
  const jobsSectionRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  // Form Handlers
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((item) => item !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }));
  };

  // Step checkoff toggle
  const toggleRoadmapStep = async (stepNumber, currentCompleted) => {
    if (!result) return;
    const updatedRoadmap = (result.roadmap || []).map((item) =>
      item.step === stepNumber ? { ...item, completed: !currentCompleted } : item
    );

    setResult((prev) => ({ ...prev, roadmap: updatedRoadmap }));

    if (result.id) {
      try {
        await fetch(`http://localhost:5000/api/career-test/${result.id}/roadmap-step`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stepNumber, completed: !currentCompleted }),
        });
      } catch (err) {
        console.error("Failed to sync roadmap status:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setJobs([]);
    setAppliedJobIds([]);

    if (formData.skills.length === 0) {
      setError("Please select at least one skill to calculate your match.");
      setLoading(false);
      return;
    }
    if (formData.interests.length === 0) {
      setError("Please pick at least one area of interest.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/career-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to process evaluation");

      setResult(data.result);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } catch (err) {
      setError(err.message || "Server error while submitting test.");
    } finally {
      setLoading(false);
    }
  };

  const handleExploreJobs = async () => {
    if (!result?.career) return;
    setLoadingJobs(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/jobs/recommendations?career=${encodeURIComponent(result.career)}`
      );
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
        setTimeout(() => {
          jobsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    } catch (err) {
      showToast("Unable to fetch job listings at this time.", "error");
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleQuickApply = async (job) => {
    setApplyingId(job._id);

    try {
      const payload = {
        jobId: job._id,
        jobTitle: job.title,
        companyName: job.company,
        applicantName: formData.name,
        applicantEmail: formData.email,
        education: formData.education,
        skills: formData.skills,
        matchedCareer: result.career,
        careerScore: result.score,
      };

      const res = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || "Could not complete application", "error");
        return;
      }

      setAppliedJobIds((prev) => [...prev, job._id]);
      showToast(`Successfully applied to ${job.title} at ${job.company}!`);
    } catch (err) {
      showToast("Network error submitting application.", "error");
    } finally {
      setApplyingId(null);
    }
  };

  const completedStepsCount = result?.roadmap?.filter((s) => s.completed)?.length || 0;
  const totalStepsCount = result?.roadmap?.length || 3;
  const progressPercent = totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification Container */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium ${
              toast.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-slate-900 border-slate-700 text-white"
            }`}
          >
            <span>{toast.type === "error" ? "⚠️" : "🎉"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-widest uppercase">
            <span>✨ AI Career Intelligence</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Discover Your Ideal Tech Career
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg">
            Map your personal interests and technical competencies to high-demand industry profiles and structured learning roadmaps.
          </p>
        </div>

        {/* Input Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 space-y-8"
        >
          {/* Identity Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Anurag Chaurasia"
                required
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. your.email@example.com"
                required
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
              />
            </div>
          </div>

          {/* Interests */}
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <label className="block text-sm font-bold text-slate-700">What areas interest you most?</label>
              <span className="text-xs font-semibold text-blue-600">
                {formData.interests.length} Selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {availableInterests.map((interest) => {
                const selected = formData.interests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selected
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                        : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/80"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skills */}
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <label className="block text-sm font-bold text-slate-700">Your Technical Skills</label>
              <span className="text-xs font-semibold text-indigo-600">
                {formData.skills.length} Selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {availableSkills.map((skill) => {
                const selected = formData.skills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selected
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-[1.02]"
                        : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/80"
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Education & Work Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Education Background</label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="e.g. B.Sc IT / B.Tech CSE"
                required
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Work Style</label>
              <select
                name="preferredWorkStyle"
                value={formData.preferredWorkStyle}
                onChange={handleChange}
                required
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition cursor-pointer"
              >
                <option value="Analytical">Analytical & Research Oriented</option>
                <option value="Creative">Creative & Product Oriented</option>
                <option value="Collaborative">Collaborative & Team Oriented</option>
                <option value="Leadership">Leadership & Management</option>
                <option value="Independent">Autonomous & Independent</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Analyzing Profile & Matching Intelligence..." : "Get AI Career Recommendation ✨"}
          </button>
        </form>

        {/* Results Container */}
        {result && (
          <div ref={resultsRef} className="space-y-10 animate-fade-in">
            {/* Recommendation Highlight Card */}
            <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 text-center md:text-left">
                  <span className="px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/20">
                    Highest Role Compatibility
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black">{result.career}</h2>
                  <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                    {result.reason}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 min-w-[140px]">
                  <span className="text-4xl sm:text-5xl font-black text-blue-400">{result.score}%</span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-300 mt-1">
                    Match Score
                  </span>
                </div>
              </div>
            </div>

            {/* Alternative Career Fit Scores */}
            {result.careerMatches?.length > 0 && (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Alternative Career Matches</h3>
                  <p className="text-slate-500 text-sm">How your skillset compares across other tech paths:</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.careerMatches.map((career, index) => (
                    <div
                      key={career.career}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-slate-800 text-sm">{career.career}</span>
                        </div>
                        <span className="font-bold text-blue-600 text-sm">{career.score}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-700"
                          style={{ width: `${career.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Learning Roadmap with Fail-Proof Fallback */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Your Actionable Learning Path</h3>
                  <p className="text-slate-500 text-sm">
                    Click steps as you complete them to track readiness for recruitment.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200/70 px-4 py-2 rounded-2xl">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 gap-4 mb-1">
                    <span>Readiness:</span>
                    <span>{progressPercent}% Complete</span>
                  </div>
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3.5">
                {result?.roadmap && result.roadmap.length > 0 ? (
                  result.roadmap.map((item, index) => {
                    const stepNumber = item.step || index + 1;
                    const isDone = !!item.completed;
                    return (
                      <div
                        key={stepNumber}
                        onClick={() => toggleRoadmapStep(stepNumber, isDone)}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-4 select-none ${
                          isDone
                            ? "bg-emerald-50/70 border-emerald-200"
                            : "bg-slate-50/50 border-slate-100 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center shrink-0 text-sm transition-all ${
                            isDone
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                              : "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          }`}
                        >
                          {isDone ? "✓" : stepNumber}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-base ${isDone ? "line-through text-emerald-900" : "text-slate-900"}`}>
                            {item.title || item}
                          </h4>
                          <p className={`text-sm mt-0.5 ${isDone ? "text-emerald-700/80" : "text-slate-500"}`}>
                            {item.description || "Master core concepts and build practical projects."}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="p-4 sm:p-5 bg-slate-50/50 border border-slate-200 rounded-2xl">
                      <span className="text-xs font-bold text-blue-600 uppercase">Phase 1</span>
                      <h4 className="font-bold text-slate-900 text-base mt-0.5">Core Skill Proficiency & Advanced Data Structures</h4>
                      <p className="text-sm text-slate-500 mt-0.5">Master Python, SQL querying, and system design fundamentals.</p>
                    </div>
                    <div className="p-4 sm:p-5 bg-slate-50/50 border border-slate-200 rounded-2xl">
                      <span className="text-xs font-bold text-blue-600 uppercase">Phase 2</span>
                      <h4 className="font-bold text-slate-900 text-base mt-0.5">Portfolio Project & Machine Learning Integration</h4>
                      <p className="text-sm text-slate-500 mt-0.5">Build an end-to-end full stack application or data pipeline model.</p>
                    </div>
                    <div className="p-4 sm:p-5 bg-slate-50/50 border border-slate-200 rounded-2xl">
                      <span className="text-xs font-bold text-blue-600 uppercase">Phase 3</span>
                      <h4 className="font-bold text-slate-900 text-base mt-0.5">ATS Resume Optimization & Mock Interviews</h4>
                      <p className="text-sm text-slate-700 font-semibold mt-0.5">Refine your resume and prepare for technical placement drives.</p>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="flex-1 py-3.5 px-6 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Retake Assessment
                </button>
                <Link
                  to="/jobs"
                  className="flex-1 text-center py-3.5 px-6 bg-blue-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition"
                >
                  Explore Live Placement Jobs →
                </Link>
                <button
                  type="button"
                  onClick={handleExploreJobs}
                  disabled={loadingJobs}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg transition disabled:opacity-60"
                >
                  {loadingJobs ? "Searching Database..." : `Match ${result.career} Jobs`}
                </button>
              </div>
            </div>

            {/* Jobs Match Panel */}
            {jobs.length > 0 && (
              <div ref={jobsSectionRef} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Recommended Placement Openings</h3>
                    <p className="text-slate-500 text-sm">Matching opportunities based on your recommendations:</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
                    {jobs.length} Available
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {jobs.map((job) => {
                    const isApplied = appliedJobIds.includes(job._id);
                    const isApplying = applyingId === job._id;

                    return (
                      <div
                        key={job._id}
                        className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-4 hover:border-slate-200 transition"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-slate-900 text-lg">{job.title}</h4>
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800">
                              {job.jobType}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-slate-600">{job.company}</p>
                          <p className="text-xs text-slate-500">📍 {job.location} • 💰 {job.salary}</p>
                          <p className="text-sm text-slate-500 line-clamp-2">{job.description}</p>
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {job.skillsRequired?.map((sk) => (
                              <span key={sk} className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-600 font-medium">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={isApplied || isApplying}
                          onClick={() => handleQuickApply(job)}
                          className={`w-full py-3 rounded-xl font-bold text-sm transition ${
                            isApplied
                              ? "bg-emerald-600 text-white cursor-default"
                              : "bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50"
                          }`}
                        >
                          {isApplied ? "✓ Applied" : isApplying ? "Submitting..." : "Quick Apply"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}