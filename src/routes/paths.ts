export const rootPaths = {
  root: '/',
  pageRoot: '',
  authRoot: 'auth',
  errorRoot: 'error',
};

export default {
  dashboard: `/${rootPaths.pageRoot}/dashboard`,
  activity: `/${rootPaths.pageRoot}/activity`,
  inventory: `${rootPaths.pageRoot}/inventory`,
  inventoryExplore: `${rootPaths.pageRoot}/inventory/explore`,
  inventoryCreate: `${rootPaths.pageRoot}/inventory/create`,
  schedules: `/${rootPaths.pageRoot}/schedules`,
  payouts: `/${rootPaths.pageRoot}/payouts`,
  settings: `/${rootPaths.pageRoot}/settings`,

  signin: `https://ace-louse-42.accounts.dev/sign-in`,
  signup: `https://ace-louse-42.accounts.dev/sign-up`,
  404: `/${rootPaths.errorRoot}/404`,
};
