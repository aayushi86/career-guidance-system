import { useState } from "react";
import axios from "axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { FaFileUpload, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const ROLES = [
  "Software Engineer",
  "Full Stack Developer",
  "Data Scientist",
  "Cloud / DevOps Engineer",
];

export default function ResumeAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      setSelectedFile(null);
      return;
    }

    if (file && file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      setSelectedFile(null);
      return;
    }

    setError("");
    setSelectedFile(file);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please upload your PDF resume.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    // Build standard multipart FormData
    const formData = new FormData();
    formData.append("resume", selectedFile);
    formData.append("targetRole", targetRole);

    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      // Notice: No "Content-Type": "multipart/form-data" header.
      // Axios and the browser will automatically compute the multipart boundary.
     const response = await axios.post(
  "http://localhost:5000/api/resumes/analyze",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);
      if (response.data?.success) {
        setResult(response.data.data || response.data.analysis);
      } else {
        throw new Error(response.data?.message || "Failed to analyze resume.");
      }
    } catch (err) {
      console.error("Resume analysis error:", err.response || err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to analyze resume. Check your connection or session."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800">ATS Resume Analyzer</h1>
          <p className="text-sm text-slate-600 mt-1">
            Evaluate your PDF resume against core competencies for placement drives.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <Card className="p-6">
          <form onSubmit={handleAnalyze} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                Target Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                Upload Resume (PDF)
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100 transition">
                <input
                  type="file"
                  id="resumeUpload"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="resumeUpload" className="cursor-pointer flex flex-col items-center">
                  <FaFileUpload className="text-3xl text-blue-600 mb-2" />
                  <span className="text-sm font-bold text-slate-700">
                    {selectedFile ? selectedFile.name : "Click to select your PDF resume"}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    {selectedFile
                      ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                      : "Maximum size: 5MB"}
                  </span>
                </label>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full py-3 font-bold">
              {loading ? "Parsing & Scoring Resume..." : "Run ATS Analysis"}
            </Button>
          </form>
        </Card>

        {result && (
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">ATS Compatibility</span>
                <div className="text-4xl font-black text-blue-600 mt-1">
                  {result.score ?? result.atsScore ?? 0}%
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase">Target</span>
                <div className="text-sm font-bold text-slate-700 mt-1">
                  {result.targetRole || targetRole}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-600 uppercase mb-2 flex items-center gap-1.5">
                <FaCheckCircle className="text-emerald-500" /> Matched Keywords
              </h3>
              {(!result.matchedSkills || result.matchedSkills.length === 0) ? (
                <p className="text-xs text-slate-400 italic">No direct matches found.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold uppercase"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-600 uppercase mb-2 flex items-center gap-1.5">
                <FaExclamationTriangle className="text-amber-500" /> Missing Recommended Keywords
              </h3>
              {(!result.missingSkills || result.missingSkills.length === 0) ? (
                <p className="text-xs text-emerald-600 font-bold">All core keywords present!</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold uppercase"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}