import { test } from '../fixtures/vendorPortalFixture.js';
import { SmartBoostCampaignPage } from '../pages/SmartBoostCampaignPage.js';
import { LoginPage } from '../pages/LoginPage.js';

const baseURL = process.env.VENDOR_PORTAL_BASE_URL || 'https://partner.demo.dr.tmd1.org';

test.describe('Smart Boost Campaign', () => {
  test.describe.configure({ mode: 'serial', timeout: 120000 });

  let context;
  let page;
  let smartBoostCampaignPage;

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(180000);

    context = await browser.newContext({ baseURL });
    page = await context.newPage();
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login();
    smartBoostCampaignPage = new SmartBoostCampaignPage(page);
  });

  test.afterAll(async () => {
    await context?.close();
  });

  test.beforeEach(async () => {
    await smartBoostCampaignPage.goto();
  });

  test('TC_SMART_BOOST_001 @smart-boost-load page loads with correct URL and heading', async () => {
    await smartBoostCampaignPage.expectLoaded();
  });

  test('TC_SMART_BOOST_002 @smart-boost-sidebar sidebar navigation opens smart boost campaign page', async () => {
    await smartBoostCampaignPage.gotoDashboard();
    await smartBoostCampaignPage.openFromSidebar();
    await smartBoostCampaignPage.expectSmartBoostCampaignUrl();
    await smartBoostCampaignPage.expectSidebarLinkVisible();
  });

  test('TC_SMART_BOOST_003 @smart-boost-toolbar create search status store and date controls are visible', async () => {
    await smartBoostCampaignPage.expectToolbarVisible();
  });

  test('TC_SMART_BOOST_004 @smart-boost-table campaign table columns are visible', async () => {
    await smartBoostCampaignPage.expectTableColumnsVisible();
  });

  test('TC_SMART_BOOST_005 @smart-boost-rows campaign rows show campaign data and actions', async () => {
    await smartBoostCampaignPage.expectCampaignRowsVisible();
  });

  test('TC_SMART_BOOST_006 @smart-boost-pagination campaign pagination is visible', async () => {
    await smartBoostCampaignPage.expectPaginationVisible();
  });

  test('TC_SMART_BOOST_007 @smart-boost-search search action keeps campaign list visible', async () => {
    await smartBoostCampaignPage.searchCampaigns();
    await smartBoostCampaignPage.expectSmartBoostCampaignUrl();
    await smartBoostCampaignPage.expectTableColumnsVisible();
  });

  test('TC_SMART_BOOST_008 @smart-boost-clear clear filters keeps campaign list visible', async () => {
    await smartBoostCampaignPage.searchCampaigns();
    await smartBoostCampaignPage.clearFilters();
    await smartBoostCampaignPage.expectSmartBoostCampaignUrl();
    await smartBoostCampaignPage.expectToolbarVisible();
    await smartBoostCampaignPage.expectTableColumnsVisible();
  });

  test('TC_SMART_BOOST_009 @smart-boost-create-form create campaign form opens with all required fields', async () => {
    await smartBoostCampaignPage.openCreateCampaignForm();
    await smartBoostCampaignPage.expectCreateCampaignFormVisible();
    await smartBoostCampaignPage.closeCreateCampaignForm();
  });

  test('TC_SMART_BOOST_010 @smart-boost-create-values create campaign form accepts budget and shows default CPC value', async () => {
    await smartBoostCampaignPage.openCreateCampaignForm();
    await smartBoostCampaignPage.expectCreateCampaignFormVisible();
    await smartBoostCampaignPage.fillCreateCampaignAmounts();
    await smartBoostCampaignPage.closeCreateCampaignForm();
  });

  test('TC_SMART_BOOST_011 @smart-boost-actions row action menu shows all campaign actions', async () => {
    await smartBoostCampaignPage.openRowActions();
    await smartBoostCampaignPage.expectActionMenuVisible();
  });

  test('TC_SMART_BOOST_012 @smart-boost-actions-enabled campaign actions are enabled for active campaigns', async () => {
    await smartBoostCampaignPage.openRowActions();
    await smartBoostCampaignPage.expectActionMenuItemsEnabled();
  });
});
