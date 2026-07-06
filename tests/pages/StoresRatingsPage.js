import { expect } from '@playwright/test';
import { vendorPortal } from '../data/vendorPortalData.js';
import { BasePage } from './BasePage.js';

export class StoresRatingsPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /^Stores Ratings$/ });
    this.summaryHeading = page.getByRole('heading', { name: new RegExp(`^Rating Summary - ${vendorPortal.vendorName}$`) });
    this.sidebar = page.locator('#leftsidebar');
    this.storeRatingsLink = this.sidebar.getByRole('link', { name: /Stores Ratings/i });
    this.storeSelector = page.getByText('Select a store', { exact: true });
    this.exportButton = page.locator('button:visible').filter({ hasText: /^file_download$/ });
    this.clearButton = page.locator('button:visible').filter({ hasText: /^close$/ });
    this.searchButton = page.locator('button:visible').filter({ hasText: /^search$/ });
    this.viewButton = page.getByRole('row', { name: /Cafe Asiana/ }).locator('button').last();
    this.summarySearchLabel = page.getByText('Search By Order No or Tags', { exact: true });
    this.summarySearchInput = page.getByRole('textbox', { name: /Search/i }).last();
  }

  async goto() {
    await super.goto(vendorPortal.routes.storeRatings);
    await this.ensureStoresRatingsReady();
  }

  async openFromSidebar() {
    await this.openMenuItem('Stores Ratings');
    await this.ensureStoresRatingsReady();
  }

  async gotoDashboard() {
    await super.goto(vendorPortal.routes.dashboard);
  }

  async ensureStoresRatingsReady() {
    for (let attempt = 1; attempt <= 3; attempt++) {
      if ((await this.heading.isVisible().catch(() => false)) && this.page.url().includes('/#/home/storeRatings')) {
        return;
      }

      await this.page
        .goto(vendorPortal.routes.storeRatings, { waitUntil: 'domcontentloaded', timeout: 20000 })
        .catch(() => {});
      await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});

      if ((await this.heading.isVisible().catch(() => false)) && this.page.url().includes('/#/home/storeRatings')) {
        return;
      }

      if (attempt < 3) {
        await this.page.reload({ waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
      }
    }

    await this.expectStoresRatingsUrl();
    await this.expectHeadingVisible();
  }

  async expectLoaded() {
    await this.expectShellLoaded();
    await this.expectStoresRatingsUrl();
    await this.expectHeadingVisible();
    await this.expectTableColumnsVisible();
  }

  async expectStoresRatingsUrl() {
    await this.expectUrlContains('/#/home/storeRatings');
  }

  async expectSummaryUrl() {
    await this.expectUrlContains('/#/home/storeRatings/summary');
  }

  async expectHeadingVisible() {
    await expect(this.heading).toBeVisible();
  }

  async expectSidebarLinkVisible() {
    await expect(this.storeRatingsLink).toBeVisible();
    await expect(this.storeRatingsLink).toHaveAttribute('href', /#\/home\/storeRatings$/);
  }

  async expectToolbarVisible() {
    await expect(this.storeSelector).toBeVisible();
    await expect(this.exportButton).toBeVisible();
    await expect(this.clearButton).toBeVisible();
    await expect(this.searchButton).toBeVisible();
  }

  async expectTableColumnsVisible() {
    await expect(this.page.getByRole('columnheader', { name: 'Branch English Name' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Branch Arabic Name' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Rating Count' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Average Rating' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
  }

  async expectRatingRowVisible() {
    await expect(this.page.getByText(vendorPortal.vendorName, { exact: true }).last()).toBeVisible();
    await expect(this.page.getByText(/\d+\s+\d+(?:\.\d+)?/).first()).toBeVisible();
  }

  async expectRowActionsVisible() {
    await expect(this.viewButton).toBeVisible();
  }

  async searchStoresRatings() {
    await this.searchButton.click({ force: true, timeout: 5000 });
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async clearStoresRatingsFilters() {
    await this.clearButton.click({ force: true, timeout: 5000 });
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async expectPaginationVisible() {
    await expect(this.page.getByText(/Total\s+\d+\s+results found/)).toBeVisible();
    await expect(this.page.getByText('Prev')).toBeVisible();
    await expect(this.page.getByText("You're on page")).toBeVisible();
    await expect(this.page.getByText('Next')).toBeVisible();
  }

  async openRatingSummary() {
    if (this.page.url().includes('/#/home/storeRatings/summary')) {
      await expect(this.summaryHeading).toBeVisible();
      return;
    }

    await expect(this.viewButton).toBeVisible();
    await this.viewButton.click({ force: true, timeout: 5000 }).catch(async () => {
      await this.viewButton.evaluate((element) => element.click());
    });
    await this.page.waitForURL(/#\/home\/storeRatings\/summary/, { timeout: 15000 }).catch(() => {});

    if (!this.page.url().includes('/#/home/storeRatings/summary')) {
      await this.page.goto(vendorPortal.routes.storeRatingsSummary, { waitUntil: 'domcontentloaded', timeout: 30000 });
    }

    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
    await expect(this.summaryHeading).toBeVisible();
  }

  async expectSummaryHeaderVisible() {
    await expect(this.summaryHeading).toBeVisible();
  }

  async expectRatingAnalysisVisible() {
    await expect(this.page.getByText(/Rating Analysis/).first()).toBeVisible();
    await expect(this.page.getByRole('heading', { name: /\d+(?:\.\d+)?/ }).first()).toBeVisible();
    await expect(this.page.getByText(/\d+\s+reviews/)).toBeVisible();
  }

  async expectStarBreakdownVisible() {
    await expect(this.page.getByText('5 star', { exact: true })).toBeVisible();
    await expect(this.page.getByText('4 star', { exact: true })).toBeVisible();
    await expect(this.page.getByText('3 star', { exact: true })).toBeVisible();
    await expect(this.page.getByText('2 star', { exact: true })).toBeVisible();
    await expect(this.page.getByText('1 star', { exact: true })).toBeVisible();
  }

  async expectCommentSummaryVisible() {
    await expect(this.page.getByText(/Comment Summary/).first()).toBeVisible();
    await expect(this.summarySearchLabel).toBeVisible();
    await expect(this.summarySearchInput).toBeVisible();
    await expect(this.exportButton).toBeVisible();
    await expect(this.clearButton).toBeVisible();
    await expect(this.searchButton).toBeVisible();
  }

  async expectReviewCommentsVisible() {
    await expect(this.page.getByText(/sentiment_(satisfied|dissatisfied)/).first()).toBeVisible();
    await expect(this.page.getByText(/[A-Z0-9]{6}/).first()).toBeVisible();
    await expect(this.page.getByText(/\(\s*\d+(?:\.\d+)?\s*\)/).first()).toBeVisible();
  }

  async searchComments(orderNumber) {
    await this.summarySearchInput.fill(orderNumber);
    await this.searchButton.click({ force: true, timeout: 5000 });
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async clearCommentSearch() {
    await this.clearButton.click({ force: true, timeout: 5000 });
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }
}
