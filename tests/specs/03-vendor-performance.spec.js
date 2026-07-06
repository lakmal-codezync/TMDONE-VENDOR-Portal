import { test } from '../fixtures/vendorPortalFixture.js';
import { VendorPerformancePage } from '../pages/VendorPerformancePage.js';

test.describe('Vendor Performance', () => {
  test.describe.configure({ timeout: 120000 });

  test.beforeEach(async ({ authenticatedPage }) => {
    const vendorPerformancePage = new VendorPerformancePage(authenticatedPage);

    await vendorPerformancePage.goto();
  });

  test('TC_VENDOR_PERFORMANCE_001 @vendor-performance-load page loads with correct URL and heading', async ({
    authenticatedPage,
  }) => {
    const vendorPerformancePage = new VendorPerformancePage(authenticatedPage);

    await vendorPerformancePage.expectVendorPerformanceUrl();
    await vendorPerformancePage.expectHeadingVisible();
  });

  test('TC_VENDOR_PERFORMANCE_002 @vendor-performance-filters period date store filters are visible', async ({
    authenticatedPage,
  }) => {
    const vendorPerformancePage = new VendorPerformancePage(authenticatedPage);

    await vendorPerformancePage.expectFilterControlsVisible();
  });

  test('TC_VENDOR_PERFORMANCE_003 @vendor-performance-month-filter month filter can be selected', async ({
    authenticatedPage,
  }) => {
    const vendorPerformancePage = new VendorPerformancePage(authenticatedPage);

    await vendorPerformancePage.selectPeriod('Month');
    await vendorPerformancePage.expectVendorPerformanceUrl();
    await vendorPerformancePage.expectLoaded();
  });

  test('TC_VENDOR_PERFORMANCE_004 @vendor-performance-week-filter week filter can be selected', async ({
    authenticatedPage,
  }) => {
    const vendorPerformancePage = new VendorPerformancePage(authenticatedPage);

    await vendorPerformancePage.selectPeriod('Week');
    await vendorPerformancePage.expectVendorPerformanceUrl();
    await vendorPerformancePage.expectOrderSummaryCardsVisible();
  });

  test('TC_VENDOR_PERFORMANCE_005 @vendor-performance-today-filter today filter can be selected', async ({
    authenticatedPage,
  }) => {
    const vendorPerformancePage = new VendorPerformancePage(authenticatedPage);

    await vendorPerformancePage.selectPeriod('Today');
    await vendorPerformancePage.expectVendorPerformanceUrl();
    await vendorPerformancePage.expectOrderSummaryCardsVisible();
  });

  test('TC_VENDOR_PERFORMANCE_006 @vendor-performance-search search keeps user on report page', async ({
    authenticatedPage,
  }) => {
    const vendorPerformancePage = new VendorPerformancePage(authenticatedPage);

    await vendorPerformancePage.searchPerformance();
    await vendorPerformancePage.expectVendorPerformanceUrl();
    await vendorPerformancePage.expectHeadingVisible();
  });

  test('TC_VENDOR_PERFORMANCE_007 @vendor-performance-order-summary order summary cards are visible', async ({
    authenticatedPage,
  }) => {
    const vendorPerformancePage = new VendorPerformancePage(authenticatedPage);

    await vendorPerformancePage.expectOrderSummaryCardsVisible();
  });

  test('TC_VENDOR_PERFORMANCE_008 @vendor-performance-cancellations cancellation reasons table is visible', async ({
    authenticatedPage,
  }) => {
    const vendorPerformancePage = new VendorPerformancePage(authenticatedPage);

    await vendorPerformancePage.expectCancellationReasonsVisible();
  });

  test('TC_VENDOR_PERFORMANCE_009 @vendor-performance-customers customer metrics are visible', async ({
    authenticatedPage,
  }) => {
    const vendorPerformancePage = new VendorPerformancePage(authenticatedPage);

    await vendorPerformancePage.expectCustomerMetricsVisible();
  });

  test('TC_VENDOR_PERFORMANCE_010 @vendor-performance-operations response and delay metrics are visible', async ({
    authenticatedPage,
  }) => {
    const vendorPerformancePage = new VendorPerformancePage(authenticatedPage);

    await vendorPerformancePage.expectOperationalMetricsVisible();
  });

  test('TC_VENDOR_PERFORMANCE_011 @vendor-performance-order-health order health chart is visible', async ({
    authenticatedPage,
  }) => {
    const vendorPerformancePage = new VendorPerformancePage(authenticatedPage);

    await vendorPerformancePage.expectOrderHealthVisible();
  });

  test('TC_VENDOR_PERFORMANCE_012 @vendor-performance-top-selling top selling items and areas are visible', async ({
    authenticatedPage,
  }) => {
    const vendorPerformancePage = new VendorPerformancePage(authenticatedPage);

    await vendorPerformancePage.expectTopSellingSectionsVisible();
  });

  test('TC_VENDOR_PERFORMANCE_013 @vendor-performance-downloads chart download actions are visible', async ({
    authenticatedPage,
  }) => {
    const vendorPerformancePage = new VendorPerformancePage(authenticatedPage);

    await vendorPerformancePage.expectDownloadActionsVisible();
  });

  test('TC_VENDOR_PERFORMANCE_014 @vendor-performance-table order performance table and pagination are visible', async ({
    authenticatedPage,
  }) => {
    const vendorPerformancePage = new VendorPerformancePage(authenticatedPage);

    await vendorPerformancePage.expectOrderPerformanceTableVisible();
    await vendorPerformancePage.expectPaginationVisible();
  });
});
