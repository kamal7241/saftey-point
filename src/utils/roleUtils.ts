import { UserWithRoles, SYSTEM_ROLES } from '@/types/roles.types';

/**
 * Check if a user has a specific permission
 * @param user - The user object with roles
 * @param permissionKey - The permission key to check
 * @returns boolean indicating if user has the permission
 */
export const hasPermission = (user: UserWithRoles | null, permissionKey: string): boolean => {
  if (!user || !user.roles) return false;
  
  return user.roles.some(userRole => 
    userRole.role.permissions.some(permission => 
      permission.key === permissionKey
    )
  );
};

/**
 * Check if a user has any of the specified permissions
 * @param user - The user object with roles
 * @param permissionKeys - Array of permission keys to check
 * @returns boolean indicating if user has any of the permissions
 */
export const hasAnyPermission = (user: UserWithRoles | null, permissionKeys: string[]): boolean => {
  if (!user || !user.roles) return false;
  
  return user.roles.some(userRole => 
    userRole.role.permissions.some(permission => 
      permissionKeys.includes(permission.key)
    )
  );
};

/**
 * Check if a user has all of the specified permissions
 * @param user - The user object with roles
 * @param permissionKeys - Array of permission keys to check
 * @returns boolean indicating if user has all permissions
 */
export const hasAllPermissions = (user: UserWithRoles | null, permissionKeys: string[]): boolean => {
  if (!user || !user.roles) return false;
  
  const userPermissions = new Set<string>();
  user.roles.forEach(userRole => {
    userRole.role.permissions.forEach(permission => {
      userPermissions.add(permission.key);
    });
  });
  
  return permissionKeys.every(key => userPermissions.has(key));
};

/**
 * Check if a user has a specific role
 * @param user - The user object with roles
 * @param roleKey - The role key to check
 * @returns boolean indicating if user has the role
 */
export const hasRole = (user: UserWithRoles | null, roleKey: string): boolean => {
  if (!user || !user.roles) return false;
  
  return user.roles.some(userRole => userRole.role.key === roleKey);
};

/**
 * Check if a user has any of the specified roles
 * @param user - The user object with roles
 * @param roleKeys - Array of role keys to check
 * @returns boolean indicating if user has any of the roles
 */
export const hasAnyRole = (user: UserWithRoles | null, roleKeys: string[]): boolean => {
  if (!user || !user.roles) return false;
  
  return user.roles.some(userRole => roleKeys.includes(userRole.role.key));
};

/**
 * Get all permissions for a user
 * @param user - The user object with roles
 * @returns Array of permission keys
 */
export const getUserPermissions = (user: UserWithRoles | null): string[] => {
  if (!user || !user.roles) return [];
  
  const permissions = new Set<string>();
  user.roles.forEach(userRole => {
    userRole.role.permissions.forEach(permission => {
      permissions.add(permission.key);
    });
  });
  
  return Array.from(permissions);
};

/**
 * Get all roles for a user
 * @param user - The user object with roles
 * @returns Array of role keys
 */
export const getUserRoles = (user: UserWithRoles | null): string[] => {
  if (!user || !user.roles) return [];
  
  return user.roles.map(userRole => userRole.role.key);
};

/**
 * Get the primary role for a user (for backward compatibility)
 * @param user - The user object with roles
 * @returns The primary role key or null
 */
export const getPrimaryRole = (user: UserWithRoles | null): string | null => {
  if (!user || !user.roles || user.roles.length === 0) return null;
  
  // Return the first role or the explicitly set primary role
  return user.primaryRole || user.roles[0].role.key;
};

/**
 * Check if a user can access a specific resource and action
 * @param user - The user object with roles
 * @param resource - The resource to check (e.g., 'users', 'courses')
 * @param action - The action to check (e.g., 'create', 'read', 'update', 'delete')
 * @returns boolean indicating if user can perform the action on the resource
 */
export const canAccess = (user: UserWithRoles | null, resource: string, action: string): boolean => {
  const permissionKey = `${resource}.${action}`;
  return hasPermission(user, permissionKey);
};

/**
 * Check if a user can perform CRUD operations on a resource
 * @param user - The user object with roles
 * @param resource - The resource to check
 * @returns Object with boolean flags for each CRUD operation
 */
export const getResourcePermissions = (user: UserWithRoles | null, resource: string) => {
  return {
    canCreate: canAccess(user, resource, 'create'),
    canRead: canAccess(user, resource, 'read'),
    canUpdate: canAccess(user, resource, 'update'),
    canDelete: canAccess(user, resource, 'delete'),
    canList: canAccess(user, resource, 'list'),
  };
};

/**
 * Convert legacy role string to new role system
 * @param legacyRole - The legacy role string
 * @returns Array of role keys that correspond to the legacy role
 */
export const convertLegacyRole = (legacyRole: string): string[] => {
  const roleMapping: Record<string, string[]> = {
    'admin': [SYSTEM_ROLES.ADMIN],
    'company': [SYSTEM_ROLES.COMPANY_ADMIN],
    'individual': [SYSTEM_ROLES.INDIVIDUAL],
    'super_admin': [SYSTEM_ROLES.SUPER_ADMIN],
    'instructor': [SYSTEM_ROLES.INSTRUCTOR],
    'student': [SYSTEM_ROLES.STUDENT],
    'moderator': [SYSTEM_ROLES.MODERATOR],
    'manager': [SYSTEM_ROLES.MANAGER],
    'viewer': [SYSTEM_ROLES.VIEWER],
  };
  
  return roleMapping[legacyRole] || [legacyRole];
};

/**
 * Check if a role is a system role
 * @param roleKey - The role key to check
 * @returns boolean indicating if it's a system role
 */
export const isSystemRole = (roleKey: string): boolean => {
  return Object.values(SYSTEM_ROLES).includes(roleKey as any);
}; 