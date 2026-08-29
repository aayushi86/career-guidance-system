import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { skillApi } from "../services/skillApi";

const skillOptions = [
  "Python", "SQL", "Statistics", "Machine Learning", "Data Analysis", 
  "Pandas", "JavaScript", "React", "Node.js", "MongoDB", "HTML", 
  "CSS", "Git", "Artificial Intelligence", "Excel", "Power BI", "C++"
];

export default function SkillGap() {
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [targetRole, setTargetRole] = useState("Data Scientist");
  const [selectedSkills, setSelectedSkills] = useState(["Python", "SQL"]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await skillApi.getRoles();
        if (res.success) {
          setRoles(res.roles);
          if (res.roles.length > 0) setTargetRole(res.roles[0]);
        }
      } catch (err) {
        console.error("Failed to load roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await skillApi.analyzeGap({
        targetRole,
        userSkills: selectedSkills,
      });

      if (res.success) {
        setResult(res.analysis);
      }
    } catch (err) {
      setError(err.message || "Failed to generate gap report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            📊 Skill Gap Analyzer
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Benchmark Your Placement Readiness
          </h1>
          <p className="text-slate-500 text-sm">
            Select your desired job title and current technical skills to discover missing proficiencies and recommended action steps.
          </p>
        </div>

        {/* Configuration Card */}
        <form onSubmit={handleAnalyze} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Select Your Target Role</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="block text-sm font-bold text-slate-700">Your Current Technical Skills</label>
              <span className="text-xs font-semibold text-emerald-600">{selectedSkills.length} selected</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}{skill}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-semibold">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl text-sm shadow-md shadow-emerald-500/20 transition disabled:opacity-50"
          >
            {loading ? "Evaluating Benchmark..." : "Run Skill Gap Analysis 📊"}
          </button>
        </form>

        {/* Results Analysis */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Score Overview */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Benchmark Report</span>
                <h3 className="text-2xl font-black text-slate-900">{result.targetRole}</h3>
                <p className="text-slate-500 text-sm">
                  You possess {result.acquiredSkills.length} of {result.totalRequired} core required competencies.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-5 bg-emerald-50 border border-emerald-100 rounded-2xl min-w-[130px]">
                <span className="text-4xl font-black text-emerald-700">{result.readinessScore}%</span>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mt-0.5">Role Fit</span>
              </div>
            </div>

            {/* Acquired vs Missing Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Acquired Skills ({result.acquiredSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.acquiredSkills.length > 0 ? (
                    result.acquiredSkills.map((sk) => (
                      <span key={sk} className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl">
                        ✓ {sk}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">No matching skills selected yet.</p>
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Missing Skills to Learn ({result.missingSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.length > 0 ? (
                    result.missingSkills.map((sk) => (
                      <span key={sk} className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl">
                        + {sk}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-emerald-600 font-semibold">Great job! You have all the core skills for this role.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recommended Project & Learning Track */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h4 className="text-lg font-black text-slate-900">Recommended Project Portfolio</h4>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700">
                💡 {result.recommendedProjects}
              </div>

              <h4 className="text-lg font-black text-slate-900 pt-2">Recommended Learning Tracks</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {result.learningResources.map((res, i) => (
                  <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <p className="text-xs font-bold text-slate-900">{res.topic}</p>
                    <p className="text-xs text-slate-400 mt-1">Platform: {res.platform}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}