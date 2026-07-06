import { expect } from '@playwright/test';
import { vendorPortal } from '../data/vendorPortalData.js';
import { BasePage } from './BasePage.js';

export class VendorPerformancePage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /^Vendor Performance$/ });
    this.monthButton = page.getByRole('button', { name: /^Month$/i });
    this.weekButton = page.getByRole('button', { name: /^Week$/i });
    this.todayButton = page.getByRole('button', { name: /^Today$/i });
    this.startDateInput = page.locator('input[placeholder*="Start Date"]');
    this.endDateInput = page.locator('input[placeholder*="End Date"]');
    this.storeSelector = page.getByText('Select a store').first();
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.orderPerformanceTable = page.getByText('Order Performance').locator('..');
  }

  async goto() {
    await super.goto(vendorPortal.routes.vendorPerformance);
    await this.ensureVendorPerformanceReady();
  }

  async openFromSidebar() {
    await this.openMenuItem('Vendor Performance');
    await this.ensureVendorPerformanceReady();
  }

  async ensureVendorPerformanceReady() {
    for (let attempt = 1; attempt <= 3; attempt++) {
      if (await this.heading.isVisible().catch(() => false)) {
        return;
      }

      await this.page
        .goto(vendorPortal.routes.vendorPerformance, { waitUntil: 'domcontentloaded', timeout: 20000 })
        .catch(() => {});
      await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});

      if (await this.heading.isVisible().catch(() => false)) {
        return;
      }

      const shellReady = await this.portalTitle
        .waitFor({ state: 'visible', timeout: 5000 })
        .then(() => true)
        .catch(() => false);

      if (shellReady) {
        await this.openMenuItem('Vendor Performance').catch(() => {});
      }

      if (await this.heading.isVisible().catch(() => false)) {
        return;
      }

      if (attempt < 3) {
        await this.page.reload({ waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
      }
    }

    await expect(this.heading).toBeVisible({ timeout: 30000 });
  }

  async expectLoaded() {
    await this.expectShellLoaded();
    await this.expectUrlContains('/#/home/vendor/performance');
    await expect(this.heading).toBeVisible();
    await expect(this.page.getByText('Successful Orders')).toBeVisible();
    await expect(this.page.getByText('Failed Orders')).toBeVisible();
  }

  async expectVendorPerformanceUrl() {
    await this.expectUrlContains('/#/home/vendor/performance');
  }

  async expectHeadingVisible() {
    await expect(this.heading).toBeVisible();
  }

  async expectFilterControlsVisible() {
    await expect(this.monthButton).toBeVisible();
    await expect(this.weekButton).toBeVisible();
    await expect(this.todayButton).toBeVisible();
    await expect(this.page.getByText('Select a date range')).toBeVisible();
    await expect(this.startDateInput).toBeVisible();
    await expect(this.endDateInput).toBeVisible();
    await expect(this.storeSelector).toBeVisible();
    await expect(this.searchButton).toBeVisible();
  }

  async selectPeriod(period) {
    const periodButton = this.page.getByRole('button', { name: new RegExp(`^${period}$`, 'i') });

    await expect(periodButton).toBeVisible();
    await periodButton.click({ force: true });
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async searchPerformance() {
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async expectOrderSummaryCardsVisible() {
    await expect(this.page.getByText('Successful Orders')).toBeVisible();
    await expect(this.page.getByText('Failed Orders')).toBeVisible();
    await expect(this.page.getByText('Loss Due to Cancellation')).toBeVisible();
    await expect(this.page.getByText(/Order\(s\)/).first()).toBeVisible();
    await expect(this.page.getByText(/OMR/).first()).toBeVisible();
    await expect(this.page.getByText(/Compared to (Yesterday|Last Week|Last Month)/).first()).toBeVisible();
  }

  async expectCancellationReasonsVisible() {
    await expect(this.page.getByText('Top Cancellation Reasons')).toBeVisible();
    await expect(this.page.getByRole('cell', { name: 'Reason' })).toBeVisible();
    await expect(this.page.getByRole('cell', { name: 'Count' }).first()).toBeVisible();
  }

  async expectCustomerMetricsVisible() {
    await expect(this.page.getByText('Customers', { exact: true })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Returning Customers' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Regained Customers' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'New Customers' })).toBeVisible();
    await expect(this.page.getByText(/%/).first()).toBeVisible();
  }

  async expectOperationalMetricsVisible() {
    await expect(this.page.getByText('Average Response Time')).toBeVisible();
    await expect(this.page.getByText('Average Order Acceptance Time')).toBeVisible();
    await expect(this.page.getByRole('heading', { name: /Vendor Delay/ })).toBeVisible();
    await expect(this.page.getByText('Average Delay Time')).toBeVisible();
    await expect(this.page.getByText(/MIN/).first()).toBeVisible();
  }

  async expectOrderHealthVisible() {
    await expect(this.page.getByText('Order Health')).toBeVisible();
    await expect(this.page.getByText('Excellent').first()).toBeVisible();
    await expect(this.page.getByText('Good').first()).toBeVisible();
    await expect(this.page.getByText('Poor').first()).toBeVisible();
  }

  async expectTopSellingSectionsVisible() {
    await expect(this.page.getByRole('heading', { name: /Top Selling Items/ })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: /Top Selling Areas/ })).toBeVisible();
    await expect(this.page.getByRole('cell', { name: 'Item' })).toBeVisible();
    await expect(this.page.getByRole('cell', { name: 'Count' }).first()).toBeVisible();
    await expect(this.page.getByText(vendorPortal.vendorName).first()).toBeVisible();
  }

  async expectDownloadActionsVisible() {
    await expect(this.page.getByText('Download SVG').first()).toBeVisible();
    await expect(this.page.getByText('Download PNG').first()).toBeVisible();
    await expect(this.page.getByText('Download CSV').first()).toBeVisible();
  }

  async expectOrderPerformanceTableVisible() {
    await expect(this.page.getByText('Order Performance').first()).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Branch Name' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Date/Time' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Order ID' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Payment Method' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Amount' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Vendor Response Time' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Vendor Delay' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Vendor Performance' })).toBeVisible();
  }

  async expectPaginationVisible() {
    await expect(this.page.getByText('Prev')).toBeVisible();
    await expect(this.page.getByText("You're on page")).toBeVisible();
    await expect(this.page.getByText('Next')).toBeVisible();
  }
}
