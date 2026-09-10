import { useNavigate } from "react-router-dom";

function GuestDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome Guest 👋</h1>

      <p className="mb-8 text-gray-600">
        You are using limited access. Login to unlock full features.
      </p>

      <div className="grid gap-6 md:grid-cols-2">

        {/* ✅ Allowed Feature */}
        <div className="p-6 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Job Listings</h2>
          <p className="text-gray-500 mb-4">Browse available jobs</p>
          <button
            onClick={() => navigate("/jobs")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            View Jobs
          </button>
        </div>

        {/* 🔒 Locked Feature */}
        <div className="p-6 bg-white rounded-xl shadow opacity-60">
          <h2 className="text-xl font-semibold mb-2">AI Career Guidance 🔒</h2>
          <p className="text-gray-500 mb-4">Login required</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Login to Access
          </button>
        </div>

        {/* 🔒 Locked Feature */}
        <div className="p-6 bg-white rounded-xl shadow opacity-60">
          <h2 className="text-xl font-semibold mb-2">Resume Analyzer 🔒</h2>
          <p className="text-gray-500 mb-4">Login required</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Login to Access
          </button>
        </div>

        {/* 🔒 AI Assistant */}
        <div className="p-6 bg-white rounded-xl shadow opacity-60">
        <h2 className="text-xl font-semibold mb-2">AI Assistant 🔒</h2>
        <p className="text-gray-500 mb-4">Requires login</p>
        <button
            onClick={() => setShowAuthModal(true)}
            className="bg-gray-400 text-white px-4 py-2 rounded"
        >
            Login to Access
        </button>
        </div>

        {/* 🔒 Interview Preparation */}
        <div className="p-6 bg-white rounded-xl shadow opacity-60">
        <h2 className="text-xl font-semibold mb-2">Interview Preparation 🔒</h2>
        <p className="text-gray-500 mb-4">Requires login</p>
        <button
            onClick={() => setShowAuthModal(true)}
            className="bg-gray-400 text-white px-4 py-2 rounded"
        >
            Login to Access
        </button>
        </div>

      </div>
    </div>
  );
}

export default GuestDashboard;