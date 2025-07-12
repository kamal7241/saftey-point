// Dynamic Role System Types

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string; // e.g., 'users', 'courses', 'admin'
  action: string; // e.g., 'create', 'read', 'update', 'delete'
  key: string; // e.g., 'users.create', 'courses.read'
}

export interface Role {
  id: string;
  name: string;
  key: string; // Unique identifier for the role
  description: string;
  permissions: Permission[];
  isActive: boolean;
  isSystem: boolean; // Whether this is a system role that can't be deleted
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  role: Role;
  assignedAt: string;
  assignedBy: string;
}

export interface UserWithRoles {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  primaryRole?: string; // The main role key for backward compatibility
  // Add other user properties as needed
}

// Permission keys for easy reference
export const PERMISSION_KEYS = {
  // User Management
  USERS_CREATE: 'users.create',
  USERS_READ: 'users.read',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
  USERS_LIST: 'users.list',
  
  // Admin Management
  ADMINS_CREATE: 'admins.create',
  ADMINS_READ: 'admins.read',
  ADMINS_UPDATE: 'admins.update',
  ADMINS_DELETE: 'admins.delete',
  ADMINS_LIST: 'admins.list',
  
  // Role Management
  ROLES_CREATE: 'roles.create',
  ROLES_READ: 'roles.read',
  ROLES_UPDATE: 'roles.update',
  ROLES_DELETE: 'roles.delete',
  ROLES_LIST: 'roles.list',
  
  // Course Management
  COURSES_CREATE: 'courses.create',
  COURSES_READ: 'courses.read',
  COURSES_UPDATE: 'courses.update',
  COURSES_DELETE: 'courses.delete',
  COURSES_LIST: 'courses.list',
  
  // Company Management
  COMPANIES_CREATE: 'companies.create',
  COMPANIES_READ: 'companies.read',
  COMPANIES_UPDATE: 'companies.update',
  COMPANIES_DELETE: 'companies.delete',
  COMPANIES_LIST: 'companies.list',
  
  // Staff Management
  STAFF_CREATE: 'staff.create',
  STAFF_READ: 'staff.read',
  STAFF_UPDATE: 'staff.update',
  STAFF_DELETE: 'staff.delete',
  STAFF_LIST: 'staff.list',
  
  // Certificate Management
  CERTIFICATES_CREATE: 'certificates.create',
  CERTIFICATES_READ: 'certificates.read',
  CERTIFICATES_UPDATE: 'certificates.update',
  CERTIFICATES_DELETE: 'certificates.delete',
  CERTIFICATES_LIST: 'certificates.list',
  
  // Exam Management
  EXAMS_CREATE: 'exams.create',
  EXAMS_READ: 'exams.read',
  EXAMS_UPDATE: 'exams.update',
  EXAMS_DELETE: 'exams.delete',
  EXAMS_LIST: 'exams.list',
  
  // Presets Management
  PRESETS_CREATE: 'presets.create',
  PRESETS_READ: 'presets.read',
  PRESETS_UPDATE: 'presets.update',
  PRESETS_DELETE: 'presets.delete',
  PRESETS_LIST: 'presets.list',
} as const;

// System roles for backward compatibility
export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  COMPANY_ADMIN: 'company_admin',
  COMPANY_USER: 'company_user',
  INDIVIDUAL: 'individual',
  INSTRUCTOR: 'instructor',
  STUDENT: 'student',
  MODERATOR: 'moderator',
  MANAGER: 'manager',
  VIEWER: 'viewer',
} as const;

export type SystemRoleKey = typeof SYSTEM_ROLES[keyof typeof SYSTEM_ROLES];
export type PermissionKey = typeof PERMISSION_KEYS[keyof typeof PERMISSION_KEYS]; 