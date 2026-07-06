import { expect } from '@playwright/test';
import { vendorPortal } from '../data/vendorPortalData.js';
import { BasePage } from './BasePage.js';

export class MenuManagementPage extends BasePage {
  constructor(page) {
    super(page);
    this.storeHeading = page.getByRole('heading', { name: vendorPortal.vendorName }).last();
    this.storeSelector = page.getByText('Select a store', { exact: true });
    this.categoryTab = page.getByText('Menu Category Management', { exact: true });
    this.itemTab = page.getByText('Menu Item Management', { exact: true });
    this.categoryPanel = page.getByRole('tabpanel', { name: 'Menu Category Management' });
    this.itemPanel = page.getByRole('tabpanel', { name: 'Menu Item Management' });
    this.categoryHeading = page.getByText('Menu Categories', { exact: true });
    this.itemHeading = page.getByText(/Menu Items \(\d+ items\)/);
    this.searchInput = page.locator('input[type="text"]').last();
  }

  iconButton(panel, iconName) {
    return panel.locator('button').filter({ hasText: new RegExp(`^\\s*${iconName}\\s*$`) });
  }

  visibleIconButton(iconName) {
    return this.page.locator('button:visible').filter({ hasText: new RegExp(`^\\s*${iconName}\\s*$`) });
  }

  actionButton(buttonName) {
    return this.page.locator('button:visible').filter({ hasText: new RegExp(`^\\s*${buttonName}\\s*$`) }).last();
  }

  searchBox(panel) {
    return panel.getByRole('textbox', { name: 'Search...' });
  }

  fieldByPlaceholder(placeholder) {
    return this.page.locator(`input[placeholder="${placeholder}"]:visible`).last();
  }

  textArea(index) {
    return this.page.locator('textarea:visible').nth(index);
  }

  async selectLastMaterialOption(selectFromEnd, optionName) {
    const selects = this.page.locator('mat-select:visible');
    const selectCount = await selects.count();
    const select = selects.nth(selectCount - selectFromEnd);

    await select.click();
    await this.page.getByRole('option', { name: new RegExp(`^\\s*${optionName}\\s*$`, 'i') }).first().click({ force: true });
    await this.page.waitForTimeout(200);
    await this.page.keyboard.press('Escape').catch(() => {});
  }

  async clickMaterialOption(optionName) {
    const option = this.page.getByRole('option', { name: new RegExp(`^\\s*${optionName}\\s*$`, 'i') }).first();

    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.evaluate((element) => element.click());
  }

  async selectMaterialOptionByLabel(label, optionName, keepOpen = false) {
    const labelLocator = this.page
      .locator(
        `xpath=//*[self::mat-label or self::label or self::span or self::div][contains(normalize-space(.), "${label}")]`,
      )
      .last();
    const select = labelLocator.locator('xpath=following::mat-select[1]');

    await select.click();
    await this.clickMaterialOption(optionName);
    await this.page.waitForTimeout(200);

    if (!keepOpen) {
      await this.page.mouse.click(10, 10).catch(() => {});
    }
  }

  async goto() {
    await super.goto(vendorPortal.routes.menuManagement);
    await this.ensureMenuManagementReady();
  }

  async gotoDashboard() {
    await super.goto(vendorPortal.routes.dashboard);
  }

  async openFromSidebar() {
    await this.openMenuItem('Menu Management');
    await this.ensureMenuManagementReady();
  }

  async ensureMenuManagementReady() {
    for (let attempt = 1; attempt <= 3; attempt++) {
      const menuReady = await this.categoryTab
        .waitFor({ state: 'visible', timeout: 10000 })
        .then(() => true)
        .catch(() => false);

      if (menuReady) {
        return;
      }

      await this.page
        .goto(vendorPortal.routes.menuManagement, { waitUntil: 'domcontentloaded', timeout: 20000 })
        .catch(() => {});
      await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});

      if (await this.categoryTab.isVisible().catch(() => false)) {
        return;
      }

      const shellReady = await this.portalTitle
        .waitFor({ state: 'visible', timeout: 5000 })
        .then(() => true)
        .catch(() => false);

      if (shellReady) {
        await this.openMenuItem('Menu Management').catch(() => {});
      }

      if (await this.categoryTab.isVisible().catch(() => false)) {
        return;
      }

      if (attempt < 3) {
        await this.page.reload({ waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
      }
    }

    await expect(this.categoryTab).toBeVisible({ timeout: 30000 });
  }

  async expectLoaded() {
    await this.expectShellLoaded();
    await this.expectMenuManagementUrl();
    await this.expectStoreSelectorVisible();
    await this.expectTabsVisible();
    await this.expectCategoryManagementVisible();
  }

  async expectMenuManagementUrl() {
    await this.expectUrlContains('/#/home/menu');
  }

  async expectStoreSelectorVisible() {
    await expect(this.storeHeading).toBeVisible();
    await expect(this.storeSelector).toBeVisible();
  }

  async expectTabsVisible() {
    await expect(this.categoryTab).toBeVisible();
    await expect(this.itemTab).toBeVisible();
  }

  async openCategoryManagement() {
    await this.categoryTab.click();
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async openItemManagement() {
    await this.ensureMenuManagementReady();
    await this.itemTab.click();
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
    await expect(this.itemHeading).toBeVisible();
  }

  async expectCategoryManagementVisible() {
    await expect(this.categoryHeading).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Index' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'English Category Name' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Arabic Category Name' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
  }

  async expectCategoryToolbarVisible() {
    await expect(this.iconButton(this.categoryPanel, 'add')).toBeVisible();
    await expect(this.iconButton(this.categoryPanel, 'search')).toBeVisible();
    await expect(this.searchBox(this.categoryPanel)).toBeVisible();
  }

  async expectCategoryVisible(categoryName) {
    await expect(this.page.getByText(categoryName).first()).toBeVisible();
  }

  async expectCategoryRowsVisible() {
    await this.expectCategoryVisible('Combo Meals');
    await this.expectCategoryVisible('Fresh Burgers');
    await this.expectCategoryVisible('Appetizers');
    await expect(this.page.getByText(/Total\s+12\s+results found/)).toBeVisible();
  }

  async expectCategoryActionsVisible() {
    await expect(this.categoryPanel.locator('mat-icon').filter({ hasText: /^drag_indicator$/ }).first()).toBeVisible();
    await expect(this.iconButton(this.categoryPanel, 'edit').first()).toBeVisible();
    await expect(this.iconButton(this.categoryPanel, 'reorder').first()).toBeVisible();
  }

  async openAddCategoryForm() {
    await this.iconButton(this.categoryPanel, 'add').click();
    await expect(this.page.getByText('Add Menu Category', { exact: true })).toBeVisible();
  }

  async openEditCategoryForm() {
    await this.iconButton(this.categoryPanel, 'edit').first().click();
    await expect(this.page.getByText('Edit Menu Category', { exact: true })).toBeVisible();
  }

  async expectCategoryFormVisible(buttonName) {
    await expect(this.fieldByPlaceholder('Enter English Menu Category Name')).toBeVisible();
    await expect(this.fieldByPlaceholder('Enter Arabic Menu Category Name')).toBeVisible();
    await expect(this.actionButton(buttonName)).toBeVisible();
    await expect(this.actionButton('Cancel')).toBeVisible();
  }

  async fillCategoryForm(englishName, arabicName) {
    await this.fieldByPlaceholder('Enter English Menu Category Name').fill(englishName);
    await this.fieldByPlaceholder('Enter Arabic Menu Category Name').fill(arabicName);
  }

  async expectCategoryFormCanSubmit(buttonName) {
    await expect(this.actionButton(buttonName)).toBeEnabled();
  }

  async cancelForm() {
    await this.actionButton('Cancel').click();
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async searchCategory(categoryName) {
    await this.searchBox(this.categoryPanel).fill(categoryName);
    await this.iconButton(this.categoryPanel, 'search').click();
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async expectItemManagementVisible() {
    await expect(this.itemHeading).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'English Item Name' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Arabic Item Name' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Price' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Item Availability' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Order Type' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
  }

  async expectItemToolbarVisible() {
    await expect(this.iconButton(this.itemPanel, 'file_upload')).toBeVisible();
    await expect(this.iconButton(this.itemPanel, 'file_download')).toBeVisible();
    await expect(this.iconButton(this.itemPanel, 'add')).toBeVisible();
    await expect(this.iconButton(this.itemPanel, 'search')).toBeVisible();
    await expect(this.page.getByText('Select Menu Category', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Select Status', { exact: true })).toBeVisible();
    await expect(this.searchBox(this.itemPanel)).toBeVisible();
  }

  async expectItemRowsVisible() {
    await expect(this.page.getByText('Cheetos Fries', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Chicken Nuggets', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Approved', { exact: true }).first()).toBeVisible();
    await expect(this.page.getByText(/DELIVERY|BOTH/).first()).toBeVisible();
    await expect(this.page.getByText(/Total\s+\d+\s+results found/)).toBeVisible();
  }

  async expectItemActionsVisible() {
    await expect(this.iconButton(this.itemPanel, 'remove_red_eye').first()).toBeVisible();
    await expect(this.iconButton(this.itemPanel, 'edit').first()).toBeVisible();
    await expect(this.iconButton(this.itemPanel, 'delete').first()).toBeVisible();
  }

  async openAddItemForm() {
    await this.visibleIconButton('add').first().click();
    await expect(this.page.getByText('Add Menu Item', { exact: true })).toBeVisible();
  }

  async openViewItemForm() {
    await this.iconButton(this.itemPanel, 'remove_red_eye').first().click();
    await expect(this.page.getByText(/Customizations/).first()).toBeVisible();
  }

  async openEditItemForm() {
    await this.iconButton(this.itemPanel, 'edit').first().click();
    await expect(this.page.getByText(/Edit Menu Item|English Item Name/).first()).toBeVisible();
  }

  async openDeleteItemForm() {
    await this.iconButton(this.itemPanel, 'delete').first().click();
    await expect(this.actionButton('Delete')).toBeVisible();
  }

  async expectItemFormVisible(buttonName = 'Create') {
    await expect(this.fieldByPlaceholder('Enter English Menu Item Name')).toBeVisible();
    await expect(this.fieldByPlaceholder('Enter Arabic Menu Item Name')).toBeVisible();
    await expect(this.fieldByPlaceholder('Enter Sku')).toBeVisible();
    await expect(this.fieldByPlaceholder('Enter Selling price')).toBeVisible();
    await expect(this.page.getByText('Menu Categories', { exact: false }).last()).toBeVisible();
    await expect(this.page.getByText('Order Type', { exact: true }).last()).toBeVisible();
    await expect(this.page.getByText('Add Choice(s)', { exact: true })).toBeVisible();
    await expect(this.visibleIconButton('add').last()).toBeVisible();
    await expect(this.actionButton(buttonName)).toBeVisible();
    await expect(this.actionButton('Cancel')).toBeVisible();
  }

  async expectItemCustomizationViewVisible() {
    await expect(this.page.getByText(/Cheetos Fries - Customizations/)).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Index' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'English Name' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Arabic Name' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Required' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Type', exact: true })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Customizations' })).toBeVisible();
  }

  async fillItemForm(item) {
    await this.fieldByPlaceholder('Enter English Menu Item Name').fill(item.englishName);
    await this.fieldByPlaceholder('Enter Arabic Menu Item Name').fill(item.arabicName);
    await this.textArea(0).fill(item.englishDescription);
    await this.textArea(1).fill(item.arabicDescription);
    await this.fieldByPlaceholder('Enter Sku').fill(item.sku);
    await this.fieldByPlaceholder('Enter Selling price').fill(item.price);
    await this.selectMaterialOptionByLabel('Menu Categories', item.category);
    await this.selectMaterialOptionByLabel('Order Type', item.orderType, true);
  }

  async createMenuItem(item) {
    await this.openItemManagement();
    await this.openAddItemForm();
    await this.fillItemForm(item);
    await this.actionButton('Create').click();
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  }

  async deleteVisibleMenuItem() {
    await this.openDeleteItemForm();
    await this.actionButton('Delete').click();
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});

    const confirmDelete = this.actionButton('Delete');
    if (await confirmDelete.isVisible().catch(() => false)) {
      await confirmDelete.click();
      await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    }
  }

  async searchItem(itemName) {
    await this.searchBox(this.itemPanel).fill(itemName);
    await this.iconButton(this.itemPanel, 'search').click();
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async expectPaginationVisible() {
    await expect(this.page.getByText('Prev')).toBeVisible();
    await expect(this.page.getByText("You're on page")).toBeVisible();
    await expect(this.page.getByText('Next')).toBeVisible();
  }
}
