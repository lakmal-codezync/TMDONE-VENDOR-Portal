import { test } from '../fixtures/vendorPortalFixture.js';
import { BranchDetailsPage } from '../pages/BranchDetailsPage.js';

test.describe('Branch(s) Details', () => {
  test.describe.configure({ timeout: 120000 });

  test.beforeEach(async ({ authenticatedPage }) => {
    const branchDetailsPage = new BranchDetailsPage(authenticatedPage);

    await branchDetailsPage.goto();
  });

  test('TC_BRANCH_DETAILS_001 @branch-details-load page loads with correct URL and heading', async ({
    authenticatedPage,
  }) => {
    const branchDetailsPage = new BranchDetailsPage(authenticatedPage);

    await branchDetailsPage.expectBranchDetailsUrl();
    await branchDetailsPage.expectHeadingVisible();
  });

  test('TC_BRANCH_DETAILS_002 @branch-details-sidebar sidebar navigation opens branch details', async ({
    authenticatedPage,
  }) => {
    const branchDetailsPage = new BranchDetailsPage(authenticatedPage);

    await branchDetailsPage.gotoDashboard();
    await branchDetailsPage.openFromSidebar();
    await branchDetailsPage.expectBranchDetailsUrl();
    await branchDetailsPage.expectHeadingVisible();
  });

  test('TC_BRANCH_DETAILS_003 @branch-details-summary store summary counters are visible', async ({
    authenticatedPage,
  }) => {
    const branchDetailsPage = new BranchDetailsPage(authenticatedPage);

    await branchDetailsPage.expectStoreSummaryVisible();
  });

  test('TC_BRANCH_DETAILS_004 @branch-details-table table columns are visible', async ({ authenticatedPage }) => {
    const branchDetailsPage = new BranchDetailsPage(authenticatedPage);

    await branchDetailsPage.expectTableColumnsVisible();
  });

  test('TC_BRANCH_DETAILS_005 @branch-details-row branch row data is visible', async ({ authenticatedPage }) => {
    const branchDetailsPage = new BranchDetailsPage(authenticatedPage);

    await branchDetailsPage.expectBranchRowVisible();
  });

  test('TC_BRANCH_DETAILS_006 @branch-details-actions row actions are visible', async ({ authenticatedPage }) => {
    const branchDetailsPage = new BranchDetailsPage(authenticatedPage);

    await branchDetailsPage.expectBranchActionsVisible();
  });

  test('TC_BRANCH_DETAILS_007 @branch-details-pagination result count and pagination are visible', async ({
    authenticatedPage,
  }) => {
    const branchDetailsPage = new BranchDetailsPage(authenticatedPage);

    await branchDetailsPage.expectPaginationVisible();
  });
});
