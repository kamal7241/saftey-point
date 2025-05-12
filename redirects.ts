export const redirects = async () => {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/dashboard/admin-management',
        destination: '/dashboard/admin-management/manage-admins',
        permanent: true,
      },
      {
        source: '/dashboard/courses-management',
        destination: '/dashboard/courses-management/list',
        permanent: true,
      }
    ];
  };