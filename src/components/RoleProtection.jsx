import React from "react";
import { useSelector } from "react-redux";
import { canPerformAction } from "../utils/roleUtils";

// Higher-order component for role-based access control
export function withRoleProtection(WrappedComponent, requiredPermission) {
  return function ProtectedComponent({ project, ...props }) {
    const user = useSelector(state => state.user.user);
    
    if (!canPerformAction(user, project, requiredPermission)) {
      return (
        <div className="bg-red-900 bg-opacity-20 border border-red-600 rounded p-4 text-red-300">
          <p className="text-sm">
            🔒 You don't have permission to access this feature.
          </p>
        </div>
      );
    }
    
    return <WrappedComponent project={project} {...props} />;
  };
}

// Component to conditionally render content based on permissions
export function RoleGuard({ 
  user, 
  project, 
  permission, 
  children, 
  fallback = null,
  showMessage = false 
}) {
  if (!canPerformAction(user, project, permission)) {
    if (showMessage) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded p-2 text-gray-400 text-sm">
          🔒 Insufficient permissions
        </div>
      );
    }
    return fallback;
  }
  
  return children;
}

// Hook for role-based access control
export function useRoleAccess(project) {
  const user = useSelector(state => state.user.user);
  
  return {
    user,
    canCreateProject: () => canPerformAction(user, project, 'create_project'),
    canInviteMembers: () => canPerformAction(user, project, 'invite_members'),
    canDeleteProject: () => canPerformAction(user, project, 'delete_project'),
    canManageBugs: () => canPerformAction(user, project, 'manage_bugs'),
    canAssignBugs: () => canPerformAction(user, project, 'assign_bugs'),
    canDeleteBugs: () => canPerformAction(user, project, 'delete_bugs'),
    canUploadFiles: () => canPerformAction(user, project, 'upload_files'),
    hasPermission: (permission) => canPerformAction(user, project, permission)
  };
}