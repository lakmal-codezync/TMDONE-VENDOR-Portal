import { expect } from '@playwright/test';
import { vendorPortal } from '../data/vendorPortalData.js';
import { BasePage } from './BasePage.js';

export class BranchDetailsPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.getByText('Manage Stores', { exact: true });
    this.openSummary = page.getByText('Open', { exact: true });
    this.busySummary = page.getByText('Busy', { exact: true });
    this.closedSummary = page.getByText('Closed', { exact: true });
    this.branchNameHeader = page.getByRole('columnheader', { name: 'Branch Name' });
    this.contactDetailsHeader = page.getByRole('columnheader', { name: 'Contact Details' });
    this.operationalHoursHeader = page.getByRole('columnheader', { name: 'Operational Hours' });
    this.statusHeader = page.getByRole('columnheader', { name: 'Status' });
    this.actionsHeader = page.getByRole('columnheader', { name: 'Actions' });
    this.branchNameCell = page.getByText(vendorPortal.vendorName, { exact: true }).last();
    this.onlineStatus = page.getByText('Online', { exact: true });
    this.editAction = page.getByText('edit', { exact: true });
    this.restoreAction = page.getByText('restore', { exact: true });
  }

  async goto() {
    await super.goto(vendorPortal.routes.branchDetails);
    await this.ensureBranchDetailsReady();
  }

  async gotoDashboard() {
    await super.goto(vendorPortal.routes.dashboard);
  }

  async openFromSidebar() {
    await this.openMenuItem('Branch\\(s\\) Details');
    await this.ensureBranchDetailsReady();
  }

  async ensureBranchDetailsReady() {
    for (let attempt = 1; attempt <= 3; attempt++) {
      if (await this.heading.isVisible().catch(() => false)) {
        return;
      }

      await this.page
        .goto(vendorPortal.routes.branchDetails, { waitUntil: 'domcontentloaded', timeout: 20000 })
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
        await this.openMenuItem('Branch\\(s\\) Details').catch(() => {});
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
    await this.expectBranchDetailsUrl();
    await this.expectHeadingVisible();
    await this.expectTableColumnsVisible();
  }

  async expectBranchDetailsUrl() {
    await this.expectUrlContains('/#/home/stores');
  }

  async expectHeadingVisible() {
    await expect(this.heading).toBeVisible();
  }

  async expectStoreSummaryVisible() {
    await expect(this.openSummary).toBeVisible();
    await expect(this.busySummary).toBeVisible();
    await expect(this.closedSummary).toBeVisible();
  }

  async expectTableColumnsVisible() {
    await expect(this.branchNameHeader).toBeVisible();
    await expect(this.contactDetailsHeader).toBeVisible();
    await expect(this.operationalHoursHeader).toBeVisible();
    await expect(this.statusHeader).toBeVisible();
    await expect(this.actionsHeader).toBeVisible();
  }

  async expectBranchRowVisible() {
    await expect(this.branchNameCell).toBeVisible();
    await expect(this.page.getByText(/Aneef Fashir\s*-\s*773260111/)).toBeVisible();
    await expect(this.page.getByText(/All Days\s*:\s*From\s*07:00 AM\s*To\s*03:00 AM/)).toBeVisible();
    await expect(this.onlineStatus).toBeVisible();
  }

  async expectBranchActionsVisible() {
    await expect(this.editAction).toBeVisible();
    await expect(this.restoreAction).toBeVisible();
  }

  async expectPaginationVisible() {
    await expect(this.page.getByText(/Total\s+\d+\s+results found/)).toBeVisible();
    await expect(this.page.getByText('Prev')).toBeVisible();
    await expect(this.page.getByText("You're on page")).toBeVisible();
    await expect(this.page.getByText('Next')).toBeVisible();
  }
}
