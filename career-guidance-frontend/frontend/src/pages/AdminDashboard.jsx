import { useEffect, useState } from "react";
import { request } from "../services/api";

export default function AdminDashboard() {
  console.log("AdminDashboard Loaded");
  console.log("🔥 ADMIN DASHBOARD ACTIVE 🔥");

  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);


  useEffect(() => {

    console.log("useEffect running"); // ✅

    const fetchAdminData = async () => {
      console.log("Fetching API..."); // 👈 MUST PRINT
      try {
        const res = await request("/admin/stats");

        console.log("ADMIN API:", res); // ✅ ADD THIS LINE

        if (res.success) {
          setStats(res.stats);
          setApplications(res.recentActivity); // ✅ correct field
        }
      } catch (err) {
        console.error("Admin fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl flex justify-between items-center">
        <div>
          <span className="px-3 py-1 text-xs font-bold bg-blue-500/20 rounded-full">
            ADMIN CONTROL PANEL
          </span>
          <h1 className="text-3xl font-black mt-2">
            Welcome Admin 👑
          </h1>
          <p className="text-sm text-slate-300">
            Manage students, recruiters, jobs and placements
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-3xl p-6 shadow">
          <p className="text-xs text-gray-400 font-bold">Students</p>
          <h2 className="text-2xl font-black">{stats?.totalStudents}</h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow">
          <p className="text-xs text-gray-400 font-bold">Recruiters</p>
          <h2 className="text-2xl font-black">{stats?.totalRecruiters}</h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow">
          <p className="text-xs text-gray-400 font-bold">Jobs</p>
          <h2 className="text-2xl font-black">{stats?.totalJobs}</h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow">
          <p className="text-xs text-gray-400 font-bold">Applications</p>
          <h2 className="text-2xl font-black">{stats?.totalApplications}</h2>
        </div>

      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl p-6 shadow">
        <h2 className="text-xl font-bold mb-4">
          Student Placement Status
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2">Student</th>
                <th>Email</th>
                <th>Job</th>
                <th>Company</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app._id} className="border-b">
                    <td className="py-2">{app.applicantName}</td>
                    <td>{app.applicantEmail}</td>
                    <td>{app.jobTitle}</td>
                    <td>{app.companyName}</td>
                    <td className="font-semibold">
                      {app.status || "Pending"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No applications found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}