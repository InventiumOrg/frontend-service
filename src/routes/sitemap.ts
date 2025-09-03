import paths from 'routes/paths';
// import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
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
  {
    id: 'activity',
    subheader: 'Revenue',
    path: '#!',
    icon: 'ic:baseline-show-chart',
  },
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
        name: 'Create',
        pathName: 'inventory-create',
        path: paths.inventoryCreate,
      },
    ],
  },
  {
    id: 'user',
    subheader: 'User Management',
    icon: 'ic:round-security',
    items: [
      {
        name: 'User',
        pathName: 'signin',
        path: paths.signin,
      },
    ],
  },
  {
    id: 'schedules',
    subheader: 'Transactions',
    path: '#!',
    icon: 'material-symbols-light:history',
  },
  {
    id: 'schedules',
    subheader: 'Schedules',
    path: '#!',
    icon: 'ic:outline-calendar-today',
  },
  {
    id: 'payouts',
    subheader: 'Payouts',
    path: '#!',
    icon: 'material-symbols:account-balance-wallet-outline',
  },
  {
    id: 'payouts',
    subheader: 'Point of Sales',
    path: '#!',
    icon: 'mdi:printer-point-of-sale-outline',
  },
  {
    id: 'settings',
    subheader: 'Settings',
    path: '#!',
    icon: 'ic:outline-settings',
  },
];

export default sitemap;
