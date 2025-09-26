import React, { useState, useEffect } from "react";
import { ref, push, set, onValue } from "firebase/database";
import { db } from "../firebase";
import { useSelector } from "react-redux";

export default function AddBugForm({ projectId, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("low");
  const [assignee, setAssignee] = useState("");
  const [projectMembers, setProjectMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useSelector(state => state.user.user);

  // Fetch project members for assignment dropdown
  useEffect(() => {
    const projectRef = ref(db, `projects/${projectId}`);
    const unsubscribe = onValue(projectRef, (snapshot) => {
      const project = snapshot.val();
      if (project && project.members) {
        const members = Object.keys(project.members);
        setProjectMembers(members);
      }
    });
    return () => unsubscribe();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const bugsRef = ref(db, `projects/${projectId}/bugs`);
      const newBugRef = push(bugsRef);
      const bug = {
        id: newBugRef.key,
        title,
        description,
        severity,
        status: "open",
        createdBy: user.email,
        updatedBy: user.email,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        assignee: assignee || "",
      };
      await set(newBugRef, bug);
      setTitle("");
      setDescription("");
      setSeverity("low");
      setAssignee("");
      if (onSuccess) onSuccess(`Bug "${bug.title}" created successfully!`);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 space-y-6 hover:bg-white/15 transition-all duration-300 mb-8 animate-slide-up" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg mr-3 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h4 className="text-2xl font-bold text-white">Add New Bug</h4>
      </div>

      {/* Bug Title */}
      <div className="space-y-2">
        <label className="block text-white/90 font-medium">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Bug Title
          </span>
        </label>
        <input
          className="w-full px-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all duration-300 hover:bg-white/10"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter bug title..."
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-white/90 font-medium">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Description
          </span>
        </label>
        <textarea
          className="w-full px-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all duration-300 hover:bg-white/10 min-h-[120px] resize-none"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Describe the bug in detail..."
          required
        />
      </div>

      {/* Severity and Assignee Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Severity */}
        <div className="space-y-2">
          <label className="block text-white/90 font-medium">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Severity
            </span>
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all duration-300 hover:bg-white/10 cursor-pointer"
            value={severity}
            onChange={e => setSeverity(e.target.value)}
          >
            <option value="low" className="bg-gray-800 text-white">🟢 Low</option>
            <option value="medium" className="bg-gray-800 text-white">🟡 Medium</option>
            <option value="high" className="bg-gray-800 text-white">🔴 High</option>
          </select>
        </div>

        {/* Assignee */}
        <div className="space-y-2">
          <label className="block text-white/90 font-medium">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              Assign To
            </span>
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all duration-300 hover:bg-white/10 cursor-pointer"
            value={assignee}
            onChange={e => setAssignee(e.target.value)}
          >
            <option value="" className="bg-gray-800 text-white">👤 Unassigned</option>
            {projectMembers.map(member => (
              <option key={member} value={member} className="bg-gray-800 text-white">
                👤 {member}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/20 border border-red-400/30 text-red-300 text-sm flex items-center animate-shake">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold text-lg shadow-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Adding Bug...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Add Bug
          </>
        )}
      </button>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </form>
  );
}
