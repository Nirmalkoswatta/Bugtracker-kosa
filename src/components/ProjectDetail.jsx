import React, { useState, useEffect } from "react";
import InviteMemberForm from "./InviteMemberForm";
import { useSelector } from "react-redux";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import AddBugForm from "./AddBugForm";
import BugList from "./BugList";
import KanbanBoard from "./KanbanBoard";
import BugReports from "./BugReports";
import { RoleGuard, useRoleAccess } from "./RoleProtection";
import { PERMISSIONS } from "../utils/roleUtils";
import { useTheme } from "../contexts/ThemeContext";

export default function ProjectDetail({ project, onBack }) {
  const [members, setMembers] = useState([]);
  const [details, setDetails] = useState(project);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'kanban', or 'reports'
  const user = useSelector(state => state.user.user);
  const { canInviteMembers, canManageBugs } = useRoleAccess(details);
  const { colors } = useTheme();

  useEffect(() => {
    const projectRef = ref(db, `projects/${project.id}`);
    const unsubscribe = onValue(projectRef, (snapshot) => {
      setDetails(snapshot.val());
      setMembers(snapshot.val()?.members ? Object.entries(snapshot.val().members) : []);
    });
    return () => unsubscribe();
  }, [project.id]);

  return (
    <div className={`${colors.secondary} rounded-xl p-4 md:p-6 shadow-lg mt-6`}>
      <button className="mb-4 text-blue-400 hover:underline" onClick={onBack}>&larr; Back to Projects</button>
      <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${colors.text}`}>{details.name}</h2>
      <div className={`${colors.textMuted} mb-4`}>{details.description}</div>
      
      <RoleGuard 
        user={user} 
        project={details} 
        permission={PERMISSIONS.INVITE_MEMBERS}
        showMessage={true}
      >
        <InviteMemberForm projectId={project.id} />
      </RoleGuard>
      
      <RoleGuard 
        user={user} 
        project={details} 
        permission={PERMISSIONS.MANAGE_BUGS}
        showMessage={true}
      >
        <AddBugForm projectId={project.id} />
      </RoleGuard>
      
      {/* View Mode Toggle */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setViewMode('list')}
          className={`px-3 md:px-4 py-2 rounded-lg transition text-sm md:text-base ${
            viewMode === 'list' 
              ? 'bg-blue-600 text-white' 
              : `${colors.accent} ${colors.textSecondary} hover:bg-blue-700 hover:text-white`
          }`}
        >
          📋 List View
        </button>
        <button
          onClick={() => setViewMode('kanban')}
          className={`px-3 md:px-4 py-2 rounded-lg transition text-sm md:text-base ${
            viewMode === 'kanban' 
              ? 'bg-blue-600 text-white' 
              : `${colors.accent} ${colors.textSecondary} hover:bg-blue-700 hover:text-white`
          }`}
        >
          📊 Kanban Board
        </button>
        <button
          onClick={() => setViewMode('reports')}
          className={`px-3 md:px-4 py-2 rounded-lg transition text-sm md:text-base ${
            viewMode === 'reports' 
              ? 'bg-blue-600 text-white' 
              : `${colors.accent} ${colors.textSecondary} hover:bg-blue-700 hover:text-white`
          }`}
        >
          📈 Reports
        </button>
      </div>

      {/* Bug Views */}
      {viewMode === 'list' && <BugList projectId={project.id} project={details} />}
      {viewMode === 'kanban' && <KanbanBoard projectId={project.id} project={details} />}
      {viewMode === 'reports' && <BugReports projectId={project.id} project={details} />}
      <h3 className="text-xl font-semibold mt-6 mb-2">Team Members</h3>
      <ul className="divide-y divide-gray-800">
        {members.map(([email, role]) => (
          <li key={email} className="py-2 flex justify-between items-center">
            <span>{email}</span>
            <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700">{role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
