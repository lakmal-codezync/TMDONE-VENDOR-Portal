import { test as base } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { LoginPage } from '../pages/LoginPage.js';
import { BasePage } from '../pages/BasePage.js';
import { vendorPortal } from '../data/vendorPortalData.js';

const authDir = path.resolve(process.cwd(), 'playwright/.auth');
const authFile = path.join(authDir, 'vendor.json');
const baseURL = process.env.VENDOR_PORTAL_BASE_URL || 'https://partner.demo.dr.tmd1.org';

async function writeFreshAuthState(browser) {
  fs.mkdirSync(authDir, { recursive: true });

  const page = await browser.newPage({ baseURL });
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login();
  await page.context().storageState({ path: authFile });
  await page.close();
}

async function authStateWorks(browser) {
  if (!fs.existsSync(authFile)) {
    return false;
  }

  const context = await browser.newContext({ baseURL, storageState: authFile });
  const page = await context.newPage();
  const portalTitle = page.getByRole('link', { name: /Vendor Portal/i });

  try {
    await page.goto(vendorPortal.routes.dashboard, { waitUntil: 'domcontentloaded', timeout: 20000 });
    const isAuthenticated = await portalTitle
      .isVisible({ timeout: 8000 })
      .catch(() => false);

    return isAuthenticated && page.url().includes(vendorPortal.routes.dashboard);
  } catch {
    return false;
  } finally {
    await context.close().catch(() => {});
  }
}

export const test = base.extend({
  authStorageState: [
    async ({ browser }, use) => {
      if (process.env.CI || !(await authStateWorks(browser))) {
        await writeFreshAuthState(browser);
      }

      if (!(await authStateWorks(browser))) {
        throw new Error('Unable to create a reusable authenticated vendor portal session.');
      }

      await use(authFile);
    },
    { scope: 'worker', timeout: 180000 },
  ],

  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    const basePage = new BasePage(page);

    try {
      await loginPage.goto();
      await loginPage.login();
      await basePage.goto(vendorPortal.routes.dashboard);
      await use(page);
    } finally {
      await context.close().catch(() => {});
    }
  },
});

export { expect } from '@playwright/test';
