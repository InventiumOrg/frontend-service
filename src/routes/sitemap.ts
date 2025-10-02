import paths from 'routes/paths';

export interface SubMenuItem {
  name: string;
  pathName: string;
  path: string;
  icon?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  subheader: string;
  path?: string;
  icon?: string;
  avatar?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

const sitemap: MenuItem[] = [
  {
    id: 'dashboard',
    subheader: 'Dashboard',
    path: '/',
    icon: 'ri:dashboard-fill',
  },
  // {
  //   id: 'activity',
  //   subheader: 'Activity',
  //   path: '#!',
  //   icon: 'ic:baseline-show-chart',
  // },
  {
    id: 'library',
    subheader: 'Inventory',
    icon: 'material-symbols:inventory-2-outline',
    items: [
      {
        name: 'Explore',
        pathName: 'inventory-explore',
        path: paths.inventoryExplore,
      },
      {
        name: 'Catelogue',
        pathName: 'inventory-catelouge',
        path: paths.inventoryCatelogue,
      },
      {
        name: 'Import',
        pathName: 'inventory-import',
        path: paths.inventoryImport,
      },
      {
        name: 'Export',
        pathName: 'inventory-export',
        path: paths.inventoryExport,
      },
    ],
  },
  {
    id: 'warehouse',
    subheader: 'Warehouse',
    path: '#!',
    icon: 'material-symbols:warehouse-outline',
  },
  {
    id: 'pos',
    subheader: 'POS',
    path: '#!',
    icon: 'material-symbols:sell-outline',
  },
  {
    id: 'revenue',
    subheader: 'Revenue',
    path: '#!',
    icon: 'material-symbols:bar-chart-4-bars',
  }

  // {
  //   id: 'user',
  //   subheader: 'User Management',
  //   icon: 'ic:round-security',
  //   items: [
  //     {
  //       name: 'Sign In',
  //       pathName: 'signin',
  //       path: paths.signin,
  //     },
  //     {
  //       name: 'Sign Up',
  //       pathName: 'signup',
  //       path: paths.signup,
  //     },
  //   ],
  // },
  // {
  //   id: 'schedules',
  //   subheader: 'Schedules',
  //   path: '#!',
  //   icon: 'ic:outline-calendar-today',
  // },
  // {
  //   id: 'payouts',
  //   subheader: 'Payouts',
  //   path: '#!',
  //   icon: 'material-symbols:account-balance-wallet-outline',
  // },
  // {
  //   id: 'settings',
  //   subheader: 'Settings',
  //   path: '#!',
  //   icon: 'ic:outline-settings',
  // },
];

export default sitemap;
