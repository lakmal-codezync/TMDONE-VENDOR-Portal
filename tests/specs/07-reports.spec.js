import { test } from '../fixtures/vendorPortalFixture.js';
import { ReportsPage } from '../pages/ReportsPage.js';
import { LoginPage } from '../pages/LoginPage.js';

const baseURL = process.env.VENDOR_PORTAL_BASE_URL || 'https://partner.demo.dr.tmd1.org';

test.describe('Reports', () => {
  test.describe.configure({ mode: 'serial', timeout: 120000 });

  let context;
  let page;
  let reportsPage;

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(180000);

    context = await browser.newContext({ baseURL });
    page = await context.newPage();
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login();
    reportsPage = new ReportsPage(page);
  });

  test.afterAll(async () => {
    await context?.close();
  });

  test.afterEach(async () => {
    if (await reportsPage?.detailHeading.isVisible({ timeout: 500 }).catch(() => false)) {
      await page.close().catch(() => {});
      page = await context.newPage();
      reportsPage = new ReportsPage(page);
    }
  });

  test.beforeEach(async () => {
    await reportsPage.goto();
  });

  test('TC_REPORTS_001 @reports-load page loads with correct URL and heading', async () => {
    await reportsPage.expectReportsUrl();
    await reportsPage.expectHeadingVisible();
  });

  test('TC_REPORTS_002 @reports-sidebar sidebar navigation opens reports page', async () => {
    await reportsPage.gotoDashboard();
    await reportsPage.openFromSidebar();
    await reportsPage.expectReportsUrl();
    await reportsPage.expectSidebarLinkVisible();
  });

  test('TC_REPORTS_003 @reports-tabs report tabs are visible', async () => {
    await reportsPage.expectReportTabsVisible();
  });

  test('TC_REPORTS_004 @reports-toolbar export search date and period controls are visible', async () => {
    await reportsPage.expectToolbarVisible();
  });

  test('TC_REPORTS_005 @reports-sales-table sales report table columns are visible', async () => {
    await reportsPage.expectSalesReportVisible();
    await reportsPage.expectSalesReportColumnsVisible();
  });

  test('TC_REPORTS_006 @reports-sales-rows sales report rows show order data', async () => {
    await reportsPage.expectSalesReportRowsVisible();
  });

  test('TC_REPORTS_007 @reports-month-filter month period filter keeps report visible', async () => {
    await reportsPage.selectPeriod('Month');
    await reportsPage.expectReportsUrl();
    await reportsPage.expectSalesReportColumnsVisible();
  });

  test('TC_REPORTS_008 @reports-week-filter week period filter keeps report visible', async () => {
    await reportsPage.selectPeriod('Week');
    await reportsPage.expectReportsUrl();
    await reportsPage.expectSalesReportColumnsVisible();
  });

  test('TC_REPORTS_009 @reports-today-filter today period filter keeps report visible', async () => {
    await reportsPage.selectPeriod('Today');
    await reportsPage.expectReportsUrl();
    await reportsPage.expectSalesReportColumnsVisible();
  });

  test('TC_REPORTS_010 @reports-search search action keeps sales report visible', async () => {
    await reportsPage.searchReports();
    await reportsPage.expectReportsUrl();
    await reportsPage.expectSalesReportColumnsVisible();
  });

  test('TC_REPORTS_011 @reports-pagination sales report pagination is visible', async () => {
    await reportsPage.expectPaginationVisible();
  });

  test('TC_REPORTS_012 @reports-order-count-tab order count report opens', async () => {
    await reportsPage.openOrderCountReport();
    await reportsPage.expectOrderCountColumnsVisible();
  });

  test('TC_REPORTS_013 @reports-order-count-rows order count rows and actions are visible', async () => {
    await reportsPage.openOrderCountReport();
    await reportsPage.expectOrderCountRowsVisible();
  });

  test('TC_REPORTS_014 @reports-order-count-details view details opens order count log', async () => {
    await reportsPage.openOrderCountDetails();
    await reportsPage.expectOrderCountDetailsVisible();
  });

  test('TC_REPORTS_015 @reports-order-count-details-table detail order count columns are visible', async () => {
    await reportsPage.openOrderCountDetails();
    await reportsPage.expectOrderCountDetailsColumnsVisible();
  });

  test('TC_REPORTS_016 @reports-order-count-details-search detail search keeps log visible', async () => {
    await reportsPage.openOrderCountDetails();
    await reportsPage.searchOrderCountDetails();
    await reportsPage.expectOrderCountDetailsVisible();
  });

  test('TC_REPORTS_017 @reports-top-selling-tab top selling items report opens', async () => {
    await reportsPage.openTopSellingItemsReport();
    await reportsPage.expectTopSellingItemsColumnsVisible();
  });

  test('TC_REPORTS_018 @reports-top-selling-rows top selling item rows are visible', async () => {
    await reportsPage.openTopSellingItemsReport();
    await reportsPage.expectTopSellingItemsRowsVisible();
  });

  test('TC_REPORTS_019 @reports-top-selling-search search keeps top selling report visible', async () => {
    await reportsPage.openTopSellingItemsReport();
    await reportsPage.searchReports();
    await reportsPage.expectTopSellingItemsColumnsVisible();
  });

  test('TC_REPORTS_020 @reports-top-selling-pagination top selling pagination is visible', async () => {
    await reportsPage.openTopSellingItemsReport();
    await reportsPage.expectPaginationVisible();
  });
});
