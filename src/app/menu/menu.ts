import { CoreMenu } from '@core/types';

export const menu: CoreMenu[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    // translate: 'menu.dashboard.collapsible',
    type: 'item',
    role: ['student'],
    icon: "assets/images/icons/navbar/dashboard.svg",
    url: 'dashboard',
  },
  {
    id: 'Company-Management',
    type: 'collapsible',
    title: 'Company Management',
    translate: 'menu.content_management',
    icon: "assets/images/icons/navbar/company-management.svg",
    children: [
      {
        id: '2',
        title: 'Manage Companies',
        translate: 'menu.manage_companies',
        type: 'item',
        url: '/apps/company-management/companies',
      },
      {
        id: '22',
        title: 'Manage Branches',
        translate: 'menu.manage_branches',
        type: 'item',
        url: '/apps/company-management/branches',
      },
    ]
  }
];
