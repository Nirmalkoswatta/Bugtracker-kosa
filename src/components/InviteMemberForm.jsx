import React, { useState } from "react";
import { ref, update } from "firebase/database";
import { db } from "../firebase";

export default function InviteMemberForm({ projectId }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInvite = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const projectRef = ref(db, `projects/${projectId}/members/${email}`);
      await update(projectRef, role);
      setSuccess(`Invited ${email} as ${role}`);
      setEmail("");
      setRole("user");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form className="space-y-3 bg-gray-800 p-4 rounded mb-4" onSubmit={handleInvite}>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-gray-300 mb-1">Invite by Email</label>
          <input
            className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            type="email"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Role</label>
          <select
            className="px-2 py-2 rounded bg-gray-900 text-white border border-gray-700"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="ml-2 px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 transition disabled:opacity-60"
          disabled={loading}
        >
          Invite
        </button>
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {success && <div className="text-green-400 text-sm">{success}</div>}
    </form>
  );
}
