import { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  FaBrain,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBullseye,
  FaCalendarAlt,
  FaBookOpen,
  FaProjectDiagram,
  FaFlagCheckered,
  FaTasks,
} from "react-icons/fa";

const ROLES = [
  "Software Engineer",
  "Full Stack Developer",
  "Data Scientist",
  "Data Analyst",
  "Cloud / DevOps Engineer",
];

export default function CareerRoadmap() {
  const [targetRole, setTargetRole] = useState("Data Scientist");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token =
    localStorage.getItem("token") || localStorage.getItem("career_token");

  // ==========================================
  // FETCH SAVED ROADMAP ON PAGE LOAD
  // ==========================================
  const fetchMyRoadmap = async () => {
    if (!token) return;

    try {
      const response = await axios.get(
        "http://localhost:5000/api/skill-gap/my-roadmap",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success && response.data.roadmap) {
        setRoadmap(response.data.roadmap);
        setTargetRole(response.data.roadmap.targetRole || "Data Scientist");
      }
    } catch (err) {
      console.log("No previous active roadmap found:", err.message);
    }
  };

  useEffect(() => {
    fetchMyRoadmap();
  }, []);

  // ==========================================
  // GENERATE NEW AI ROADMAP (WITH TOKEN GUARD)
  // ==========================================
  const generateRoadmap = async () => {
    if (!token) {
      setError("Please sign in to generate your personalized AI roadmap.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:5000/api/skill-gap/generate-roadmap",
        { targetRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setRoadmap(response.data.roadmap);
      }
    } catch (err) {
      console.error("Roadmap generation error:", err.response || err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to generate your AI career roadmap."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // TOGGLE TASK COMPLETION
  // ==========================================
  const toggleTask = async (taskId) => {
    if (!roadmap?._id || !token) return;

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/skill-gap/roadmap/${roadmap._id}/progress`,
        { taskId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success && response.data.progress) {
        setRoadmap((prev) => ({
          ...prev,
          progress: response.data.progress,
        }));
      }
    } catch (err) {
      console.error("Progress update error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* PAGE HEADER */}
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-lg shadow-blue-500/25">
              <FaBrain />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800">
                AI Career Roadmap & Milestone Tracker
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Discover skill gaps, generate a tailored 4-month plan, and check off milestones as you learn.
              </p>
            </div>
          </div>
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* ROLE SELECTION */}
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-end gap-5">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                Choose Your Dream Career Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="button"
              onClick={generateRoadmap}
              disabled={loading}
              className="px-8 py-3 font-bold"
            >
              {loading ? "AI is Building Your Roadmap..." : "Generate AI Roadmap"}
            </Button>
          </div>
        </Card>

        {/* LOADING STATE */}
        {loading && (
          <Card className="p-8 text-center">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-3xl animate-pulse">
                <FaBrain />
              </div>
            </div>
            <h2 className="text-lg font-black text-slate-800">
              Creating Your Personalized Career Roadmap
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Our AI is analyzing your verified profile and assembling your 4-month placement syllabus.
            </p>
            <div className="max-w-md mx-auto mt-6 text-left space-y-3">
              <div className="text-sm text-slate-600">✓ Reading verified resume skills from MongoDB</div>
              <div className="text-sm text-slate-600">✓ Calculating deterministic skill gaps</div>
              <div className="text-sm text-slate-600">✓ Prioritizing core fundamentals first</div>
              <div className="text-sm text-slate-600">✓ Structuring 4-month milestones and projects</div>
            </div>
          </Card>
        )}

        {/* ROADMAP RESULT */}
        {roadmap && !loading && (
          <>
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* DREAM ROLE */}
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FaBullseye />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-400">
                      Dream Role
                    </p>
                    <h3 className="text-lg font-black text-slate-800 mt-1">
                      {roadmap.targetRole}
                    </h3>
                  </div>
                </div>
              </Card>

              {/* READINESS */}
              <Card className="p-6">
                <p className="text-xs uppercase font-bold text-slate-400">
                  Career Readiness
                </p>
                <div className="text-4xl font-black text-blue-600 mt-2">
                  {roadmap.readinessScore}%
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${roadmap.readinessScore}%` }}
                  />
                </div>
              </Card>

              {/* SKILL GAP */}
              <Card className="p-6">
                <p className="text-xs uppercase font-bold text-slate-400">
                  Skill Gap
                </p>
                <div className="text-4xl font-black text-amber-500 mt-2">
                  {roadmap.skillGapPercentage}%
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  {roadmap.missingSkills?.length || 0} skills recommended for improvement
                </p>
              </Card>
            </div>

            {/* OVERALL LEARNING PROGRESS TRACKER */}
            <Card className="p-6 border-2 border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaTasks className="text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Study Progress
                    </p>
                    <h2 className="text-xl font-black text-slate-800">
                      Roadmap Completion
                    </h2>
                  </div>
                </div>
                <div className="text-3xl font-black text-blue-600">
                  {roadmap.progress?.overallProgress || 0}%
                </div>
              </div>

              <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${roadmap.progress?.overallProgress || 0}%`,
                  }}
                />
              </div>

              <p className="text-xs font-semibold text-slate-500 mt-3">
                {roadmap.progress?.completedTasks?.length || 0} tasks completed • Click any task below to mark as done
              </p>
            </Card>

            {/* AI STRATEGIC SUMMARY */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <FaBrain className="text-blue-600" />
                <h2 className="font-black text-slate-800">
                  AI Career Assessment
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {roadmap.roadmapSummary}
              </p>

              {roadmap.careerOutcome && (
                <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-xs uppercase font-bold text-blue-500">
                    Expected Career Outcome
                  </p>
                  <p className="text-sm font-semibold text-blue-800 mt-1">
                    {roadmap.careerOutcome}
                  </p>
                </div>
              )}
            </Card>

            {/* SKILLS COMPARISON */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CURRENT SKILLS */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaCheckCircle className="text-emerald-500" />
                  <h2 className="font-black text-slate-800">
                    Verified Strengths ({roadmap.currentSkills?.length || 0})
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {roadmap.currentSkills?.length > 0 ? (
                    roadmap.currentSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">
                      No verified skills detected.
                    </p>
                  )}
                </div>
              </Card>

              {/* MISSING SKILLS (WITH ZERO-GAP FALLBACK) */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaExclamationTriangle className="text-amber-500" />
                  <h2 className="font-black text-slate-800">
                    Skills to Develop ({roadmap.missingSkills?.length || 0})
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {roadmap.missingSkills?.length > 0 ? (
                    roadmap.missingSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-emerald-600 font-semibold">
                      Excellent! No major skill gaps detected.
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* ROADMAP SECTION HEADER */}
            <div className="pt-4 flex items-center gap-3">
              <FaCalendarAlt className="text-blue-600 text-xl" />
              <div>
                <h2 className="text-2xl font-black text-slate-800">
                  Your 4-Month Interactive Action Plan
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Check off skills, topics, and projects as you finish them to track your learning journey.
                </p>
              </div>
            </div>

            {/* MONTH CARDS */}
            <div className="space-y-6">
              {roadmap.months?.map((month) => {
                const projectTaskId = `month-${month.month}-project`;
                const isProjectCompleted =
                  roadmap.progress?.completedTasks?.includes(projectTaskId);

                return (
                  <Card key={month.month} className="p-6">
                    {/* MONTH HEADER */}
                    <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                      <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                        {month.month}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-600 uppercase">
                          Month {month.month}
                        </p>
                        <h2 className="text-xl font-black text-slate-800 mt-0.5">
                          {month.title}
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5 italic">
                          "{month.goal}"
                        </p>
                      </div>
                    </div>

                    {/* MONTH TASKS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {/* SKILLS */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FaBrain className="text-blue-500" />
                          <h3 className="text-sm font-black text-slate-700">
                            Skills to Master
                          </h3>
                        </div>
                        <ul className="space-y-2">
                          {month.skills?.map((skill, idx) => {
                            const taskId = `month-${month.month}-skill-${idx}`;
                            const isCompleted =
                              roadmap.progress?.completedTasks?.includes(taskId);

                            return (
                              <li
                                key={idx}
                                onClick={() => toggleTask(taskId)}
                                className={`cursor-pointer flex items-center gap-3 p-2 rounded-lg border transition ${
                                  isCompleted
                                    ? "bg-emerald-50/70 border-emerald-200"
                                    : "border-transparent hover:bg-slate-100/70"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={Boolean(isCompleted)}
                                  readOnly
                                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                                />
                                <span
                                  className={`text-sm ${
                                    isCompleted
                                      ? "text-slate-400 line-through"
                                      : "text-slate-700 font-medium"
                                  }`}
                                >
                                  {skill}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {/* TOPICS */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FaBookOpen className="text-purple-500" />
                          <h3 className="text-sm font-black text-slate-700">
                            Key Study Topics
                          </h3>
                        </div>
                        <ul className="space-y-2">
                          {month.topics?.map((topic, idx) => {
                            const taskId = `month-${month.month}-topic-${idx}`;
                            const isCompleted =
                              roadmap.progress?.completedTasks?.includes(taskId);

                            return (
                              <li
                                key={idx}
                                onClick={() => toggleTask(taskId)}
                                className={`cursor-pointer flex items-center gap-3 p-2 rounded-lg border transition ${
                                  isCompleted
                                    ? "bg-emerald-50/70 border-emerald-200"
                                    : "border-transparent hover:bg-slate-100/70"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={Boolean(isCompleted)}
                                  readOnly
                                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                                />
                                <span
                                  className={`text-sm ${
                                    isCompleted
                                      ? "text-slate-400 line-through"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {topic}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {/* ACTIVITIES */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FaProjectDiagram className="text-orange-500" />
                          <h3 className="text-sm font-black text-slate-700">
                            Practical Drills
                          </h3>
                        </div>
                        <ul className="space-y-2">
                          {month.activities?.map((activity, idx) => {
                            const taskId = `month-${month.month}-activity-${idx}`;
                            const isCompleted =
                              roadmap.progress?.completedTasks?.includes(taskId);

                            return (
                              <li
                                key={idx}
                                onClick={() => toggleTask(taskId)}
                                className={`cursor-pointer flex items-center gap-3 p-2 rounded-lg border transition ${
                                  isCompleted
                                    ? "bg-emerald-50/70 border-emerald-200"
                                    : "border-transparent hover:bg-slate-100/70"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={Boolean(isCompleted)}
                                  readOnly
                                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                                />
                                <span
                                  className={`text-sm ${
                                    isCompleted
                                      ? "text-slate-400 line-through"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {activity}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {/* PORTFOLIO PROJECT */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FaProjectDiagram className="text-indigo-500" />
                          <h3 className="text-sm font-black text-slate-700">
                            Portfolio Deliverable
                          </h3>
                        </div>
                        <div
                          onClick={() => toggleTask(projectTaskId)}
                          className={`cursor-pointer p-4 rounded-xl border transition flex items-start gap-3 ${
                            isProjectCompleted
                              ? "bg-emerald-50/70 border-emerald-200"
                              : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={Boolean(isProjectCompleted)}
                            readOnly
                            className="w-4 h-4 mt-0.5 accent-blue-600 cursor-pointer shrink-0"
                          />
                          <p
                            className={`text-sm ${
                              isProjectCompleted
                                ? "text-slate-400 line-through"
                                : "text-slate-800 font-semibold"
                            }`}
                          >
                            {month.project || "Hands-on implementation milestone"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* MILESTONE */}
                    <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-3">
                      <FaFlagCheckered className="text-blue-600 text-lg shrink-0" />
                      <div>
                        <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider block">
                          End of Month Milestone
                        </span>
                        <p className="text-xs font-semibold text-blue-900 mt-0.5">
                          {month.milestone}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}