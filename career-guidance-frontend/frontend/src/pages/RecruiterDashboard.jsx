import React, { useState } from "react";

export default function RecruiterDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [drives, setDrives] = useState([
    { title: "Associate Software Engineer", ctcPackage: "₹12 - 16 LPA", minAssessmentScore: 75, status: "Active" },
    { title: "Junior Data Scientist", ctcPackage: "₹10 - 14 LPA", minAssessmentScore: 80, status: "Active" },
  ]);

  const [form, setForm] = useState({
    company: "",
    title: "",
    ctcPackage: "12-16 LPA",
    minAssessmentScore: 75,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDrive = {
      title: form.title || "Junior Developer",
      ctcPackage: `₹${form.ctcPackage}`,
      minAssessmentScore: Number(form.minAssessmentScore) || 75,
      status: "Active",
    };
    setDrives([newDrive, ...drives]);
    alert("✅ Job Notification Form (JNF) published successfully!");
    setShowModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
            IITM CDC Placement Architecture
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Recruiter & Placement Drive Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage Job Notification Forms (JNF) and evaluate candidate AI readiness cutoffs.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition text-xs flex items-center gap-2 whitespace-nowrap"
        >
          📋 Publish New JNF Drive
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Placement Drives", value: drives.length, icon: "🏢" },
          { label: "Total Applications", value: drives.length * 9 + 10, icon: "📄" },
          { label: "AI Shortlisted Cohort", value: drives.length * 4 + 3, icon: "⚡" },
          { label: "Interviews Scheduled", value: drives.length * 2 + 2, icon: "🎯" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
            <span className="text-xl">{item.icon}</span>
            <p className="text-2xl font-black text-slate-900">{item.value}</p>
            <p className="text-xs font-semibold text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Dynamic JNF Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Active Campus Drives</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Role Title</th>
                <th className="py-3 px-4">CTC Package</th>
                <th className="py-3 px-4">AI Score Cutoff</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {drives.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{d.title}</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">{d.ctcPackage}</td>
                  <td className="py-3 px-4 font-mono">≥ {d.minAssessmentScore}% Match</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold">
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JNF Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-black text-slate-900">Job Notification Form (JNF)</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wipro, Google, Infosys"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Role / Designation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Associate Software Engineer"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">CTC (LPA)</label>
                  <input
                    type="text"
                    value={form.ctcPackage}
                    onChange={(e) => setForm({ ...form, ctcPackage: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min AI Score Cutoff (%)</label>
                  <input
                    type="number"
                    value={form.minAssessmentScore}
                    onChange={(e) => setForm({ ...form, minAssessmentScore: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">Publish Drive</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}