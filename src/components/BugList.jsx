import React, { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import BugAttachmentUpload from "./BugAttachmentUpload";
import { getBugAttachments } from "./bugAttachmentDb";
import { RoleGuard, useRoleAccess } from "./RoleProtection";
import { PERMISSIONS } from "../utils/roleUtils";

const statusColors = {
  open: "bg-red-700",
  "in-progress": "bg-yellow-700",
  closed: "bg-green-700",
};

export default function BugList({ projectId, project }) {
  const [bugs, setBugs] = useState([]);
  const [attachments, setAttachments] = useState({});
  const [projectMembers, setProjectMembers] = useState([]);
  const [filter, setFilter] = useState({ severity: "", status: "", assignee: "", search: "", sort: "createdAt-desc" });
  const user = useSelector(state => state.user.user);
  const { canAssignBugs, canUploadFiles } = useRoleAccess(project);

  useEffect(() => {
    const bugsRef = ref(db, `projects/${projectId}/bugs`);
    const unsubscribe = onValue(bugsRef, async (snapshot) => {
      const data = snapshot.val();
      const bugList = data ? Object.values(data) : [];
      setBugs(bugList);
      // Fetch attachments for each bug
      const attMap = {};
      for (const bug of bugList) {
        attMap[bug.id] = await getBugAttachments(projectId, bug.id);
      }
      setAttachments(attMap);
    });
    return () => unsubscribe();
  }, [projectId]);

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

  // Filtering, sorting, and search
  let filtered = bugs.filter(bug => {
    if (filter.severity && bug.severity !== filter.severity) return false;
    if (filter.status && bug.status !== filter.status) return false;
    if (filter.assignee && (bug.assignee || "Unassigned") !== filter.assignee) return false;
    if (filter.search && !bug.title.toLowerCase().includes(filter.search.toLowerCase()) && !bug.description.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });
  if (filter.sort === "createdAt-desc") filtered = filtered.sort((a, b) => b.createdAt - a.createdAt);
  if (filter.sort === "createdAt-asc") filtered = filtered.sort((a, b) => a.createdAt - b.createdAt);
  if (filter.sort === "severity") filtered = filtered.sort((a, b) => (a.severity > b.severity ? 1 : -1));

  const handleStatusChange = (bug, status) => {
    const bugRef = ref(db, `projects/${projectId}/bugs/${bug.id}`);
    update(bugRef, { 
      status, 
      updatedBy: user?.email || "",
      updatedAt: Date.now()
    });
  };

  const handleAssigneeChange = (bug, assignee) => {
    const bugRef = ref(db, `projects/${projectId}/bugs/${bug.id}`);
    update(bugRef, { 
      assignee: assignee || "",
      updatedBy: user?.email || "",
      updatedAt: Date.now()
    });
  };

  // Unique assignees for filter dropdown
  const assignees = Array.from(new Set(bugs.map(b => b.assignee || "Unassigned")));

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 mt-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg mr-3 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h4 className="text-2xl font-bold text-white">Bug Reports</h4>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {/* Search */}
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="🔍 Search bugs..."
            className="w-full px-4 py-2 rounded-xl backdrop-blur-sm bg-white/5 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
            value={filter.search}
            onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
          />
        </div>

        {/* Severity Filter */}
        <select
          className="px-3 py-2 rounded-xl backdrop-blur-sm bg-white/5 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 cursor-pointer"
          value={filter.severity}
          onChange={e => setFilter(f => ({ ...f, severity: e.target.value }))}
        >
          <option value="" className="bg-gray-800">All Severities</option>
          <option value="low" className="bg-gray-800">🟢 Low</option>
          <option value="medium" className="bg-gray-800">🟡 Medium</option>
          <option value="high" className="bg-gray-800">🔴 High</option>
        </select>

        {/* Status Filter */}
        <select
          className="px-3 py-2 rounded-xl backdrop-blur-sm bg-white/5 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 cursor-pointer"
          value={filter.status}
          onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
        >
          <option value="" className="bg-gray-800">All Statuses</option>
          <option value="open" className="bg-gray-800">🔓 Open</option>
          <option value="in-progress" className="bg-gray-800">⚡ In Progress</option>
          <option value="closed" className="bg-gray-800">✅ Closed</option>
        </select>

        {/* Assignee Filter */}
        <select
          className="px-3 py-2 rounded-xl backdrop-blur-sm bg-white/5 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 cursor-pointer"
          value={filter.assignee}
          onChange={e => setFilter(f => ({ ...f, assignee: e.target.value }))}
        >
          <option value="" className="bg-gray-800">All Assignees</option>
          {assignees.map(a => (
            <option key={a} value={a} className="bg-gray-800">👤 {a}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          className="px-3 py-2 rounded-xl backdrop-blur-sm bg-white/5 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 cursor-pointer"
          value={filter.sort}
          onChange={e => setFilter(f => ({ ...f, sort: e.target.value }))}
        >
          <option value="createdAt-desc" className="bg-gray-800">📅 Newest</option>
          <option value="createdAt-asc" className="bg-gray-800">📅 Oldest</option>
          <option value="severity" className="bg-gray-800">⚠️ Severity</option>
        </select>
      </div>
      {/* Bug List Content */}
      {bugs.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Bugs Yet!</h3>
          <p className="text-white/70">This project is bug-free so far. Great work!</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Matching Bugs</h3>
          <p className="text-white/70">Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((bug, index) => (
            <div
              key={bug.id}
              className="group backdrop-blur-sm bg-white/5 border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Bug Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {bug.title}
                  </h3>
                  <p className="text-white/80 mb-3 line-clamp-2">{bug.description}</p>
                </div>
                
                {/* Status Badge */}
                <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white ml-4 ${
                  bug.status === 'open' ? 'bg-red-500/80' :
                  bug.status === 'in-progress' ? 'bg-yellow-500/80' :
                  'bg-green-500/80'
                }`}>
                  {bug.status === 'open' ? '🔓 Open' :
                   bug.status === 'in-progress' ? '⚡ In Progress' :
                   '✅ Closed'}
                </div>
              </div>

              {/* Bug Metadata */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                  bug.severity === 'high' ? 'bg-red-500/20 border border-red-400/30' :
                  bug.severity === 'medium' ? 'bg-yellow-500/20 border border-yellow-400/30' :
                  'bg-green-500/20 border border-green-400/30'
                }`}>
                  {bug.severity === 'high' ? '🔴 High' :
                   bug.severity === 'medium' ? '🟡 Medium' :
                   '🟢 Low'}
                </span>
                
                <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 border border-blue-400/30 text-white">
                  👤 {bug.createdBy}
                </span>
                
                <span className="px-3 py-1 rounded-full text-xs bg-purple-500/20 border border-purple-400/30 text-white">
                  📅 {new Date(bug.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* Status Control */}
                <div className="flex items-center gap-2">
                  <label className="text-white/90 font-medium text-sm">Status:</label>
                  <select
                    className="px-3 py-1 rounded-lg backdrop-blur-sm bg-white/5 border border-white/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 cursor-pointer"
                    value={bug.status}
                    onChange={e => handleStatusChange(bug, e.target.value)}
                  >
                    <option value="open" className="bg-gray-800">🔓 Open</option>
                    <option value="in-progress" className="bg-gray-800">⚡ In Progress</option>
                    <option value="closed" className="bg-gray-800">✅ Closed</option>
                  </select>
                </div>
                
                {/* Assignment Control */}
                <RoleGuard 
                  user={user} 
                  project={project} 
                  permission={PERMISSIONS.ASSIGN_BUGS}
                  fallback={
                    <span className="text-white/70 text-sm">
                      Assigned to: <span className="text-white font-medium">{bug.assignee || "Unassigned"}</span>
                    </span>
                  }
                >
                  <div className="flex items-center gap-2">
                    <label className="text-white/90 font-medium text-sm">Assign to:</label>
                    <select
                      className="px-3 py-1 rounded-lg backdrop-blur-sm bg-white/5 border border-white/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 cursor-pointer"
                      value={bug.assignee || ""}
                      onChange={e => handleAssigneeChange(bug, e.target.value)}
                    >
                      <option value="" className="bg-gray-800">👤 Unassigned</option>
                      {projectMembers.map(member => (
                        <option key={member} value={member} className="bg-gray-800">👤 {member}</option>
                      ))}
                    </select>
                  </div>
                </RoleGuard>
              </div>

              {/* File Upload */}
              <RoleGuard 
                user={user} 
                project={project} 
                permission={PERMISSIONS.UPLOAD_FILES}
              >
                <div className="mt-4">
                  <BugAttachmentUpload projectId={projectId} bugId={bug.id} />
                </div>
              </RoleGuard>

              {/* Attachments */}
              {attachments[bug.id] && attachments[bug.id].length > 0 && (
                <div className="mt-4">
                  <h4 className="text-white/90 font-medium mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                    </svg>
                    Attachments
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {attachments[bug.id].map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-lg backdrop-blur-sm bg-white/5 border border-white/20 text-blue-300 hover:text-blue-200 hover:bg-white/10 transition-all duration-300 text-sm flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                        </svg>
                        Attachment {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* CSS Animations */}
          <style jsx>{`
            @keyframes fade-in {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes fade-in-up {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .animate-fade-in {
              animation: fade-in 0.6s ease-out;
            }
            
            .animate-fade-in-up {
              animation: fade-in-up 0.6s ease-out;
              animation-fill-mode: both;
            }
            
            .line-clamp-2 {
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
