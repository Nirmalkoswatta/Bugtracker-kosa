import React, { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import { useTheme } from "../contexts/ThemeContext";
import { RoleGuard, useRoleAccess } from "./RoleProtection";
import { PERMISSIONS } from "../utils/roleUtils";

const COLUMNS = [
  { id: 'open', title: 'Open', color: 'bg-red-700' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-700' },
  { id: 'closed', title: 'Closed', color: 'bg-green-700' }
];

function BugCard({ bug, onStatusChange, canAssign, projectMembers }) {
  const { colors } = useTheme();
  const [isDragging, setIsDragging] = useState(false);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(bug));
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        ${colors.secondary} ${colors.text} p-3 rounded-lg border-l-4 ${getSeverityColor(bug.severity)}
        shadow-sm hover:shadow-md transition-all duration-200 cursor-move
        ${isDragging ? 'opacity-50 transform rotate-2' : ''}
      `}
    >
      <div className="font-semibold text-sm mb-2 line-clamp-2">{bug.title}</div>
      <div className={`${colors.textMuted} text-xs mb-2 line-clamp-3`}>{bug.description}</div>
      
      <div className="flex flex-wrap gap-1 mb-2">
        <span className={`px-2 py-1 rounded text-xs ${colors.accent} ${colors.textSecondary}`}>
          {bug.severity}
        </span>
        {bug.assignee && (
          <span className={`px-2 py-1 rounded text-xs ${colors.info} text-white`}>
            {bug.assignee.split('@')[0]}
          </span>
        )}
      </div>
      
      <div className="flex justify-between items-center text-xs">
        <span className={colors.textMuted}>
          {new Date(bug.createdAt).toLocaleDateString()}
        </span>
        <span className={colors.textMuted}>
          {bug.createdBy.split('@')[0]}
        </span>
      </div>
    </div>
  );
}

function KanbanColumn({ column, bugs, onStatusChange, canAssign, projectMembers }) {
  const { colors } = useTheme();
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    
    try {
      const bugData = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (bugData.status !== column.id) {
        onStatusChange(bugData, column.id);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  return (
    <div 
      className={`
        ${colors.secondary} rounded-lg p-4 min-h-96 flex-1 min-w-72
        ${isOver ? 'ring-2 ring-blue-500 bg-opacity-50' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center mb-4">
        <div className={`w-3 h-3 rounded-full ${column.color} mr-2`}></div>
        <h3 className={`font-semibold ${colors.text}`}>{column.title}</h3>
        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${colors.accent} ${colors.textMuted}`}>
          {bugs.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {bugs.map(bug => (
          <BugCard
            key={bug.id}
            bug={bug}
            onStatusChange={onStatusChange}
            canAssign={canAssign}
            projectMembers={projectMembers}
          />
        ))}
        
        {bugs.length === 0 && (
          <div className={`${colors.textMuted} text-center py-8 text-sm`}>
            No bugs in this column
          </div>
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard({ projectId, project }) {
  const [bugs, setBugs] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const user = useSelector(state => state.user.user);
  const { colors } = useTheme();
  const { canAssignBugs } = useRoleAccess(project);

  useEffect(() => {
    const bugsRef = ref(db, `projects/${projectId}/bugs`);
    const unsubscribe = onValue(bugsRef, (snapshot) => {
      const data = snapshot.val();
      const bugList = data ? Object.values(data) : [];
      setBugs(bugList);
    });
    return () => unsubscribe();
  }, [projectId]);

  useEffect(() => {
    const projectRef = ref(db, `projects/${projectId}`);
    const unsubscribe = onValue(projectRef, (snapshot) => {
      const projectData = snapshot.val();
      if (projectData && projectData.members) {
        const members = Object.keys(projectData.members);
        setProjectMembers(members);
      }
    });
    return () => unsubscribe();
  }, [projectId]);

  const handleStatusChange = (bug, newStatus) => {
    const bugRef = ref(db, `projects/${projectId}/bugs/${bug.id}`);
    update(bugRef, { 
      status: newStatus, 
      updatedBy: user?.email || "",
      updatedAt: Date.now()
    });
  };

  const getBugsByStatus = (status) => {
    return bugs.filter(bug => bug.status === status);
  };

  return (
    <div className={`${colors.primary} p-4 rounded-lg`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${colors.text}`}>Kanban Board</h2>
        <div className={`${colors.textMuted} text-sm`}>
          Total: {bugs.length} bugs
        </div>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            bugs={getBugsByStatus(column.id)}
            onStatusChange={handleStatusChange}
            canAssign={canAssignBugs()}
            projectMembers={projectMembers}
          />
        ))}
      </div>
      
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}