export const vendorCredentials = {
  username: process.env.VENDOR_PORTAL_USERNAME || '',
  password: process.env.VENDOR_PORTAL_PASSWORD || '',
};

export const vendorPortal = {
  vendorName: 'Food House',
  baseHash: '#/home',
  routes: {
    signIn: '/#/authentication/signin',
    dashboard: '/#/home/dashboard',
    vendorPerformance: '/#/home/vendor/performance',
    branchDetails: '/#/home/stores',
    ordersManagement: '/#/home/orders',
    menuManagement:
      '/#/home/menu?type=0&storeId=634545068cbfe448e06c0e9b&sectorId=5e2b82a68cbfe31a8cd09c64',
    storeRatings: '/#/home/storeRatings',
    storeRatingsSummary: '/#/home/storeRatings/summary?StoreId=634545068cbfe448e06c0e9b&storeName=Food%20House',
    reports: '/#/home/reports',
    smartBoostCampaign: '/#/home/smart-boost-campaign/list',
  },
};
