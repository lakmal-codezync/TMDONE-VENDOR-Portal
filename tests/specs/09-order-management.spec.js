import { test } from '../fixtures/vendorPortalFixture.js';
import { OrdersManagementPage } from '../pages/OrdersManagementPage.js';

const baseURL = process.env.VENDOR_PORTAL_BASE_URL || 'https://partner.demo.dr.tmd1.org';

test.describe('Order Management', () => {
  test.describe.configure({ mode: 'serial', timeout: 120000 });

  let context;
  let page;
  let ordersManagementPage;

  test.beforeAll(async ({ browser, authStorageState }) => {
    context = await browser.newContext({ baseURL, storageState: authStorageState });
    page = await context.newPage();
    ordersManagementPage = new OrdersManagementPage(page);
  });

  test.afterAll(async () => {
    await context?.close();
  });

  test.beforeEach(async () => {
    await ordersManagementPage.goto();
  });

  test('TC_ORDER_MANAGEMENT_001 @order-management-load page loads with correct URL and heading', async () => {
    await ordersManagementPage.expectOrdersManagementUrl();
    await ordersManagementPage.expectHeadingVisible();
  });

  test('TC_ORDER_MANAGEMENT_002 @order-management-sidebar sidebar link targets order management', async () => {
    await ordersManagementPage.expectSidebarLinkVisible();
  });

  test('TC_ORDER_MANAGEMENT_003 @order-management-status-cards order status summary cards are visible', async () => {
    await ordersManagementPage.expectOrderStatusCardsVisible();
  });

  test('TC_ORDER_MANAGEMENT_004 @order-management-filters search and store filters are visible', async () => {
    await ordersManagementPage.expectFiltersVisible();
  });

  test('TC_ORDER_MANAGEMENT_005 @order-management-tabs order status tabs are visible', async () => {
    await ordersManagementPage.expectTabsVisible();
  });

  test('TC_ORDER_MANAGEMENT_006 @order-management-table new orders table columns are visible', async () => {
    await ordersManagementPage.expectTableColumnsVisible();
  });

  test('TC_ORDER_MANAGEMENT_007 @order-management-ongoing-tab ongoing orders tab opens table view', async () => {
    await ordersManagementPage.openOrdersTab('Ongoing Orders');
    await ordersManagementPage.expectTableColumnsVisible();
    await ordersManagementPage.expectResultsSummaryVisible();
  });

  test('TC_ORDER_MANAGEMENT_008 @order-management-completed-tab completed orders tab opens table view', async () => {
    await ordersManagementPage.openOrdersTab('Completed Orders');
    await ordersManagementPage.expectTableColumnsVisible();
    await ordersManagementPage.expectResultsSummaryVisible();
  });

  test('TC_ORDER_MANAGEMENT_009 @order-management-cancelled-tab cancelled orders tab opens table view', async () => {
    await ordersManagementPage.openOrdersTab('Cancelled Orders');
    await ordersManagementPage.expectTableColumnsVisible();
    await ordersManagementPage.expectResultsSummaryVisible();
  });

  test('TC_ORDER_MANAGEMENT_010 @order-management-search search keeps user on order management route', async () => {
    await ordersManagementPage.searchOrdersManagement('AUTO');
    await ordersManagementPage.expectOrdersManagementUrl();
    await ordersManagementPage.expectHeadingVisible();
    await ordersManagementPage.expectResultsSummaryVisible();
  });

  test('TC_ORDER_MANAGEMENT_011 @order-management-results result count is visible', async () => {
    await ordersManagementPage.expectResultsSummaryVisible();
  });

  test('TC_ORDER_MANAGEMENT_012 @order-management-pagination pagination controls are visible', async () => {
    await ordersManagementPage.expectPaginationVisible();
  });

  test('TC_ORDER_MANAGEMENT_013 @order-management-empty-or-rows order list renders empty state or rows', async () => {
    await ordersManagementPage.expectEmptyOrRowsVisible();
  });
});
