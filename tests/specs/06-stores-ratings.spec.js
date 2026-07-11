import { test } from '../fixtures/vendorPortalFixture.js';
import { StoresRatingsPage } from '../pages/StoresRatingsPage.js';
import { LoginPage } from '../pages/LoginPage.js';

const baseURL = process.env.VENDOR_PORTAL_BASE_URL || 'https://partner.demo.dr.tmd1.org';

test.describe('Stores Ratings', () => {
  test.describe.configure({ mode: 'serial', timeout: 120000 });

  let context;
  let page;
  let storesRatingsPage;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({ baseURL });
    page = await context.newPage();
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login();
    storesRatingsPage = new StoresRatingsPage(page);
  });

  test.afterAll(async () => {
    await context?.close();
  });

  test.beforeEach(async () => {
    await storesRatingsPage.goto();
  });

  test('TC_STORES_RATINGS_001 @stores-ratings-load page loads with correct URL and heading', async () => {
    await storesRatingsPage.expectStoresRatingsUrl();
    await storesRatingsPage.expectHeadingVisible();
  });

  test('TC_STORES_RATINGS_002 @stores-ratings-sidebar sidebar navigation opens stores ratings', async () => {
    await storesRatingsPage.gotoDashboard();
    await storesRatingsPage.openFromSidebar();
    await storesRatingsPage.expectStoresRatingsUrl();
    await storesRatingsPage.expectSidebarLinkVisible();
  });

  test('TC_STORES_RATINGS_003 @stores-ratings-toolbar store selector and toolbar actions are visible', async () => {
    await storesRatingsPage.expectToolbarVisible();
  });

  test('TC_STORES_RATINGS_004 @stores-ratings-table rating table columns are visible', async () => {
    await storesRatingsPage.expectTableColumnsVisible();
  });

  test('TC_STORES_RATINGS_005 @stores-ratings-row rating row data is visible', async () => {
    await storesRatingsPage.expectRatingRowVisible();
  });

  test('TC_STORES_RATINGS_006 @stores-ratings-actions rating row actions are visible', async () => {
    await storesRatingsPage.expectRowActionsVisible();
  });

  test('TC_STORES_RATINGS_007 @stores-ratings-search search keeps user on stores ratings route', async () => {
    await storesRatingsPage.searchStoresRatings();
    await storesRatingsPage.expectStoresRatingsUrl();
    await storesRatingsPage.expectHeadingVisible();
  });

  test('TC_STORES_RATINGS_008 @stores-ratings-clear clear action keeps table visible', async () => {
    await storesRatingsPage.clearStoresRatingsFilters();
    await storesRatingsPage.expectTableColumnsVisible();
  });

  test('TC_STORES_RATINGS_009 @stores-ratings-pagination result count and pagination are visible', async () => {
    await storesRatingsPage.expectPaginationVisible();
  });

  test('TC_STORES_RATINGS_010 @stores-ratings-summary-open view action opens rating summary', async () => {
    await storesRatingsPage.openRatingSummary();
    await storesRatingsPage.expectSummaryUrl();
    await storesRatingsPage.expectSummaryHeaderVisible();
  });

  test('TC_STORES_RATINGS_011 @stores-ratings-summary-analysis rating analysis is visible', async () => {
    await storesRatingsPage.openRatingSummary();
    await storesRatingsPage.expectRatingAnalysisVisible();
  });

  test('TC_STORES_RATINGS_012 @stores-ratings-summary-stars star breakdown is visible', async () => {
    await storesRatingsPage.openRatingSummary();
    await storesRatingsPage.expectStarBreakdownVisible();
  });

  test('TC_STORES_RATINGS_013 @stores-ratings-summary-comments comment summary controls are visible', async () => {
    await storesRatingsPage.openRatingSummary();
    await storesRatingsPage.expectCommentSummaryVisible();
  });

  test('TC_STORES_RATINGS_014 @stores-ratings-summary-review-cards review cards are visible', async () => {
    await storesRatingsPage.openRatingSummary();
    await storesRatingsPage.expectReviewCommentsVisible();
  });

  test('TC_STORES_RATINGS_015 @stores-ratings-summary-search comment search keeps summary visible', async () => {
    await storesRatingsPage.openRatingSummary();
    await storesRatingsPage.searchComments('5Q9ZPF');
    await storesRatingsPage.expectSummaryUrl();
    await storesRatingsPage.expectCommentSummaryVisible();
  });
});
