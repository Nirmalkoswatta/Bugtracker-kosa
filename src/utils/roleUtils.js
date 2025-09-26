// Utility functions for role-based access control

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

export const PERMISSIONS = {
  CREATE_PROJECT: 'create_project',
  INVITE_MEMBERS: 'invite_members',
  DELETE_PROJECT: 'delete_project',
  MANAGE_BUGS: 'manage_bugs',
  ASSIGN_BUGS: 'assign_bugs',
  DELETE_BUGS: 'delete_bugs',
  UPLOAD_FILES: 'upload_files'
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
    PERMISSIONS.UPLOAD_FILES
  ],
  [ROLES.USER]: [
    PERMISSIONS.MANAGE_BUGS,
    PERMISSIONS.UPLOAD_FILES
  ]
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