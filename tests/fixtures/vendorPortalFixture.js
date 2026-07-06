import { test as base } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { LoginPage } from '../pages/LoginPage.js';
import { BasePage } from '../pages/BasePage.js';
import { vendorPortal } from '../data/vendorPortalData.js';

const authDir = path.resolve(process.cwd(), 'playwright/.auth');
const authFile = path.join(authDir, 'vendor.json');

export const test = base.extend({
  authStorageState: [
    async ({ browser }, use) => {
      if (!fs.existsSync(authFile)) {
        fs.mkdirSync(authDir, { recursive: true });

        const page = await browser.newPage();
        const loginPage = new LoginPage(page);

        await loginPage.goto();
        await loginPage.login();
        await page.context().storageState({ path: authFile });
        await page.close();
      }

      await use(authFile);
    },
    { scope: 'worker' },
  ],

  authenticatedPage: async ({ browser, authStorageState }, use) => {
    const context = await browser.newContext({ storageState: authStorageState });
    const page = await context.newPage();
    const basePage = new BasePage(page);

    await basePage.goto(vendorPortal.routes.dashboard);
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
