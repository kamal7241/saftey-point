import React from 'react';
import { useAuth } from '@/contexts/UserProvider';
import withAuthRole from '@/components/auth/withAuthRole';
import { SYSTEM_ROLES, PERMISSION_KEYS } from '@/types/roles.types';

// Example 1: Using custom role keys instead of hardcoded roles
const AdminDashboard = () => {
  const { hasPermission, hasRole, getUserRoles } = useAuth();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      {/* Check specific permissions */}
      {hasPermission(PERMISSION_KEYS.USERS_CREATE) && (
        <button>Create New User</button>
      )}
      
      {hasPermission(PERMISSION_KEYS.COURSES_UPDATE) && (
        <button>Edit Course</button>
      )}
      
      {/* Check roles */}
      {hasRole(SYSTEM_ROLES.SUPER_ADMIN) && (
        <div>Super Admin Features</div>
      )}
      
      {hasRole('custom_instructor_role') && (
        <div>Instructor Features</div>
      )}
      
      {/* Display user roles */}
      <div>
        <h3>Your Roles:</h3>
        <ul>
          {getUserRoles().map(role => (
            <li key={role}>{role}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Example 2: Route protection with custom roles
const InstructorPage = () => {
  return <div>Instructor Page Content</div>;
};

// Protect with custom role keys
export const ProtectedInstructorPage = withAuthRole(InstructorPage, [
  SYSTEM_ROLES.INSTRUCTOR,
  'custom_instructor_role',
  'senior_instructor'
]);

// Example 3: Component with permission-based rendering
const CourseManagement = () => {
  const { hasPermission, getResourcePermissions } = useAuth();
  const coursePermissions = getResourcePermissions('courses');

  return (
    <div>
      <h1>Course Management</h1>
      
      {coursePermissions.canCreate && (
        <button>Create New Course</button>
      )}
      
      {coursePermissions.canRead && (
        <div>Course List</div>
      )}
      
      {coursePermissions.canUpdate && (
        <button>Edit Course</button>
      )}
      
      {coursePermissions.canDelete && (
        <button>Delete Course</button>
      )}
      
      {/* Check specific permissions */}
      {hasPermission('courses.publish') && (
        <button>Publish Course</button>
      )}
      
      {hasPermission('courses.approve') && (
        <button>Approve Course</button>
      )}
    </div>
  );
};

// Example 4: Custom role with specific permissions
const CustomRoleExample = () => {
  const { hasPermission, hasAnyRole } = useAuth();

  return (
    <div>
      <h1>Custom Role Example</h1>
      
      {/* Check if user has any of these custom roles */}
      {hasAnyRole(['content_creator', 'course_moderator', 'quality_assurance']) && (
        <div>
          <h3>Content Management Features</h3>
          
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

// Example 5: Dynamic sidebar based on roles
const DynamicSidebar = () => {
  const { getUserRoles, hasPermission } = useAuth();
  const userRoles = getUserRoles();

  const sidebarItems = [
    {
      name: 'Dashboard',
      link: '/dashboard',
      roles: [SYSTEM_ROLES.ADMIN, SYSTEM_ROLES.SUPER_ADMIN],
      permissions: []
    },
    {
      name: 'User Management',
      link: '/users',
      roles: [SYSTEM_ROLES.ADMIN],
      permissions: [PERMISSION_KEYS.USERS_READ]
    },
    {
      name: 'Course Management',
      link: '/courses',
      roles: ['instructor', 'course_manager'],
      permissions: [PERMISSION_KEYS.COURSES_READ]
    },
    {
      name: 'Content Creation',
      link: '/content',
      roles: ['content_creator'],
      permissions: ['content.create']
    },
    {
      name: 'Analytics',
      link: '/analytics',
      roles: ['analyst', 'manager'],
      permissions: ['analytics.view']
    }
  ];

  const visibleItems = sidebarItems.filter(item => {
    // Check if user has any of the required roles
    const hasRequiredRole = item.roles.some(role => userRoles.includes(role));
    
    // Check if user has any of the required permissions
    const hasRequiredPermission = item.permissions.length === 0 || 
      item.permissions.some(permission => hasPermission(permission));
    
    return hasRequiredRole && hasRequiredPermission;
  });

  return (
    <nav>
      {visibleItems.map(item => (
        <a key={item.link} href={item.link}>
          {item.name}
        </a>
      ))}
    </nav>
  );
};

export { CourseManagement, CustomRoleExample, DynamicSidebar };
export default AdminDashboard; 