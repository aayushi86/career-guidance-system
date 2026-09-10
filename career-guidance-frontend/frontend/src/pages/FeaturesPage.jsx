import { useState } from "react";
import AuthModal from "../components/common/AuthModal";

function FeaturesPage() {
const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-8">Platform Features</h1>

      <div className="grid gap-6 md:grid-cols-2">

        {/* ✅ Free Feature */}
        <div className="p-6 border rounded-xl">
          <h2 className="text-xl font-semibold">Job Listings</h2>
          <p className="text-gray-500">Available for all users</p>
        </div>

        {/* 🔒 Locked Feature */}
        <div className="p-6 border rounded-xl bg-gray-50">
          <h2 className="text-xl font-semibold">AI Career Guidance 🔒</h2>
          <p className="text-gray-500 mb-3">Login required</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Unlock
          </button>
        </div>

        {/* 🔒 Locked Feature */}
        <div className="p-6 border rounded-xl bg-gray-50">
          <h2 className="text-xl font-semibold">Resume Analyzer 🔒</h2>
          <p className="text-gray-500 mb-3">Login required</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Unlock
          </button>
        </div>

        {/* 🔒 Locked Feature */}
        <div className="p-6 border rounded-xl bg-gray-50">
          <h2 className="text-xl font-semibold">Skill Gap Analysis 🔒</h2>
          <p className="text-gray-500 mb-3">Login required</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Unlock
          </button>
        </div>

        {/* 🔒 AI Assistant */}
        <div className="p-6 border rounded-xl bg-gray-50">
        <h2 className="text-xl font-semibold">AI Assistant 🔒</h2>
        <p className="text-gray-500 mb-3">Login required</p>
        <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
        >
            Unlock
        </button>
        </div>

        {/* 🔒 Interview Prep */}
        <div className="p-6 border rounded-xl bg-gray-50">
        <h2 className="text-xl font-semibold">Interview Preparation 🔒</h2>
        <p className="text-gray-500 mb-3">Login required</p>
        <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
        >
            Unlock
        </button>
        </div>

      </div>

       {/* ✅ THIS MUST BE INSIDE RETURN */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

    </div>
    
  );
  
}

export default FeaturesPage;