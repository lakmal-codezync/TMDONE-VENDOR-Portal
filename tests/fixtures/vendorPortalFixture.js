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
  const basePage = new BasePage(page);

  await basePage.goto(vendorPortal.routes.dashboard).catch(() => {});
  const isAuthenticated = await basePage.portalTitle
    .isVisible({ timeout: 5000 })
    .catch(() => false);
  const currentUrl = page.url();

  await context.close();

  return isAuthenticated && currentUrl.includes(vendorPortal.routes.dashboard);
}

export const test = base.extend({
  authStorageState: [
    async ({ browser }, use) => {
      if (!(await authStateWorks(browser))) {
        await writeFreshAuthState(browser);
      }

      await use(authFile);
    },
    { scope: 'worker' },
  ],

  authenticatedPage: async ({ browser, authStorageState }, use) => {
    const context = await browser.newContext({ baseURL, storageState: authStorageState });
    const page = await context.newPage();
    const basePage = new BasePage(page);

    await basePage.goto(vendorPortal.routes.dashboard);
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
