import { useState } from "react";

export default function InterviewPrep() {
  const [role, setRole] = useState("Software Engineer");
  const [questions, setQuestions] = useState([]);


  const fetchQuestions = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/interview?role=${encodeURIComponent(role)}`
      );

      const data = await res.json();

      if (data.success) {
        setQuestions(data.questions);
      }
    } catch (error) {
      console.log("Error fetching questions:", error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Interview Preparation 🎯
      </h1>

      {/* 🔽 ROLE DROPDOWN */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      >
        <option>Cloud Engineer</option>
        <option>Cybersecurity Analyst</option>
        <option>SOC Analyst</option>
        <option>Data Analyst</option>
        <option>Software Engineer</option>
        <option>Frontend Developer</option>
        <option>UI/UX Designer</option>
        <option>QA Tester</option>
      </select>

      {/* 🔘 BUTTON */}
      <button
        onClick={fetchQuestions}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate Questions
      </button>

      {/* 📋 QUESTIONS LIST */}
      <div className="mt-6 space-y-3">
        {questions.map((q, i) => (
          <div key={i} className="border p-4 rounded">
            <p><strong>Q:</strong> {q}</p>
          </div>
        ))}
      </div>

    </div>
  );
}