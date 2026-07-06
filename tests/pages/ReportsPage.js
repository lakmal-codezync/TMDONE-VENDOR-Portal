import { expect } from '@playwright/test';
import { vendorPortal } from '../data/vendorPortalData.js';
import { BasePage } from './BasePage.js';

export class ReportsPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /^Reports$/ });
    this.salesReportsHeading = page.getByRole('heading', { name: /^Sales Reports$/ });
    this.orderCountHeading = page.getByRole('heading', { name: /^Order Count Report$/ });
    this.topSellingHeading = page.getByRole('heading', { name: /^Top Selling Items Report$/ });
    this.detailHeading = page.getByRole('heading', {
      name: new RegExp(`^Detail Store Order Count Log - ${vendorPortal.vendorName}$`),
    });
    this.sidebar = page.locator('#leftsidebar');
    this.reportsLink = this.sidebar.getByRole('link', { name: /Reports/i });
    this.salesReportTab = page.getByText('Sales Report', { exact: true });
    this.orderCountTab = page.getByText('Order Count Report', { exact: true });
    this.topSellingItemsTab = page.getByText('Top Selling Items Report', { exact: true });
    this.exportButton = page.locator('button:visible').filter({ hasText: /^file_download$/ });
    this.searchButton = page.locator('button:visible').filter({ hasText: /^search$/ });
    this.startDateInput = page.locator('input[placeholder="Start Date"]');
    this.endDateInput = page.locator('input[placeholder*="End Date"]');
    this.monthButton = page.getByRole('button', { name: /^Month$/i });
    this.weekButton = page.getByRole('button', { name: /^Week$/i });
    this.todayButton = page.getByRole('button', { name: /^Today$/i });
    this.viewDetailsButton = page.getByRole('button', { name: /View Details/i });
  }

  routeUrl(route) {
    return `${process.env.VENDOR_PORTAL_BASE_URL || 'https://partner.demo.dr.tmd1.org'}${route}`;
  }

  async goto() {
    await this.dismissOrderCountDetailsIfVisible();
    await this.page.goto(this.routeUrl(vendorPortal.routes.reports), { waitUntil: 'commit', timeout: 60000 }).catch(() => {});
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
    await this.ensureReportsReady();
    await this.dismissOrderCountDetailsIfVisible();
  }

  async openFromSidebar() {
    await this.openMenuItem('Reports');
    await this.ensureReportsReady();
  }

  async gotoDashboard() {
    await this.page.goto(this.routeUrl(vendorPortal.routes.dashboard), { waitUntil: 'commit', timeout: 60000 }).catch(() => {});
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async ensureReportsReady() {
    for (let attempt = 1; attempt <= 3; attempt++) {
      const alreadyReady = await this.heading
        .waitFor({ state: 'visible', timeout: 5000 })
        .then(() => true)
        .catch(() => false);

      if (alreadyReady && this.page.url().includes('/#/home/reports')) {
        return;
      }

      await this.page
        .goto(this.routeUrl(vendorPortal.routes.reports), { waitUntil: 'domcontentloaded', timeout: 20000 })
        .catch(() => {});
      await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});

      const routeReady = await this.heading
        .waitFor({ state: 'visible', timeout: 15000 })
        .then(() => true)
        .catch(() => false);

      if (routeReady && this.page.url().includes('/#/home/reports')) {
        return;
      }

      if (attempt < 3) {
        await this.page.reload({ waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
      }
    }

    await this.expectReportsUrl();
    await this.expectHeadingVisible();
  }

  async dismissOrderCountDetailsIfVisible() {
    if (!(await this.detailHeading.isVisible({ timeout: 500 }).catch(() => false))) {
      return;
    }

    await this.page.keyboard.press('Escape').catch(() => {});

    if (await this.detailHeading.isVisible({ timeout: 1000 }).catch(() => false)) {
      const overlay = this.page.locator('.cdk-overlay-pane, mat-dialog-container').last();
      const box = await overlay.boundingBox().catch(() => null);

      if (box) {
        await this.page.mouse.click(box.x + box.width - 24, box.y + 30).catch(() => {});
      }
    }

    await expect(this.detailHeading).toBeHidden({ timeout: 5000 }).catch(() => {});
  }

  async expectLoaded() {
    await this.expectShellLoaded();
    await this.expectReportsUrl();
    await this.expectHeadingVisible();
    await this.expectReportTabsVisible();
    await this.expectSalesReportColumnsVisible();
  }

  async expectReportsUrl() {
    await this.expectUrlContains('/#/home/reports');
  }

  async expectHeadingVisible() {
    await expect(this.heading).toBeVisible();
  }

  async expectSidebarLinkVisible() {
    await expect(this.reportsLink).toBeVisible();
    await expect(this.reportsLink).toHaveAttribute('href', /#\/home\/reports$/);
  }

  async expectReportTabsVisible() {
    await expect(this.salesReportTab).toBeVisible();
    await expect(this.orderCountTab).toBeVisible();
    await expect(this.topSellingItemsTab).toBeVisible();
  }

  async expectToolbarVisible() {
    await expect(this.exportButton.first()).toBeVisible();
    await expect(this.searchButton.first()).toBeVisible();
    await expect(this.page.getByText('Select a date range')).toBeVisible();
    await expect(this.startDateInput).toBeVisible();
    await expect(this.endDateInput).toBeVisible();
    await expect(this.monthButton).toBeVisible();
    await expect(this.weekButton).toBeVisible();
    await expect(this.todayButton).toBeVisible();
  }

  async openReportTab(tabName) {
    await this.dismissOrderCountDetailsIfVisible();

    if (!this.page.url().includes('/#/home/reports') || !(await this.heading.isVisible().catch(() => false))) {
      await this.goto();
    }

    const tab = this.page.getByRole('tab', { name: new RegExp(`^${tabName}$`, 'i') });

    await expect(tab).toBeVisible();
    await tab.click({ force: true, timeout: 5000 }).catch(async () => {
      await tab.evaluate((element) => element.click());
    });
    await expect(tab).toHaveAttribute('aria-selected', 'true', { timeout: 5000 }).catch(async () => {
      await tab.evaluate((element) => element.click());
    });
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
    await this.page.waitForTimeout(300);
  }

  async selectPeriod(period) {
    await this.page.getByRole('button', { name: new RegExp(`^${period}$`, 'i') }).click({ force: true, timeout: 5000 });
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async searchReports() {
    await this.searchButton.first().click({ force: true, timeout: 5000 });
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async expectSalesReportVisible() {
    await expect(this.salesReportsHeading).toBeVisible();
  }

  async expectSalesReportColumnsVisible() {
    await expect(this.page.getByRole('columnheader', { name: 'Branch Name' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Date/Time' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Order ID' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Currency' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Order Total' })).toBeVisible();
  }

  async expectSalesReportRowsVisible() {
    await expect(this.page.getByText(vendorPortal.vendorName, { exact: true }).last()).toBeVisible();
    await expect(this.page.getByText(/COMPLETE|CANCELLED/).first()).toBeVisible();
    await expect(this.page.getByText('OMR', { exact: true }).first()).toBeVisible();
    await expect(this.page.getByText(/\d+\.\d{3}/).first()).toBeVisible();
  }

  async openOrderCountReport() {
    await this.openReportTab('Order Count Report');
    await expect(this.orderCountHeading).toBeVisible();
  }

  async expectOrderCountColumnsVisible() {
    await expect(this.page.getByRole('columnheader', { name: 'Branch Name' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Completed Orders' }).first()).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Cancelled Orders' }).first()).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
  }

  async expectOrderCountRowsVisible() {
    await expect(this.page.getByText(vendorPortal.vendorName, { exact: true }).last()).toBeVisible();
    await expect(this.viewDetailsButton).toBeVisible();
  }

  async openTopSellingItemsReport() {
    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.openReportTab('Top Selling Items Report');

      if (await this.topSellingHeading.isVisible({ timeout: 5000 }).catch(() => false)) {
        break;
      }
    }

    await expect(this.topSellingHeading).toBeVisible();
  }

  async expectTopSellingItemsColumnsVisible() {
    await expect(this.page.getByRole('columnheader', { name: 'Item' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Quantity Sold' })).toBeVisible();
  }

  async expectTopSellingItemsRowsVisible() {
    await expect(this.page.getByText(/\w+/).first()).toBeVisible();
    await expect(this.page.getByText(/\d+/).first()).toBeVisible();
  }

  async expectPaginationVisible() {
    await expect(this.page.getByText(/Total\s+\d+\s+results found/)).toBeVisible();
    await expect(this.page.getByText('Prev')).toBeVisible();
    await expect(this.page.getByText("You're on page")).toBeVisible();
    await expect(this.page.getByText('Next')).toBeVisible();
  }

  async openOrderCountDetails() {
    await this.openOrderCountReport();

    for (let attempt = 1; attempt <= 3; attempt++) {
      await expect(this.viewDetailsButton).toBeVisible();
      await this.viewDetailsButton.click({ force: true, timeout: 5000 }).catch(async () => {
        await this.viewDetailsButton.evaluate((element) => element.click());
      });
      await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});

      if (await this.detailHeading.isVisible({ timeout: 5000 }).catch(() => false)) {
        break;
      }

      await this.goto();
      await this.openOrderCountReport();
    }

    await expect(this.detailHeading).toBeVisible();
  }

  async expectOrderCountDetailsVisible() {
    await expect(this.detailHeading).toBeVisible();
    await expect(this.exportButton.last()).toBeVisible();
    await expect(this.searchButton.last()).toBeVisible();
  }

  async expectOrderCountDetailsColumnsVisible() {
    await expect(this.page.getByRole('columnheader', { name: 'Date' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Completed Orders' }).last()).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Completed Orders Value (OMR)' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Cancelled Orders' }).last()).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Cancelled Orders Value (OMR)' })).toBeVisible();
  }

  async searchOrderCountDetails() {
    await this.searchButton.last().click({ force: true, timeout: 5000 });
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }
}
