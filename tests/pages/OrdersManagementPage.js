import { expect } from '@playwright/test';
import { vendorPortal } from '../data/vendorPortalData.js';
import { BasePage } from './BasePage.js';

export class OrdersManagementPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /^Orders$/ });
    this.audioPermissionDialog = page.getByRole('dialog', { name: /Audio Permission/i });
    this.audioPermissionDenyButton = page.getByRole('button', { name: /^Deny$/i });
    this.sidebar = page.locator('#leftsidebar');
    this.orderManagementLink = this.sidebar.getByRole('link', { name: /Order Management/i });
    this.searchLabel = page.getByText('Search...', { exact: true });
    this.searchInput = page.locator('mat-form-field').filter({ hasText: 'Search...' }).locator('input');
    this.storeSelector = page.getByText('Select a store', { exact: true });
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.newOrdersTab = page.getByRole('tab', { name: /^New Orders$/ });
    this.ongoingOrdersTab = page.getByRole('tab', { name: /^Ongoing Orders$/ });
    this.completedOrdersTab = page.getByRole('tab', { name: /^Completed Orders$/ });
    this.cancelledOrdersTab = page.getByRole('tab', { name: /^Cancelled Orders$/ });
  }

  async goto() {
    await this.page.goto(vendorPortal.routes.ordersManagement, { waitUntil: 'commit', timeout: 60000 }).catch(() => {});
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
    await this.ensureOrdersManagementReady();
    await this.page.waitForTimeout(500);
    await this.dismissAudioPermissionIfVisible();
  }

  async gotoDashboard() {
    await this.page.goto(vendorPortal.routes.dashboard, { waitUntil: 'commit', timeout: 60000 }).catch(() => {});
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async openFromSidebar() {
    await this.openMenuItem('Order Management');
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
    await this.dismissAudioPermissionIfVisible();
  }

  async ensureOrdersManagementReady() {
    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.dismissAudioPermissionIfVisible();

      const ordersReady = await this.heading
        .waitFor({ state: 'visible', timeout: 10000 })
        .then(() => true)
        .catch(() => false);

      if (ordersReady && this.page.url().includes('/#/home/orders')) {
        return;
      }

      await this.page
        .goto(vendorPortal.routes.ordersManagement, { waitUntil: 'domcontentloaded', timeout: 20000 })
        .catch(() => {});
      await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
      await this.dismissAudioPermissionIfVisible();

      if ((await this.heading.isVisible().catch(() => false)) && this.page.url().includes('/#/home/orders')) {
        return;
      }

      if (attempt < 3) {
        await this.page.reload({ waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
      }
    }

    await this.expectOrdersManagementUrl();
    await this.expectHeadingVisible();
  }

  async dismissAudioPermissionIfVisible() {
    if (await this.audioPermissionDialog.isVisible({ timeout: 1000 }).catch(() => false)) {
      await this.audioPermissionDenyButton.click({ force: true });
      await expect(this.audioPermissionDialog).toBeHidden({ timeout: 5000 });
    }
  }

  async expectOrdersManagementUrl() {
    await this.expectUrlContains('/#/home/orders');
  }

  async expectHeadingVisible() {
    await this.dismissAudioPermissionIfVisible();
    await expect(this.heading).toBeVisible();
  }

  async expectSidebarLinkVisible() {
    await expect(this.orderManagementLink).toBeVisible();
    await expect(this.orderManagementLink).toHaveAttribute('href', /#\/home\/orders$/);
  }

  async expectOrderStatusCardsVisible() {
    await this.dismissAudioPermissionIfVisible();
    await expect(this.page.getByText(/New\s+Orders/).first()).toBeVisible();
    await expect(this.page.getByText(/Preparing/).first()).toBeVisible();
    await expect(this.page.getByText(/Out\s+for\s+Delivery/).first()).toBeVisible();
    await expect(this.page.getByText(/Completed\s+Orders/).first()).toBeVisible();
  }

  async expectFiltersVisible() {
    await expect(this.searchLabel).toBeVisible();
    await expect(this.searchInput).toBeAttached();
    await expect(this.storeSelector).toBeVisible();
    await expect(this.searchButton).toBeVisible();
  }

  async expectTabsVisible() {
    await expect(this.newOrdersTab).toBeVisible();
    await expect(this.ongoingOrdersTab).toBeVisible();
    await expect(this.completedOrdersTab).toBeVisible();
    await expect(this.cancelledOrdersTab).toBeVisible();
  }

  async openOrdersTab(tabName) {
    await this.page.getByRole('tab', { name: new RegExp(`^${tabName}$`, 'i') }).click({ force: true });
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async searchOrdersManagement(searchText = '') {
    await this.searchInput.fill(searchText);
    await this.searchButton.click({ force: true, timeout: 5000 });
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async expectTableColumnsVisible() {
    await expect(this.page.getByRole('columnheader', { name: 'Branch Name' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Delivery Zone' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Order ID' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Payment Method' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Amount', exact: true })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Amount To Be Collected' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
  }

  async expectResultsSummaryVisible() {
    await expect(this.page.getByText(/Total\s+\d+\s+results found/)).toBeVisible();
  }

  async expectPaginationVisible() {
    await expect(this.page.getByText('Prev')).toBeVisible();
    await expect(this.page.getByText("You're on page")).toBeVisible();
    await expect(this.page.getByText('Next')).toBeVisible();
  }

  async expectEmptyOrRowsVisible() {
    await expect(this.page.getByText(/Total\s+\d+\s+results found/)).toBeVisible();
  }
}
