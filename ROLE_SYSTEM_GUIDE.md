# Dynamic Role System Guide

## Overview

The Safety Points Academy now supports a flexible, dynamic role system that allows you to create custom roles with specific permissions instead of being limited to hardcoded roles like 'admin', 'company', and 'individual'.

## Key Features

- ✅ **Custom Role Keys**: Create roles with any string key (e.g., 'instructor', 'moderator', 'content_creator')
- ✅ **Granular Permissions**: Assign specific permissions to roles (e.g., 'users.create', 'courses.update')
- ✅ **Multiple Roles**: Users can have multiple roles simultaneously
- ✅ **Backward Compatibility**: Existing role system still works
- ✅ **Permission-Based Access**: Control access based on specific permissions
- ✅ **Resource-Level Permissions**: CRUD operations per resource

## System Roles (Predefined)

```typescript
SYSTEM_ROLES = {
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
}
```

## Permission Keys

```typescript
PERMISSION_KEYS = {
  // User Management
  USERS_CREATE: 'users.create',
  USERS_READ: 'users.read',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
  USERS_LIST: 'users.list',
  
  // Course Management
  COURSES_CREATE: 'courses.create',
  COURSES_READ: 'courses.read',
  COURSES_UPDATE: 'courses.update',
  COURSES_DELETE: 'courses.delete',
  COURSES_LIST: 'courses.list',
  
  // And many more...
}
```

## Usage Examples

### 1. Route Protection with Custom Roles

```typescript
import withAuthRole from '@/components/auth/withAuthRole';
import { SYSTEM_ROLES } from '@/types/roles.types';

const InstructorPage = () => {
  return <div>Instructor Content</div>;
};

// Protect with multiple custom roles
export const ProtectedInstructorPage = withAuthRole(InstructorPage, [
  SYSTEM_ROLES.INSTRUCTOR,
  'senior_instructor',
  'course_creator',
  'content_moderator'
]);
```

### 2. Permission-Based Component Rendering

```typescript
import { useAuth } from '@/contexts/UserProvider';
import { PERMISSION_KEYS } from '@/types/roles.types';

const CourseManagement = () => {
  const { hasPermission, getResourcePermissions } = useAuth();
  const coursePermissions = getResourcePermissions('courses');

  return (
    <div>
      {coursePermissions.canCreate && (
        <button>Create New Course</button>
      )}
      
      {coursePermissions.canUpdate && (
        <button>Edit Course</button>
      )}
      
      {hasPermission('courses.publish') && (
        <button>Publish Course</button>
      )}
    </div>
  );
};
```

### 3. Role Checking in Components

```typescript
import { useAuth } from '@/contexts/UserProvider';
import { SYSTEM_ROLES } from '@/types/roles.types';

const AdminPanel = () => {
  const { hasRole, hasAnyRole, getUserRoles } = useAuth();

  return (
    <div>
      {/* Check specific role */}
      {hasRole(SYSTEM_ROLES.SUPER_ADMIN) && (
        <div>Super Admin Features</div>
      )}
      
      {/* Check multiple roles */}
      {hasAnyRole(['instructor', 'moderator', 'manager']) && (
        <div>Management Features</div>
      )}
      
      {/* Display all user roles */}
      <div>
        Your Roles: {getUserRoles().join(', ')}
      </div>
    </div>
  );
};
```

### 4. Dynamic Sidebar Based on Roles

```typescript
const DynamicSidebar = () => {
  const { getUserRoles, hasPermission } = useAuth();
  const userRoles = getUserRoles();

  const sidebarItems = [
    {
      name: 'Dashboard',
      link: '/dashboard',
      roles: ['admin', 'super_admin'],
      permissions: []
    },
    {
      name: 'Course Management',
      link: '/courses',
      roles: ['instructor', 'course_manager'],
      permissions: ['courses.read']
    },
    {
      name: 'Content Creation',
      link: '/content',
      roles: ['content_creator'],
      permissions: ['content.create']
    }
  ];

  const visibleItems = sidebarItems.filter(item => {
    const hasRequiredRole = item.roles.some(role => userRoles.includes(role));
    const hasRequiredPermission = item.permissions.length === 0 || 
      item.permissions.some(permission => hasPermission(permission));
    
    return hasRequiredRole && hasRequiredPermission;
  });

  return (
    <nav>
      {visibleItems.map(item => (
        <a key={item.link} href={item.link}>{item.name}</a>
      ))}
    </nav>
  );
};
```

### 5. Custom Role with Specific Permissions

```typescript
const CustomRoleExample = () => {
  const { hasPermission, hasAnyRole } = useAuth();

  return (
    <div>
      {hasAnyRole(['content_creator', 'course_moderator']) && (
        <div>
          <h3>Content Management</h3>
          
          {hasPermission('content.create') && (
            <button>Create Content</button>
          )}
          
          {hasPermission('content.moderate') && (
            <button>Moderate Content</button>
          )}
          
          {hasPermission('content.approve') && (
            <button>Approve Content</button>
          )}
        </div>
      )}
    </div>
  );
};
```

## Available Functions

### From useAuth() Hook

```typescript
const {
  hasPermission,        // Check specific permission
  hasRole,             // Check specific role
  hasAnyRole,          // Check if user has any of multiple roles
  getUserRoles,         // Get all user roles
  getUserPermissions,   // Get all user permissions
  getPrimaryRole,       // Get primary role (for backward compatibility)
  getResourcePermissions // Get CRUD permissions for a resource
} = useAuth();
```

### From roleUtils

```typescript
import { 
  hasPermission,
  hasRole,
  hasAnyRole,
  hasAllPermissions,
  getUserRoles,
  getUserPermissions,
  getPrimaryRole,
  canAccess,
  getResourcePermissions,
  convertLegacyRole,
  isSystemRole
} from '@/utils/roleUtils';
```

## Creating Custom Roles

### 1. Define Role Structure

```typescript
const customRole = {
  id: 'custom_instructor',
  name: 'Custom Instructor',
  key: 'custom_instructor',
  description: 'Instructor with custom permissions',
  permissions: [
    { key: 'courses.create', name: 'Create Courses' },
    { key: 'courses.update', name: 'Update Courses' },
    { key: 'content.moderate', name: 'Moderate Content' }
  ],
  isActive: true,
  isSystem: false
};
```

### 2. Use in Components

```typescript
const { hasRole } = useAuth();

if (hasRole('custom_instructor')) {
  // Show custom instructor features
}
```

## Migration from Old System

The new system is backward compatible. Existing code using the old role system will continue to work:

```typescript
// Old way (still works)
withAuthRole(Component, ['admin', 'company']);

// New way (more flexible)
withAuthRole(Component, ['admin', 'instructor', 'custom_role']);
```

## Best Practices

1. **Use Permission Keys**: Instead of checking roles, check specific permissions
2. **Create Custom Roles**: Define roles that match your business logic
3. **Use Resource Permissions**: Use `getResourcePermissions()` for CRUD operations
4. **Combine Roles and Permissions**: Use both for maximum flexibility
5. **Document Your Roles**: Keep a clear list of custom roles and their purposes

## Example Custom Roles

```typescript
// Content Management
'content_creator'     // Can create content
'content_moderator'   // Can moderate content
'content_approver'    // Can approve content

// Course Management
'instructor'          // Can create/edit courses
'senior_instructor'   // Can approve courses
'course_manager'      // Can manage all courses

// User Management
'user_manager'        // Can manage users
'role_manager'        // Can manage roles
'permission_manager'  // Can manage permissions

// Analytics
'analyst'             // Can view analytics
'data_scientist'      // Can access advanced analytics
'report_generator'    // Can generate reports
```

This system provides maximum flexibility while maintaining security and ease of use! 