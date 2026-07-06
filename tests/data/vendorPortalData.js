export const vendorCredentials = {
  username: process.env.VENDOR_PORTAL_USERNAME || 'arshaka@gmail.com',
  password: process.env.VENDOR_PORTAL_PASSWORD || '123123',
};

export const vendorPortal = {
  vendorName: 'Cafe Asiana',
  baseHash: '#/home',
  routes: {
    signIn: '/#/authentication/signin',
    dashboard: '/#/home/dashboard',
    vendorPerformance: '/#/home/vendor/performance',
    branchDetails: '/#/home/stores',
    ordersManagement: '/#/home/orders',
    menuManagement:
      '/#/home/menu?type=0&storeId=5e7a06b28cbfe934c02dacc5&sectorId=5e2b82a68cbfe31a8cd09c64',
    storeRatings: '/#/home/storeRatings',
    storeRatingsSummary: '/#/home/storeRatings/summary?StoreId=5e7a06b28cbfe934c02dacc5&storeName=Cafe%20Asiana',
    reports: '/#/home/reports',
    smartBoostCampaign: '/#/home/smart-boost-campaign/list',
  },
};
