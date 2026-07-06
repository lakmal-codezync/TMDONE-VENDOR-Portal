import { test } from '../fixtures/vendorPortalFixture.js';
import { DashboardPage } from '../pages/DashboardPage.js';

test.describe('Dashboard', () => {
  test.describe.configure({ timeout: 120000 });

  test.beforeEach(async ({ authenticatedPage }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);

    await dashboardPage.openFromSidebar();
  });

  test('TC_DASHBOARD_001 @dashboard-load dashboard page loads with correct URL and heading', async ({
    authenticatedPage,
  }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);

    await dashboardPage.expectDashboardUrl();
    await dashboardPage.expectHeadingVisible();
  });

  test('TC_DASHBOARD_002 @dashboard-shell vendor shell and sidebar navigation are visible', async ({
    authenticatedPage,
  }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);

    await dashboardPage.expectNavigationShellVisible();
    await dashboardPage.expectSignOutVisible();
  });

  test('TC_DASHBOARD_003 @dashboard-comparison comparison period controls are visible', async ({
    authenticatedPage,
  }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);

    await dashboardPage.expectComparisonControlsVisible();
  });

  test('TC_DASHBOARD_004 @dashboard-month-filter month comparison filter can be selected', async ({
    authenticatedPage,
  }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);

    await dashboardPage.selectComparisonPeriod('Month');
    await dashboardPage.expectDashboardUrl();
    await dashboardPage.expectOrdersSummaryVisible();
  });

  test('TC_DASHBOARD_005 @dashboard-week-filter week comparison filter can be selected', async ({
    authenticatedPage,
  }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);

    await dashboardPage.selectComparisonPeriod('Week');
    await dashboardPage.expectDashboardUrl();
    await dashboardPage.expectSalesSummaryVisible();
  });

  test('TC_DASHBOARD_006 @dashboard-today-filter today comparison filter can be selected', async ({
    authenticatedPage,
  }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);

    await dashboardPage.selectComparisonPeriod('Today');
    await dashboardPage.expectDashboardUrl();
    await dashboardPage.expectBranchesSummaryVisible();
  });

  test('TC_DASHBOARD_007 @dashboard-date-range date range filter controls are visible', async ({
    authenticatedPage,
  }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);

    await dashboardPage.expectDateRangeFilterVisible();
  });

  test('TC_DASHBOARD_008 @dashboard-store-filter store filter and search action are visible', async ({
    authenticatedPage,
  }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);

    await dashboardPage.expectStoreFilterVisible();
  });

  test('TC_DASHBOARD_009 @dashboard-search dashboard search keeps user on dashboard', async ({
    authenticatedPage,
  }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);

    await dashboardPage.searchDashboard();
    await dashboardPage.expectDashboardUrl();
    await dashboardPage.expectHeadingVisible();
  });

  test('TC_DASHBOARD_010 @dashboard-orders orders summary card shows current and previous values', async ({
    authenticatedPage,
  }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);

    await dashboardPage.expectOrdersSummaryVisible();
  });

  test('TC_DASHBOARD_011 @dashboard-sales sales summary card shows current and previous values', async ({
    authenticatedPage,
  }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);

    await dashboardPage.expectSalesSummaryVisible();
  });

  test('TC_DASHBOARD_012 @dashboard-branches branches summary shows opened busy and closed states', async ({
    authenticatedPage,
  }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);

    await dashboardPage.expectBranchesSummaryVisible();
  });

  test('TC_DASHBOARD_013 @dashboard-charts dashboard chart labels are visible', async ({
    authenticatedPage,
  }) => {
    const dashboardPage = new DashboardPage(authenticatedPage);

    await dashboardPage.expectChartLabelsVisible();
  });
});
