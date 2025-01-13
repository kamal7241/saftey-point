export const redirects = async () => {
    return [
      {
        source: '/dashboard/admin-management',
        destination: '/dashboard/admin-management/manage-admins',
        permanent: true,
      },
      {
        source: '/dashboard/user-management',
        destination: '/dashboard/user-management/users',
        permanent: true,
      },
    ];
  };