import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  FaChartLine,
  FaFileAlt,
  FaBrain,
  FaBriefcase,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaTrophy,
  FaArrowRight,
} from "react-icons/fa";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token =
    localStorage.getItem("token") || localStorage.getItem("career_token");

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) {
        setError("Session token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/dashboard/progress",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data?.success) {
          setData(res.data.data);
        } else {
          throw new Error(res.data?.message || "Failed to load dashboard.");
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Error loading progress."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-600">
            Loading Career Progress Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
              Placement Cell • Central Console
            </span>
            <h1 className="text-3xl font-black text-slate-800 mt-2">
              Career Progress Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Unified tracking across ATS resume benchmarks, AI roadmaps, and recruiter applications.
            </p>
          </div>

          <div className="flex gap-2">
            <Link to="/resume-analyzer">
              <Button className="text-xs font-bold py-2.5 px-4 bg-purple-600 hover:bg-purple-700">
                <FaFileAlt className="mr-1.5" /> Analyze Resume
              </Button>
            </Link>
            <Link to="/career-roadmap">
              <Button className="text-xs font-bold py-2.5 px-4 bg-blue-600 hover:bg-blue-700">
                <FaBrain className="mr-1.5" /> View Roadmap
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {data && (
          <>
            {/* OVERALL EMPLOYABILITY SCORE BANNER */}
            <Card className="p-8 border-2 border-blue-100 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1.5">
                    <FaTrophy /> Calculated Placement Readiness
                  </span>
                  <div className="text-6xl font-black mt-2">
                    {data.overallEmployabilityScore}%
                  </div>
                  <p className="text-xs text-blue-100 mt-2 max-w-md">
                    Weighted index calculated from your latest ATS resume score (40%), target role readiness (30%), and completed study roadmap tasks (30%).
                  </p>
                </div>

                <div className="w-full sm:w-1/3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <span className="text-[10px] font-black uppercase text-blue-200 block mb-2">
                    Metric Weights Breakdown
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/80">Latest ATS Score (40%)</span>
                      <span className="font-bold">{data.resume?.latestATSScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Role Match (30%)</span>
                      <span className="font-bold">{data.roadmap?.readinessScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Roadmap Done (30%)</span>
                      <span className="font-bold">{data.roadmap?.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* THREE PILLAR METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* RESUME ANALYZER PILLAR */}
              <Card className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
                      <FaFileAlt />
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      ATS Engine
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Latest Resume Score
                  </p>
                  <div className="text-3xl font-black text-slate-800 mt-1">
                    {data.resume?.latestATSScore}%
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Personal Best:</span>
                      <span className="font-bold text-slate-800">{data.resume?.bestATSScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Audits Completed:</span>
                      <span className="font-bold text-slate-800">{data.resume?.totalAnalyses}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/resume-analyzer"
                  className="mt-6 text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1.5 pt-3 border-t border-slate-100"
                >
                  Optimize Resume <FaArrowRight />
                </Link>
              </Card>

              {/* ROADMAP PILLAR */}
              <Card className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                      <FaBrain />
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      AI Roadmap
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Target Role
                  </p>
                  <div className="text-xl font-black text-slate-800 mt-1 truncate">
                    {data.roadmap?.targetRole}
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Curriculum Completed:</span>
                      <span className="font-bold text-blue-600">{data.roadmap?.progress}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tasks Finished:</span>
                      <span className="font-bold text-slate-800">{data.roadmap?.completedTasksCount}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/career-roadmap"
                  className="mt-6 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 pt-3 border-t border-slate-100"
                >
                  Continue Learning <FaArrowRight />
                </Link>
              </Card>

              {/* APPLICATION PIPELINE PILLAR */}
              <Card className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                      <FaBriefcase />
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Placements
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Total Submissions
                  </p>
                  <div className="text-3xl font-black text-slate-800 mt-1">
                    {data.applications?.total}
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Shortlisted / Interviews:</span>
                      <span className="font-bold text-emerald-600">
                        {data.applications?.shortlisted + data.applications?.interviewScheduled}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Offers Extended:</span>
                      <span className="font-bold text-slate-800">{data.applications?.offerExtended}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/my-applications"
                  className="mt-6 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 pt-3 border-t border-slate-100"
                >
                  Track Applications <FaArrowRight />
                </Link>
              </Card>
            </div>

            {/* LIVE APPLICATION FUNNEL */}
            <Card className="p-6">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2">
                <FaChartLine className="text-blue-600" />
                Live Recruitment Pipeline
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">Applied</span>
                  <div className="text-2xl font-black text-slate-800 mt-1">{data.applications?.applied}</div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="text-xs font-bold text-blue-600 uppercase">Shortlisted</span>
                  <div className="text-2xl font-black text-blue-700 mt-1">{data.applications?.shortlisted}</div>
                </div>

                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                  <span className="text-xs font-bold text-purple-600 uppercase">Interviews</span>
                  <div className="text-2xl font-black text-purple-700 mt-1">{data.applications?.interviewScheduled}</div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-600 uppercase">Offers</span>
                  <div className="text-2xl font-black text-emerald-700 mt-1">{data.applications?.offerExtended}</div>
                </div>

                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                  <span className="text-xs font-bold text-rose-600 uppercase">Rejected</span>
                  <div className="text-2xl font-black text-rose-700 mt-1">{data.applications?.rejected}</div>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}