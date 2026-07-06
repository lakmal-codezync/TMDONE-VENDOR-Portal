import { test } from '../fixtures/vendorPortalFixture.js';
import { MenuManagementPage } from '../pages/MenuManagementPage.js';

const uniqueMenuItem = () => {
  const suffix = Date.now();

  return {
    englishName: `Auto Menu Item ${suffix}`,
    arabicName: `Auto Arabic Item ${suffix}`,
    englishDescription: `Automated menu item ${suffix}`,
    arabicDescription: `Automated Arabic description ${suffix}`,
    sku: `AUTO${suffix}`,
    price: '1.250',
    category: 'Appetizers',
    orderType: 'Delivery',
  };
};

test.describe('Menu Management', () => {
  test.describe.configure({ timeout: 120000 });

  test.beforeEach(async ({ authenticatedPage }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.goto();
  });

  test('TC_MENU_MANAGEMENT_001 @menu-management-load page loads with correct URL and tabs', async ({
    authenticatedPage,
  }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.expectMenuManagementUrl();
    await menuManagementPage.expectStoreSelectorVisible();
    await menuManagementPage.expectTabsVisible();
  });

  test('TC_MENU_MANAGEMENT_002 @menu-management-sidebar sidebar navigation opens menu management', async ({
    authenticatedPage,
  }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.gotoDashboard();
    await menuManagementPage.openFromSidebar();
    await menuManagementPage.expectMenuManagementUrl();
    await menuManagementPage.expectTabsVisible();
  });

  test('TC_MENU_MANAGEMENT_003 @menu-categories-table category table columns are visible', async ({
    authenticatedPage,
  }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.expectCategoryManagementVisible();
  });

  test('TC_MENU_MANAGEMENT_004 @menu-categories-toolbar category toolbar controls are visible', async ({
    authenticatedPage,
  }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.expectCategoryToolbarVisible();
  });

  test('TC_MENU_MANAGEMENT_005 @menu-categories-rows category rows are visible', async ({ authenticatedPage }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.expectCategoryRowsVisible();
    await menuManagementPage.expectCategoryVisible('Appetizers');
  });

  test('TC_MENU_MANAGEMENT_006 @menu-categories-actions category row actions are visible', async ({
    authenticatedPage,
  }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.expectCategoryActionsVisible();
  });

  test('TC_MENU_MANAGEMENT_007 @menu-categories-search category search keeps matching result visible', async ({
    authenticatedPage,
  }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.searchCategory('Appetizers');
    await menuManagementPage.expectCategoryVisible('Appetizers');
  });

  test('TC_MENU_MANAGEMENT_008 @menu-items-table item management table columns are visible', async ({
    authenticatedPage,
  }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.openItemManagement();
    await menuManagementPage.expectItemManagementVisible();
  });

  test('TC_MENU_MANAGEMENT_009 @menu-items-toolbar item toolbar controls and filters are visible', async ({
    authenticatedPage,
  }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.openItemManagement();
    await menuManagementPage.expectItemToolbarVisible();
  });

  test('TC_MENU_MANAGEMENT_010 @menu-items-rows item rows are visible', async ({ authenticatedPage }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.openItemManagement();
    await menuManagementPage.expectItemRowsVisible();
  });

  test('TC_MENU_MANAGEMENT_011 @menu-items-actions item row actions are visible', async ({ authenticatedPage }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.openItemManagement();
    await menuManagementPage.expectItemActionsVisible();
  });

  test('TC_MENU_MANAGEMENT_012 @menu-items-search item search keeps matching result visible', async ({
    authenticatedPage,
  }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.openItemManagement();
    await menuManagementPage.searchItem('Cheetos Fries');
    await menuManagementPage.expectCategoryVisible('Cheetos Fries');
  });

  test('TC_MENU_MANAGEMENT_013 @menu-items-pagination item pagination is visible', async ({ authenticatedPage }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.openItemManagement();
    await menuManagementPage.expectPaginationVisible();
  });

  test('TC_MENU_MANAGEMENT_014 @menu-categories-create category create form accepts required data', async ({
    authenticatedPage,
  }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.openAddCategoryForm();
    await menuManagementPage.expectCategoryFormVisible('Create');
    await menuManagementPage.fillCategoryForm('Auto Category', 'Auto Arabic Category');
    await menuManagementPage.expectCategoryFormCanSubmit('Create');
    await menuManagementPage.cancelForm();
  });

  test('TC_MENU_MANAGEMENT_015 @menu-categories-update category edit form accepts updates', async ({
    authenticatedPage,
  }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.openEditCategoryForm();
    await menuManagementPage.expectCategoryFormVisible('Update');
    await menuManagementPage.fillCategoryForm('Combo Meals', 'Combo Meals Arabic');
    await menuManagementPage.expectCategoryFormCanSubmit('Update');
    await menuManagementPage.cancelForm();
  });

  test('TC_MENU_MANAGEMENT_016 @menu-items-create item create form accepts required data', async ({
    authenticatedPage,
  }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);
    const item = uniqueMenuItem();

    await menuManagementPage.openItemManagement();
    await menuManagementPage.openAddItemForm();
    await menuManagementPage.expectItemFormVisible('Create');
    await menuManagementPage.fillItemForm(item);
    await menuManagementPage.expectCategoryFormCanSubmit('Create');
    await menuManagementPage.cancelForm();
  });

  test('TC_MENU_MANAGEMENT_017 @menu-items-read item view form opens with item details', async ({
    authenticatedPage,
  }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.openItemManagement();
    await menuManagementPage.openViewItemForm();
    await menuManagementPage.expectItemCustomizationViewVisible();
  });

  test('TC_MENU_MANAGEMENT_018 @menu-items-update item edit form accepts updates', async ({
    authenticatedPage,
  }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.openItemManagement();
    await menuManagementPage.openEditItemForm();
    await menuManagementPage.expectItemFormVisible('Update');
    await menuManagementPage.expectCategoryFormCanSubmit('Update');
    await menuManagementPage.cancelForm();
  });

  test('TC_MENU_MANAGEMENT_019 @menu-items-delete item delete flow opens delete action', async ({
    authenticatedPage,
  }) => {
    const menuManagementPage = new MenuManagementPage(authenticatedPage);

    await menuManagementPage.openItemManagement();
    await menuManagementPage.openDeleteItemForm();
    await menuManagementPage.expectItemFormVisible('Delete');
    await menuManagementPage.cancelForm();
  });

});
