import React, { useState } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("drives");

  const placementRecords = [
    { name: "Aayushi Sharma", branch: "B.Sc IT", score: "88%", company: "Microsoft IDC", ctc: "21 LPA", status: "Offer Accepted" },
    { name: "Rahul Verma", branch: "B.Tech CSE", score: "82%", company: "Deloitte India", ctc: "11 LPA", status: "Shortlisted" },
    { name: "Pooja Patel", branch: "MCA", score: "79%", company: "AWS", ctc: "15 LPA", status: "Interview Round 2" },
    { name: "Rohan Nair", branch: "B.Sc CS", score: "85%", company: "Infosys Ltd", ctc: "9.5 LPA", status: "Offer Rolled Out" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Office of Career Services & Placements
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Placement Officer Master Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Oversee company JNF approvals, student eligibility audit, and institutional drive statistics.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition">
            Export Master Report (CSV)
          </button>
        </div>
      </div>

      {/* High-Level Institutional Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Students Registered", value: "348", sub: "Final Year Cohort", icon: "🎓" },
          { label: "Partner Companies", value: "42", sub: "Active Campus Drives", icon: "🏢" },
          { label: "Verified Offers Rolled", value: "186", sub: "94.8% Clearance", icon: "📜" },
          { label: "Highest Package Offered", value: "₹24.0 LPA", sub: "Microsoft IDC", icon: "💼" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
            <span className="text-xl">{item.icon}</span>
            <p className="text-2xl font-black text-slate-900">{item.value}</p>
            <p className="text-xs font-bold text-slate-700">{item.label}</p>
            <p className="text-[10px] text-slate-400">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Student Audit Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-900">
            Student Placement Clearance & JNF Status
          </h2>
          <span className="text-xs font-bold text-blue-600">IITM Verified Policy</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Degree Branch</th>
                <th className="py-3 px-4">AI Score</th>
                <th className="py-3 px-4">Recruiter</th>
                <th className="py-3 px-4">Offered Package</th>
                <th className="py-3 px-4">Placement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {placementRecords.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{r.name}</td>
                  <td className="py-3.5 px-4">{r.branch}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{r.score}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{r.company}</td>
                  <td className="py-3.5 px-4 text-emerald-600 font-bold">{r.ctc}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[10px]">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}