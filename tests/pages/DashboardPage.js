import { expect } from '@playwright/test';
import { vendorPortal } from '../data/vendorPortalData.js';
import { BasePage } from './BasePage.js';

export class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByText(/^Dashboard$/);
    this.comparisonSection = page.getByText('Comparison').locator('..');
    this.monthButton = page.getByRole('button', { name: /^Month$/i });
    this.weekButton = page.getByRole('button', { name: /^Week$/i });
    this.todayButton = page.getByRole('button', { name: /^Today$/i });
    this.startDateInput = page.locator('input[placeholder*="Start Date"]');
    this.endDateInput = page.locator('input[placeholder*="End Date"]');
    this.storeSelector = page.getByText('Select a store').first();
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.ordersHeading = page.getByRole('heading', { name: /Orders/ }).first();
    this.salesHeading = page.getByRole('heading', { name: /Sales/ }).first();
    this.branchesHeading = page.getByRole('heading', { name: /Branches/ }).first();
    this.ordersChartLabel = page.getByRole('heading', { name: /Orders/ }).last();
    this.salesChartLabel = page.getByRole('heading', { name: /Sales/ }).last();
    this.sidebar = page.locator('#leftsidebar');
    this.signOutLink = this.sidebar.getByText('Sign Out');
  }

  async goto() {
    await super.goto(vendorPortal.routes.dashboard);
    await this.ensureDashboardReady();
  }

  async openFromSidebar() {
    await this.ensureDashboardReady();
  }

  async ensureDashboardReady() {
    for (let attempt = 1; attempt <= 3; attempt++) {
      if (await this.heading.isVisible().catch(() => false)) {
        return;
      }

      await this.page
        .goto(vendorPortal.routes.dashboard, { waitUntil: 'domcontentloaded', timeout: 20000 })
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
        await this.openMenuItem('Dashboard').catch(() => {});
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
    await this.expectUrlContains('/#/home/dashboard');
    await expect(this.page.getByText(/^Dashboard$/)).toBeVisible();
    await expect(this.page.getByText('Orders').first()).toBeVisible();
    await expect(this.page.getByText('Sales').first()).toBeVisible();
    await expect(this.page.getByText('Branches').first()).toBeVisible();
  }

  async expectDashboardUrl() {
    await this.expectUrlContains('/#/home/dashboard');
  }

  async expectHeadingVisible() {
    await expect(this.heading).toBeVisible();
  }

  async expectNavigationShellVisible() {
    await this.expectShellLoaded();
    await expect(this.sidebar.getByText('Dashboard')).toBeVisible();
    await expect(this.sidebar.getByText('Vendor Performance')).toBeVisible();
    await expect(this.sidebar.getByText('Branch(s) Details')).toBeVisible();
    await expect(this.sidebar.getByText('Menu Management')).toBeVisible();
    await expect(this.sidebar.getByText('Stores Ratings')).toBeVisible();
    await expect(this.sidebar.getByText('Reports')).toBeVisible();
    await expect(this.sidebar.getByText('Smart Boost Campaign')).toBeVisible();
  }

  async expectComparisonControlsVisible() {
    await expect(this.page.getByText('Comparison')).toBeVisible();
    await expect(this.monthButton).toBeVisible();
    await expect(this.weekButton).toBeVisible();
    await expect(this.todayButton).toBeVisible();
  }

  async selectComparisonPeriod(period) {
    await this.page.getByRole('button', { name: new RegExp(`^${period}$`, 'i') }).click();
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async expectDateRangeFilterVisible() {
    await expect(this.page.getByText('Select a date range')).toBeVisible();
    await expect(this.startDateInput).toBeVisible();
    await expect(this.endDateInput).toBeVisible();
  }

  async expectStoreFilterVisible() {
    await expect(this.storeSelector).toBeVisible();
    await expect(this.searchButton).toBeVisible();
  }

  async searchDashboard() {
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async expectOrdersSummaryVisible() {
    await expect(this.ordersHeading).toBeVisible();
    await expect(this.page.getByRole('heading', { name: /^(Today|Current Week|Current Month)$/ }).first()).toBeVisible();
    await expect(this.page.getByRole('heading', { name: /^(Yesterday|Last Week|Last Month)$/ }).first()).toBeVisible();
    await expect(this.page.getByRole('heading', { name: /\d+\s+Order\(s\)/ }).first()).toBeVisible();
    await expect(this.page.getByText(/Compared to (Yesterday|Last Week|Last Month)/).first()).toBeVisible();
  }

  async expectSalesSummaryVisible() {
    await expect(this.salesHeading).toBeVisible();
    await expect(this.page.getByRole('heading', { name: /^(Today|Current Week|Current Month)$/ }).first()).toBeVisible();
    await expect(this.page.getByRole('heading', { name: /^(Yesterday|Last Week|Last Month)$/ }).first()).toBeVisible();
    await expect(this.page.getByRole('heading', { name: /\d+(?:\.\d+)?\s+OMR/ }).first()).toBeVisible();
    await expect(this.page.getByText(/Compared to (Yesterday|Last Week|Last Month)/).first()).toBeVisible();
  }

  async expectBranchesSummaryVisible() {
    await expect(this.branchesHeading).toBeVisible();
    await expect(this.page.getByText('OPENED', { exact: true })).toBeVisible();
    await expect(this.page.getByText('BUSY', { exact: true })).toBeVisible();
    await expect(this.page.getByText('CLOSED', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Opened Stores')).toBeVisible();
    await expect(this.page.getByText('Busy Stores')).toBeVisible();
    await expect(this.page.getByText('Closed Stores')).toBeVisible();
  }

  async expectChartLabelsVisible() {
    await expect(this.ordersChartLabel).toBeVisible();
    await expect(this.salesChartLabel).toBeVisible();
  }

  async expectSignOutVisible() {
    await expect(this.signOutLink).toBeVisible();
  }
}
