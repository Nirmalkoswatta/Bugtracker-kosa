// Utility functions for role-based access control


export const ROLES = {
  ADMIN: 'admin',
  QA: 'qa',
  DEVELOPER: 'developer',
  PROJECT_MANAGER: 'pm',
  USER: 'user'
};


export const PERMISSIONS = {
  CREATE_PROJECT: 'create_project',
  INVITE_MEMBERS: 'invite_members',
  DELETE_PROJECT: 'delete_project',
  MANAGE_BUGS: 'manage_bugs',
  ASSIGN_BUGS: 'assign_bugs',
  DELETE_BUGS: 'delete_bugs',
  UPLOAD_FILES: 'upload_files',
  CREATE_BUG: 'create_bug',
  UPLOAD_BUG_ATTACHMENT: 'upload_bug_attachment',
  VIEW_ASSIGNMENTS: 'view_assignments',
  VIEW_ATTACHMENTS: 'view_attachments',
  UPDATE_STATUS: 'update_status',
  MARK_COMPLETE: 'mark_complete',
  REASSIGN_BUG: 'reassign_bug',
  MANAGE_ROLES: 'manage_roles',
};


// Define role permissions
const rolePermissions = {
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.INVITE_MEMBERS,
    PERMISSIONS.DELETE_PROJECT,
    PERMISSIONS.MANAGE_BUGS,
    PERMISSIONS.ASSIGN_BUGS,
    PERMISSIONS.DELETE_BUGS,
    PERMISSIONS.UPLOAD_FILES,
    PERMISSIONS.CREATE_BUG,
    PERMISSIONS.UPLOAD_BUG_ATTACHMENT,
    PERMISSIONS.VIEW_ASSIGNMENTS,
    PERMISSIONS.VIEW_ATTACHMENTS,
    PERMISSIONS.UPDATE_STATUS,
    PERMISSIONS.MARK_COMPLETE,
    PERMISSIONS.REASSIGN_BUG,
    PERMISSIONS.MANAGE_ROLES
  ],
  [ROLES.QA]: [
    PERMISSIONS.CREATE_BUG,
    PERMISSIONS.UPLOAD_BUG_ATTACHMENT,
    PERMISSIONS.ASSIGN_BUGS,
    PERMISSIONS.MARK_COMPLETE,
    PERMISSIONS.REASSIGN_BUG,
    PERMISSIONS.VIEW_ASSIGNMENTS,
    PERMISSIONS.VIEW_ATTACHMENTS
  ],
  [ROLES.DEVELOPER]: [
    PERMISSIONS.UPDATE_STATUS,
    PERMISSIONS.VIEW_ASSIGNMENTS,
    PERMISSIONS.VIEW_ATTACHMENTS
  ],
  [ROLES.PROJECT_MANAGER]: [
    PERMISSIONS.VIEW_ASSIGNMENTS
  ],
  [ROLES.USER]: []
};

// Check if user has permission
export function hasPermission(userRole, permission) {
  if (!userRole || !permission) return false;
  return rolePermissions[userRole]?.includes(permission) || false;
}

// Check if user is admin of a project
export function isProjectAdmin(user, project) {
  if (!user || !project || !project.members) return false;
  return project.members[user.email] === ROLES.ADMIN;
}

// Check if user is member of a project
export function isProjectMember(user, project) {
  if (!user || !project || !project.members) return false;
  return user.email in project.members;
}

// Get user role in project
export function getUserRole(user, project) {
  if (!user || !project || !project.members) return null;
  return project.members[user.email] || null;
}

// Check if user can perform action on project
export function canPerformAction(user, project, permission) {
  const userRole = getUserRole(user, project);
  return hasPermission(userRole, permission);
}