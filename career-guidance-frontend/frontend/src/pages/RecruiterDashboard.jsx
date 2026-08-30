import React, { useState, useEffect } from "react";
import { request } from "../services/api";

export default function RecruiterDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [applications, setApplications] = useState([]);

const [editingId, setEditingId] = useState(null);

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);

  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    link: "",
  });

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

  // ✅ FETCH APPLICATIONS
  useEffect(() => {
  const fetchApplications = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/applications");
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/jobs");
      const data = await res.json();
      setDrives(data.jobs || []);
    } catch (err) {
      console.log(err);
    }
  };

  fetchApplications();
  fetchJobs(); // 🔥 ADD THIS
}, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let url = "http://localhost:5000/api/jobs/jnf";
    let method = "POST";

    if (editingId) {
      url = `http://localhost:5000/api/jobs/${editingId}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert(editingId ? "✏️ Job updated" : "✅ Job posted");

      // refresh jobs
      const updated = await fetch("http://localhost:5000/api/jobs");
      const updatedData = await updated.json();
      setDrives(updatedData.jobs || []);

      setShowModal(false);
      setEditingId(null);
    }

  } catch (err) {
    console.log(err);
  }
};

const handleEdit = (job) => {
  if (!job || !job._id) {
    console.log("❌ Invalid job data", job);
    return;
  }

  setForm({
    company: job.company || "",
    title: job.title || "",
    ctcPackage: job.ctcPackage || "",
    minAssessmentScore: job.minAssessmentScore || 0,
    minCgpa: job.minCgpa || "",
    requiredSkills: job.requiredSkills || [],
    eligibleBranches: job.eligibleBranches || [],
    description: job.description || "",
  });

  setEditingId(job._id);
  setShowModal(true);
};

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this job?")) return;

  try {
    const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      // remove from UI instantly
      setDrives((prev) => prev.filter((job) => job._id !== id));
      alert("🗑 Job deleted successfully");
    }
  } catch (err) {
    console.log(err);
  }
};

const updateStatus = async (id, newStatus, extraData = {}) => {
  try {
    const res = await fetch(`http://localhost:5000/api/applications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
        ...extraData,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, ...data.application } : app
        )
      );
    }
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex justify-between items-center shadow-xl">
        <div>
          <h1 className="text-2xl font-black">Recruiter & Placement Drive Portal</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage drives and evaluate candidates.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl"
        >
          + Publish JNF
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Active Drives */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-2xl font-black text-slate-900">{drives.length}</p>
          <p className="text-xs font-semibold text-slate-500">ACTIVE POSTINGS</p>
        </div>

        {/* Total Applications */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-2xl font-black text-blue-600">{applications.length}</p>
          <p className="text-xs font-semibold text-slate-500">TOTAL APPLICANTS</p>
        </div>

        {/* Shortlisted */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-2xl font-black text-green-600">
          {applications.filter(a => a.status === "Shortlisted").length}
          </p>
          <p className="text-xs font-semibold text-slate-500">SHORTLISTED</p>
        </div>

        {/* Interviews */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
           <p className="text-2xl font-black text-purple-600">
            {applications.filter(a => a.status === "Interview Scheduled").length}
          </p>
          <p className="text-xs font-semibold text-slate-500">INTERVIEWS SCHEDULED</p>
        </div>

      </div>


      {/* Drives Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
  <h2 className="text-base font-bold text-slate-900 mb-4">
    Active Campus Drives
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full text-left text-xs text-slate-600">
      
      <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
        <tr>
          <th className="py-3 px-4">Role</th>
          <th className="py-3 px-4">Company</th>
          <th className="py-3 px-4">CTC</th>
          <th className="py-3 px-4">Cutoff</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Actions</th>
          
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {drives.map((d, _id) => (
          <tr key={d._id} className="hover:bg-slate-50/60 transition">
            
            <td className="py-3 px-4 font-bold text-slate-900">
              {d.title}
            </td>

            <td className="py-3 px-4 text-blue-600 font-semibold">
              {d.company || "Company"}
            </td>

            <td className="py-3 px-4 font-bold text-emerald-600">
              {d.ctcPackage}
            </td>

            <td className="py-3 px-4">
              {d.minAssessmentScore}%
            </td>

            <td className="py-3 px-4">
              <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-bold text-[10px]">
                {d.status}
              </span>
            </td>

            <td className="py-3 px-4 flex gap-2">

  {/* EDIT */}
  <button
    onClick={() => handleEdit(d)}
    className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded-lg text-[10px] font-bold hover:bg-yellow-100"
  >
    Edit
  </button>

  {/* DELETE */}
  <button
    onClick={() => handleDelete(d._id)}
    className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-100"
  >
    Delete
  </button>

</td>
          </tr>
        ))}
      </tbody>

    </table>
  </div>
</div>



{/* 🔥 APPLICATIONS TABLE (OLD UI STYLE) */}
<div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
  <h2 className="text-base font-bold text-slate-900 mb-4">
    Student Applications
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full text-left text-xs text-slate-600">
      <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
        <tr>
          <th className="py-3 px-4">Candidate</th>
          <th className="py-3 px-4">Applied Role</th>
          <th className="py-3 px-4">Match Score</th>
          <th className="py-3 px-4">Current Status</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {applications.map((app) => (
          <tr key={app._id} className="hover:bg-slate-50/60 transition">
            
            {/* Candidate */}
            <td className="py-3 px-4">
              <p className="font-bold text-slate-900">
                {app.applicantName}
              </p>
              <p className="text-[10px] text-slate-400">
                {app.applicantEmail}
              </p>
            </td>

            {/* Role */}
            <td className="py-3 px-4 font-medium">
              {app.jobTitle}
            </td>

            {/* Score */}
            <td className="py-3 px-4">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-bold">
                {app.careerScore}%
              </span>
            </td>

            {/* Status Badge */}
            <td className="py-3 px-4">
              <span
                className={`px-2 py-0.5 rounded-full font-bold text-[10px]
                ${
                  app.status === "Shortlisted"
                    ? "bg-green-50 text-green-600"
                    : app.status === "Rejected"
                    ? "bg-red-50 text-red-500"
                    : app.status === "Interview Scheduled"
                    ? "bg-purple-50 text-purple-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {app.status}
              </span>
            </td>

            {/* Actions */}
            <td className="py-3 px-4 flex flex-col gap-2">

  {/* Buttons */}
  <div className="flex gap-2">
    <button
      onClick={() => updateStatus(app._id, "Shortlisted")}
      className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold"
    >
      Shortlist
    </button>

    <button
      onClick={() => {
        setSelectedAppId(app._id);
        setShowInterviewModal(true);
      }}
      className="px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-bold"
    >
      Schedule
    </button>

    <button
      onClick={() => updateStatus(app._id, "Rejected")}
      className="px-2 py-1 bg-red-50 text-red-500 rounded-lg text-[10px] font-bold"
    >
      Reject
    </button>

    <button
  onClick={() => updateStatus(app._id, "Selected")}
  className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold hover:bg-blue-100"
>
  Select
</button>

  </div>

  {/* 🔥 CLICKABLE GOOGLE MEET LINK */}
  {app.interviewLink && (
    <a
      href={app.interviewLink}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline text-xs font-bold"
    >
      Join Interview
    </a>
  )}

</td>

          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

{showInterviewModal && (
  <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
    <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl space-y-4">
      
      <h2 className="text-lg font-bold">Schedule Interview</h2>

      <input
        type="date"
        value={interviewData.date}
        onChange={(e) =>
          setInterviewData({ ...interviewData, date: e.target.value })
        }
        className="w-full p-2 border rounded"
      />

      <input
        type="time"
        value={interviewData.time}
        onChange={(e) =>
          setInterviewData({ ...interviewData, time: e.target.value })
        }
        className="w-full p-2 border rounded"
      />

      <input
  type="url"
  placeholder="https://meet.google.com/abc-defg-hij"
  value={interviewData.link}
  onChange={(e) =>
    setInterviewData({ ...interviewData, link: e.target.value })
  }
  className="w-full p-2 border rounded"
/>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowInterviewModal(false)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            updateStatus(selectedAppId, "Interview Scheduled", {
              interviewDate: interviewData.date,
              interviewTime: interviewData.time,
              interviewLink: interviewData.link,
            });

            setShowInterviewModal(false);
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Save
        </button>
      </div>

    </div>
  </div>
)}

      {/* Modal */}
      {showModal && (
<div className="fixed inset-0 z-50 overflow-y-auto flex justify-center items-start pt-10 bg-black/40">          <div className="bg-white p-6 rounded-xl w-96">
<h2 className="font-bold mb-3">
  {editingId ? "Edit Job" : "Create Drive"}
</h2>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">

  {/* Company */}
  <div>
    <label className="font-bold text-slate-700 block mb-1">Company Name</label>
    <input
      type="text"
      required
      placeholder="e.g. Infosys"
      value={form.company}
      onChange={(e) => setForm({ ...form, company: e.target.value })}
      className="w-full p-2.5 rounded-xl border border-slate-200"
    />
  </div>

  {/* Role */}
  <div>
    <label className="font-bold text-slate-700 block mb-1">Role</label>
    <input
      type="text"
      required
      placeholder="e.g. Frontend Developer"
      value={form.title}
      onChange={(e) => setForm({ ...form, title: e.target.value })}
      className="w-full p-2.5 rounded-xl border border-slate-200"
    />
  </div>

  {/* CTC + Score */}
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
      <label className="font-bold text-slate-700 block mb-1">Min AI Score</label>
      <input
        type="number"
        value={form.minAssessmentScore}
        onChange={(e) => setForm({ ...form, minAssessmentScore: e.target.value })}
        className="w-full p-2.5 rounded-xl border border-slate-200"
      />
    </div>
  </div>

  {/* CGPA */}
  <div>
    <label className="font-bold text-slate-700 block mb-1">Min CGPA</label>
    <input
      type="number"
      placeholder="e.g. 7.5"
      onChange={(e) => setForm({ ...form, minCgpa: e.target.value })}
      className="w-full p-2.5 rounded-xl border border-slate-200"
    />
  </div>

  {/* Skills */}
  <div>
    <label className="font-bold text-slate-700 block mb-1">Skills (comma separated)</label>
    <input
      type="text"
      placeholder="React, Node.js"
      onChange={(e) =>
        setForm({ ...form, requiredSkills: e.target.value.split(",") })
      }
      className="w-full p-2.5 rounded-xl border border-slate-200"
    />
  </div>

  {/* Branches */}
  <div>
    <label className="font-bold text-slate-700 block mb-1">Eligible Branches</label>
    <input
      type="text"
      placeholder="B.Sc IT, B.Tech CSE"
      onChange={(e) =>
        setForm({ ...form, eligibleBranches: e.target.value.split(",") })
      }
      className="w-full p-2.5 rounded-xl border border-slate-200"
    />
  </div>

  {/* Description */}
  <div>
    <label className="font-bold text-slate-700 block mb-1">Description</label>
    <textarea
      rows="3"
      placeholder="Job details..."
      onChange={(e) => setForm({ ...form, description: e.target.value })}
      className="w-full p-2.5 rounded-xl border border-slate-200"
    />
  </div>

  {/* Buttons */}
  <div className="flex justify-end gap-2 pt-3">
    <button
      type="button"
      onClick={() => setShowModal(false)}
      className="px-4 py-2 bg-gray-200 rounded-lg"
    >
      Cancel
    </button>

   <button
  type="submit"
  className="px-5 py-2 bg-blue-600 text-white rounded-lg"
>
  {editingId ? "Update Job" : "Publish Drive"}
</button>

  </div>
</form>
          </div>
        </div>
      )}
    </div>
  );
}