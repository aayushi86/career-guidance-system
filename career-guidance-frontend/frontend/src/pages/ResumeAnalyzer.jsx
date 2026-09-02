import { useState } from "react";
import { resumeApi } from "../services/resumeApi";

export default function ResumeAnalyzer() {

  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const saved = JSON.parse(localStorage.getItem("careerResult"));

  const [detectedRole, setDetectedRole] = useState(
    saved?.career || "Not detected"
  );

  const handleAnalyze = async (e) => {
  e.preventDefault();

  if (!file) {
    setError("Please upload a resume file");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("targetRole", detectedRole);
    formData.append("resumeText", resumeText);

    const res = await fetch("http://localhost:5000/api/resume/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    console.log(data); // 👈 DEBUG

    if (data.success) {
      setResult(data.analysis);     
      setDetectedRole(data.detectedRole); 

      localStorage.setItem("careerResult", JSON.stringify({
        career: data.detectedRole,
        skills: data.analysis.missingKeywords || []
      }));

    }

  } catch (err) {
    console.error(err);
    setError("Failed to analyze resume");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider">
            📄 AI Resume ATS Grader
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Optimize Your Resume for Campus Recruiters
          </h1>
          <p className="text-slate-500 text-sm">
            Paste your resume text to evaluate keyword density, impact verbs, and ATS compatibility.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Detected Job Role
            </label>

            <div className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800">
              {detectedRole === "Not detected"
              ? "⚠️ Please complete Career Test first"
              : detectedRole}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Paste Resume Text / Summary</label>
            
            {/* TEXTAREA */}
            <textarea
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-3"
            />
            
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3"
            />
          </div>

          {error && <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-semibold">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-2xl text-sm shadow-md shadow-purple-500/20 transition disabled:opacity-50"
          >
            {loading ? "Grading Resume Content..." : "Grade Resume with AI 🚀"}
          </button>
        </form>

        {/* Results Card */}
        {result && (
          <div className="space-y-6">
            
            {/* Score Banner */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">ATS Score Report</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">Role Match: {result?.targetRole || detectedRole}</h3>
                <p className="text-slate-500 text-sm mt-1">Based on keyword matching and industry ATS parsing metrics.</p>
              </div>
              <div className="flex flex-col items-center justify-center p-5 bg-purple-50 border border-purple-100 rounded-2xl min-w-[140px]">
                <span className="text-4xl font-black text-purple-700">{result?.atsScore}/100</span>
                <span className="text-[10px] font-bold text-purple-800 uppercase tracking-widest mt-0.5">ATS Match</span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase">Role Keywords</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1">{result?.rubricBreakdown.keywordMatchScore || 0}%</h4>
                <p className="text-xs text-slate-500 mt-1">{result?.strongActionVerbs?.length || 0} matched keywords</p>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase">Action Verbs</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1">{result?.rubricBreakdown.actionVerbDensity || 0}%</h4>
                <p className="text-xs text-slate-500 mt-1">Impact statement score</p>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase">Section Structure</p>
                <h4 className="text-2xl font-black text-slate-900 mt-1">{result?.rubricBreakdown.parsabilityScore || 0}%</h4>
                <p className="text-xs text-slate-500 mt-1">Core sections identified</p>
              </div>
            </div>

            {/* Suggestions & Keywords */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h4 className="text-lg font-black text-slate-900">AI Feedback & Improvements</h4>
              <ul className="space-y-2">
                {result?.bulletPointImprovements?.map((s, idx) => (
                  <li key={idx} className="p-3.5 bg-slate-50 rounded-2xl text-xs font-semibold text-slate-700 flex items-start gap-2.5">
                    <span className="text-purple-600 font-bold">💡</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>

              {result?.missingKeywords?.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recommended Keywords to Include</p>
                  <div className="flex flex-wrap gap-2">
                    {result?.missingKeywords?.map((kw) => (
                      <span key={kw} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-xl border border-purple-100">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}