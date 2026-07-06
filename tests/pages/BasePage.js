import { expect } from '@playwright/test';
import { vendorPortal } from '../data/vendorPortalData.js';

export class BasePage {
  constructor(page) {
    this.page = page;
    this.portalTitle = page.getByRole('link', { name: /Vendor Portal/i });
    this.vendorName = page.getByText(vendorPortal.vendorName).first();
    this.serviceUnavailableHeading = page.getByRole('heading', { name: /Service Unavailable/i });
  }

  async goto(route) {
    await this.gotoWithRetry(route);
  }

  async waitForAppReady() {
    await expect(this.page.locator('body')).toBeAttached();
    await expect(this.portalTitle).toBeVisible();
  }

  async expectShellLoaded() {
    await expect(this.portalTitle).toBeVisible();
    await expect(this.vendorName).toBeVisible();
    await expect(this.page.locator('#leftsidebar').getByText('Sign Out')).toBeVisible();
  }

  async openMenuItem(name) {
    await this.waitForAppReady();

    const menuItem = this.page.getByRole('link', { name: new RegExp(name, 'i') });

    await expect(menuItem).toBeVisible();
    await menuItem.click({ timeout: 5000 }).catch(async () => {
      await menuItem.evaluate((element) => element.click());
    });
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async expectUrlContains(path) {
    await expect(this.page).toHaveURL(new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  async gotoWithRetry(route, attempts = 3) {
    let lastError;
    const routePath = route.split('?')[0];

    for (let attempt = 1; attempt <= attempts; attempt++) {
      const response = await this.page
        .goto(route, { waitUntil: 'domcontentloaded', timeout: 30000 })
        .catch((error) => {
          lastError = error;
          return null;
        });

      const appReady = await this.portalTitle
        .waitFor({ state: 'visible', timeout: 15000 })
        .then(() => true)
        .catch(() => false);
      const routeReady = this.page.url().includes(routePath);

      if (appReady && routeReady && (!response || response.status() < 500)) {
        return;
      }

      if (attempt === attempts) {
        if (lastError) {
          throw lastError;
        }

        await this.waitForAppReady();
        return;
      }

      await this.page.waitForTimeout(1000);
    }
  }
}
