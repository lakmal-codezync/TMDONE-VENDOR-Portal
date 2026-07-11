import { expect } from '@playwright/test';
import { vendorPortal } from '../data/vendorPortalData.js';
import { BasePage } from './BasePage.js';

export class SmartBoostCampaignPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /^Smart Boost Campaigns$/ });
    this.sidebar = page.locator('#leftsidebar');
    this.sidebarLink = this.sidebar.getByRole('link', { name: /Smart Boost Campaign/i });
    this.createCampaignButton = page.getByRole('button', { name: /Create Campaign/i });
    this.searchInput = page.locator('input[formcontrolname="searchTerm"]');
    this.startDateInput = page.locator('input[placeholder="Start Date"]');
    this.endDateInput = page.locator('input[placeholder="End Date"]');
    this.searchButton = page.locator('button:visible').filter({ hasText: /^search$/ }).first();
    this.clearButton = page.locator('button:visible').filter({ hasText: /^clear$/ }).first();
    this.rowActionsButton = page.getByText('more_horiz', { exact: true }).first();
    this.addCampaignHeading = page.getByRole('heading', { name: /^(Add|Create) Smart Boost Campaign$/ }).last();
    this.emptyState = page.getByText(/No campaigns found/i);
    this.createFormStoreLabel = page.getByText('Store *', { exact: true }).last();
    this.createFormStartDate = page.locator('input[formcontrolname="startDate"]').last();
    this.createFormBudget = page.locator('input[formcontrolname="initialBudget"]').last();
    this.createFormCpc = page.locator('input[formcontrolname="cpcAmount"]').last();
    this.draftButton = page.getByRole('button', { name: /^Draft$/ }).last();
    this.createButton = page.getByRole('button', { name: /^Create$/ }).last();
  }

  routeUrl(route) {
    return `${process.env.VENDOR_PORTAL_BASE_URL || 'https://partner.demo.dr.tmd1.org'}${route}`;
  }

  async goto() {
    await this.page
      .goto(this.routeUrl(vendorPortal.routes.smartBoostCampaign), { waitUntil: 'commit', timeout: 60000 })
      .catch(() => {});
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
    await this.ensureSmartBoostCampaignReady();
  }

  async openFromSidebar() {
    await this.openMenuItem('Smart Boost Campaign');
    await this.ensureSmartBoostCampaignReady();
  }

  async gotoDashboard() {
    await this.page.goto(this.routeUrl(vendorPortal.routes.dashboard), { waitUntil: 'commit', timeout: 60000 }).catch(() => {});
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async ensureSmartBoostCampaignReady() {
    for (let attempt = 1; attempt <= 3; attempt++) {
      const ready = await this.heading
        .waitFor({ state: 'visible', timeout: 6000 })
        .then(() => true)
        .catch(() => false);

      if (ready && this.page.url().includes('/#/home/smart-boost-campaign')) {
        return;
      }

      await this.page
        .goto(this.routeUrl(vendorPortal.routes.smartBoostCampaign), { waitUntil: 'domcontentloaded', timeout: 30000 })
        .catch(() => {});
      await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});

      const shellReady = await this.portalTitle
        .waitFor({ state: 'visible', timeout: 3000 })
        .then(() => true)
        .catch(() => false);

      if (shellReady && !(await this.heading.isVisible().catch(() => false))) {
        await this.sidebarLink.click({ force: true, timeout: 5000 }).catch(async () => {
          await this.sidebarLink.evaluate((element) => element.click()).catch(() => {});
        });
        await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
      }
    }

    await this.expectUrlContains('/#/home/smart-boost-campaign');
    await expect(this.heading).toBeVisible();
  }

  async expectLoaded() {
    await this.expectShellLoaded();
    await this.expectSmartBoostCampaignUrl();
    await expect(this.heading).toBeVisible();
    await expect(this.createCampaignButton).toBeVisible();
    await this.expectTableColumnsVisible();
  }

  async expectSmartBoostCampaignUrl() {
    await this.expectUrlContains('/#/home/smart-boost-campaign');
  }

  async expectSidebarLinkVisible() {
    await expect(this.sidebarLink).toBeVisible();
    await expect(this.sidebarLink).toHaveAttribute('href', /#\/home\/smart-boost-campaign(?:\/list)?$/);
  }

  async expectToolbarVisible() {
    await expect(this.createCampaignButton).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.page.locator('mat-label').filter({ hasText: /^Search$/ }).first()).toBeVisible();
    await expect(this.page.locator('mat-label').filter({ hasText: /^Status$/ }).first()).toBeVisible();
    await expect(this.page.locator('mat-label').filter({ hasText: /^Store$/ }).first()).toBeVisible();
    await expect(this.page.locator('mat-label').filter({ hasText: /^Select a date range$/ }).first()).toBeVisible();
    await expect(this.startDateInput).toBeVisible();
    await expect(this.endDateInput).toBeVisible();
    await expect(this.searchButton).toBeVisible();
    await expect(this.clearButton).toBeVisible();
  }

  async expectTableColumnsVisible() {
    await expect(this.page.getByRole('columnheader', { name: 'Campaign Code' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Store' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'CPC Value (OMR)' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Total Budget (OMR)' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Remaining Budget (OMR)' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Start Date' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Pending Termination Request' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
  }

  async expectCampaignRowsVisible() {
    if (await this.emptyState.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(this.emptyState).toBeVisible();
      return;
    }

    await expect(this.page.getByText(vendorPortal.vendorName, { exact: true }).last()).toBeVisible();
    await expect(this.page.getByText(/\d+\.\d{3}/).first()).toBeVisible();
    await expect(this.page.getByText(/ACTIVE|INACTIVE|DRAFT|TERMINATED/i).first()).toBeVisible();
    await expect(this.rowActionsButton).toBeVisible();
  }

  async expectPaginationVisible() {
    if (await this.emptyState.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(this.emptyState).toBeVisible();
      return;
    }

    await expect(this.page.getByText(/Total\s+\d+\s+results found/)).toBeVisible();
    await expect(this.page.getByText('Prev')).toBeVisible();
    await expect(this.page.getByText("You're on page")).toBeVisible();
    await expect(this.page.getByText('Next')).toBeVisible();
  }

  async searchCampaigns(term = vendorPortal.vendorName) {
    await this.searchInput.fill(term);
    await this.searchButton.click({ force: true, timeout: 5000 });
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async clearFilters() {
    await this.clearButton.click({ force: true, timeout: 5000 });
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async openCreateCampaignForm() {
    await expect(this.createCampaignButton).toBeVisible();
    await this.createCampaignButton.click({ force: true, timeout: 5000 }).catch(async () => {
      await this.createCampaignButton.evaluate((element) => element.click());
    });
    await expect(this.addCampaignHeading).toBeVisible({ timeout: 20000 });
  }

  async expectCreateCampaignFormVisible() {
    await expect(this.addCampaignHeading).toBeVisible();
    await expect(this.createFormStoreLabel).toBeVisible();
    await expect(this.page.getByText('Start Date *', { exact: true }).first()).toBeVisible();
    await expect(this.page.getByText('Budget *', { exact: true }).first()).toBeVisible();
    await expect(this.page.getByText('CPC Amount *', { exact: true }).first()).toBeVisible();
    await expect(this.createFormStartDate).toBeVisible();
    await expect(this.createFormBudget).toBeVisible();
    await expect(this.createFormCpc).toBeVisible();
    await expect(this.draftButton).toBeVisible();
    await expect(this.createButton).toBeVisible();
  }

  async fillCreateCampaignAmounts() {
    await this.createFormBudget.fill('40');
    await expect(this.createFormBudget).toHaveValue('40');
    await expect(this.createFormCpc).toHaveValue(/\d+(?:\.\d+)?/);
    await expect(this.createFormCpc).toBeDisabled();
  }

  async closeCreateCampaignForm() {
    await this.page.getByText('close', { exact: true }).last().click({ force: true, timeout: 5000 }).catch(async () => {
      await this.page.keyboard.press('Escape');
    });
    await expect(this.addCampaignHeading).toBeHidden({ timeout: 5000 }).catch(() => {});
  }

  async openRowActions() {
    if (await this.emptyState.isVisible({ timeout: 1000 }).catch(() => false)) {
      return;
    }

    await expect(this.rowActionsButton).toBeVisible();
    await this.rowActionsButton.click({ force: true, timeout: 5000 });
  }

  async expectActionMenuVisible() {
    if (await this.emptyState.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(this.emptyState).toBeVisible();
      return;
    }

    await expect(this.page.getByRole('menuitem', { name: /Manage Campaign/i })).toBeVisible();
    await expect(this.page.getByRole('menuitem', { name: /Dashboard/i })).toBeVisible();
    await expect(this.page.getByRole('menuitem', { name: /Terminate Request/i })).toBeVisible();
    await expect(this.page.getByRole('menuitem', { name: /Top-Up Budget/i })).toBeVisible();
  }

  async expectActionMenuItemsEnabled() {
    if (await this.emptyState.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(this.emptyState).toBeVisible();
      return;
    }

    await expect(this.page.getByRole('menuitem', { name: /Manage Campaign/i })).toBeEnabled();
    await expect(this.page.getByRole('menuitem', { name: /Dashboard/i })).toBeEnabled();
    await expect(this.page.getByRole('menuitem', { name: /Terminate Request/i })).toBeEnabled();
    await expect(this.page.getByRole('menuitem', { name: /Top-Up Budget/i })).toBeEnabled();
  }
}
