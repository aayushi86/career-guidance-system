import { useState, useEffect } from "react";

export default function SkillGap() {

  const [selectedRole, setSelectedRole] = useState("");
  const [skills, setSkills] = useState([]); // ✅ ADD THIS

useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("careerResult"));

  if (saved) {
    setSelectedRole(saved.career || "");
    setSkills(saved.skills || []);
    setSelectedSkills(saved.skills || []);
  }
}, []);

  const [targetRole, setTargetRole] = useState(selectedRole || "Software Engineer");    const [selectedSkills, setSelectedSkills] = useState(["Python", "SQL"]);
  const [analysisResult, setAnalysisResult] = useState(null);

  const availableSkills = [
    "Python", "SQL", "Statistics", "Machine Learning", "Data Analysis",
    "Pandas", "JavaScript", "React", "Node.js", "MongoDB",
    "HTML/CSS", "Git", "Artificial Intelligence", "Excel", "Power BI", "C++", "Java", "Docker", "AWS"
  ];

  const roleRequirements = {
    "Software Engineer": ["JavaScript", "React", "Node.js", "SQL", "Git", "Docker", "C++"],
    "Data Scientist": ["Python", "SQL", "Statistics", "Machine Learning", "Pandas", "Data Analysis"],
    "Cloud Engineer": ["AWS", "Docker", "Linux", "Python", "Git", "Networking"],
    "Full Stack Developer": ["JavaScript", "React", "Node.js", "MongoDB", "HTML/CSS", "Git"]
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const runAnalysis = () => {
    const required = roleRequirements[targetRole] || ["Python", "SQL", "Git"];
    const matched = selectedSkills.filter((s) => required.includes(s));
    const missing = required.filter((s) => !selectedSkills.includes(s));
    const score = Math.round((matched.length / required.length) * 100);

    setAnalysisResult({
      score,
      matched,
      missing,
      recommendation:
        missing.length === 0
          ? "You meet 100% of the baseline requirements for this placement profile!"
          : `Focus on mastering ${missing.join(", ")} to reach optimal recruiter clearance threshold.`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-blue-200">
          ⚡ Skill Gap Analyzer
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Benchmark Your Placement Readiness
        </h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Select your target campus recruitment role and your current skills to calculate institutional readiness.
        </p>
      </div>

      {/* Selector Box */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Role Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Select Your Target Campus Role
          </label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-blue-500"
          >
            <option value="Software Engineer">Software Engineer (Full Stack / Backend)</option>
            <option value="Data Scientist">Data Scientist / AI Engineer</option>
            <option value="Cloud Engineer">Cloud & DevOps Engineer</option>
            <option value="Full Stack Developer">Full Stack Web Developer</option>
          </select>
        </div>

        {/* Skill Pills */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-bold text-slate-700">
              Your Current Technical Skills
            </label>
            <span className="text-[11px] font-bold text-blue-600">
              {selectedSkills.length} selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableSkills.map((skill) => {
              const active = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    active
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {active && <span>✓</span>}
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={runAnalysis}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/25 transition text-xs flex items-center justify-center gap-2"
        >
          ⚡ Run Skill Gap Analysis
        </button>
      </div>

      {/* Analysis Result Card */}
      {analysisResult && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Placement Benchmark</p>
              <h3 className="text-xl font-black">{targetRole}</h3>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-emerald-400">{analysisResult.score}%</span>
              <span className="text-[10px] text-slate-400 block">Match Score</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-emerald-400 mb-2">✓ Verified Matching Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.matched.length > 0 ? (
                  analysisResult.matched.map((s) => (
                    <span key={s} className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-lg border border-emerald-500/30">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">None matched</span>
                )}
              </div>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <p className="text-xs font-bold text-rose-400 mb-2">⚠ Missing Critical Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.missing.length > 0 ? (
                  analysisResult.missing.map((s) => (
                    <span key={s} className="px-2 py-1 bg-rose-500/20 text-rose-300 text-[10px] font-bold rounded-lg border border-rose-500/30">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400">All target skills acquired!</span>
                )}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
            💡 <strong className="text-white">AI Roadmap Action:</strong> {analysisResult.recommendation}
          </p>
        </div>
      )}
    </div>
  );
}