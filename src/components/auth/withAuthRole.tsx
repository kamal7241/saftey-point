"use client";
import { useAuth } from '@/contexts/UserProvider';
import { useRouter } from '@/i18n/routing';
import React, { ComponentType, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface WithAuthRoleProps {
  // You can add any additional props that your wrapped component might need
}

interface UserWithRole {
  role?: string;
}

const withAuthRole = <P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: Array<string> // Now accepts any string role keys
) => {
  const ComponentWithAuth = (props: P & WithAuthRoleProps) => {
    const { user, isLoading, accessToken } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoading) {
        return; // Wait for user data to load
      }

      if (!accessToken || !user) {
        // If not authenticated, redirect to login
        router.replace('/authentication/login');
        return;
      }

      // Check if the user has any of the allowed roles
      const isUserWithRoles = 'roles' in user;
      const userRoles = isUserWithRoles ? user.roles.map(ur => ur.role.key) : [];
      const primaryRole = isUserWithRoles ? user.primaryRole : (user as UserWithRole).role;
      
      const hasAllowedRole = userRoles.some(role => allowedRoles.includes(role)) || 
                            (primaryRole && allowedRoles.includes(primaryRole));
      
      if (!hasAllowedRole) {
        // If role is not allowed, redirect to a 'not authorized' page or dashboard
        console.warn(`User with roles '${userRoles.join(', ')}' tried to access a route restricted to roles: ${allowedRoles.join(', ')}`);
        router.replace('/dashboard'); // Or an '/unauthorized' page
      }
    }, [user, isLoading, accessToken, router]);

    // If loading, or if user is null (before redirect happens), or role not yet verified,
    // you might want to show a loading spinner or null
    const isUserWithRoles = user && 'roles' in user;
    const userRoles = isUserWithRoles ? user.roles.map(ur => ur.role.key) : [];
    const primaryRole = isUserWithRoles ? user.primaryRole : (user as UserWithRole)?.role;
    
    const hasAllowedRole = userRoles.some(role => allowedRoles.includes(role)) || 
                          (primaryRole && allowedRoles.includes(primaryRole));
    
    if (isLoading || !user || !accessToken || (user && !hasAllowedRole)) {
      // Render a loading state or null while checking auth/role and redirecting
      // This prevents a flash of the protected content
      return null; // Or <LoadingSpinner />
    }

    // If authenticated and role is allowed, render the wrapped component
    return <WrappedComponent {...props as P} />;
  };

  // Set a display name for easier debugging
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  ComponentWithAuth.displayName = `withAuthRole(${displayName})`;

  return ComponentWithAuth;
};

export default withAuthRole;