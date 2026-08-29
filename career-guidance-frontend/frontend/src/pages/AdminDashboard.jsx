import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { adminApi } from "../services/adminApi";

export default function AdminDashboard({ onOpenAuth }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminApi.getStats();
        if (res.success) setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleExportCSV = () => {
    if (!data?.recentActivity?.length) {
      alert("No student application records found to export.");
      return;
    }

    const headers = ["Student Name", "Email", "Applied Role", "Company", "Match Score", "Status", "Date"];
    const rows = data.recentActivity.map((app) => [
      `"${app.applicantName || "Student"}"`,
      `"${app.applicantEmail || ""}"`,
      `"${app.jobTitle || ""}"`,
      `"${app.companyName || "Tech Partner"}"`,
      `"${app.careerScore || 85}%"`,
      `"${app.status || "Applied"}"`,
      `"${new Date(app.createdAt || Date.now()).toLocaleDateString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Campus_Placement_Records_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-3xl font-black mb-4">
          🏛️
        </div>
        <h2 className="text-3xl font-black text-slate-900">Placement Officer Portal</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-sm">
          Sign in to access aggregated campus placement statistics, recruiter drives, and applicant metrics.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition text-sm"
        >
          Sign In to Access Dashboard →
        </button>
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

  const stats = data?.stats || {};

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="px-3.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider border border-blue-100">
              Campus Placement Cell
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Placement Officer Console</h1>
            <p className="text-slate-500 text-sm">Aggregate institutional hiring metrics and student placement progress.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 transition text-xs flex items-center gap-2"
            >
              📊 Export Placement Data (CSV)
            </button>

            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-5 py-3 rounded-2xl">
              <span className="text-2xl font-black text-emerald-700">{stats.placementRate || 0}%</span>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Placement Rate</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Registered Students</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalStudents || 0}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Partner Recruiters</p>
            <h3 className="text-3xl font-black text-indigo-600 mt-1">{stats.totalRecruiters || 0}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Total Job Openings</p>
            <h3 className="text-3xl font-black text-blue-600 mt-1">{stats.totalJobs || 0}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Total Applications</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalApplications || 0}</h3>
          </div>
        </div>

        {/* Activity & Domain Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Domain Distribution */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900">Hiring by Domain</h3>
            <div className="space-y-3">
              {stats.domainDistribution && Object.keys(stats.domainDistribution).length > 0 ? (
                Object.entries(stats.domainDistribution).map(([domain, count]) => (
                  <div key={domain} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-slate-700">{domain}</span>
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 font-black text-xs rounded-lg">{count} drives</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No active domain records.</p>
              )}
            </div>
          </div>

          {/* Recent Applications Feed */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Live Campus Application Stream</h3>
              <span className="text-xs font-semibold text-slate-400">
                {data?.recentActivity?.length || 0} Recorded
              </span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {data?.recentActivity?.length > 0 ? (
                data.recentActivity.map((act) => (
                  <div key={act._id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{act.applicantName}</p>
                      <p className="text-slate-400">{act.jobTitle}</p>
                    </div>
                    <span className="px-3 py-1 bg-slate-100 font-bold text-slate-600 rounded-full">
                      {act.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4">No recent campus applications.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}