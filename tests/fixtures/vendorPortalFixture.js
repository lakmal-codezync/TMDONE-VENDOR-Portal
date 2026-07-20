import { test as base } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { LoginPage } from '../pages/LoginPage.js';
import { BasePage } from '../pages/BasePage.js';
import { vendorPortal } from '../data/vendorPortalData.js';

const authDir = path.resolve(process.cwd(), 'playwright/.auth');
const authFile = path.join(authDir, 'vendor.json');
const sessionAuthFile = path.join(authDir, 'vendor-session.json');
const baseURL = process.env.VENDOR_PORTAL_BASE_URL || 'https://partner.demo.dr.tmd1.org';

async function applySessionStorage(context) {
  if (!fs.existsSync(sessionAuthFile)) {
    return;
  }

  const sessionStorage = JSON.parse(fs.readFileSync(sessionAuthFile, 'utf-8'));
  await context.addInitScript((entries) => {
    if (window.location.origin !== new URL(entries.origin).origin) {
      return;
    }

    for (const [key, value] of entries.items) {
      window.sessionStorage.setItem(key, value);
    }
  }, sessionStorage);
}

async function writeFreshAuthState(browser) {
  fs.mkdirSync(authDir, { recursive: true });

  const page = await browser.newPage({ baseURL });
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login();
  await page.context().storageState({ path: authFile });
  const sessionStorage = await page.evaluate(() => ({
    origin: window.location.origin,
    items: Object.entries(window.sessionStorage),
  }));
  fs.writeFileSync(sessionAuthFile, JSON.stringify(sessionStorage, null, 2));
  await page.close();
}

async function authStateWorks(browser) {
  if (!fs.existsSync(authFile)) {
    return false;
  }

  const context = await browser.newContext({ baseURL, storageState: authFile });
  await applySessionStorage(context);
  const page = await context.newPage();

  try {
    await page.goto(vendorPortal.routes.dashboard, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});

    const hasSession = await page.evaluate(() => {
      return Boolean(window.localStorage.getItem('currentUser')) &&
        Boolean(window.localStorage.getItem('tmdone_vendor_portal_auth_token'));
    }).catch(() => false);
    const stayedInApp = page.url().includes('/#/home') && !page.url().includes('/authentication/signin');

    return hasSession && stayedInApp;
  } catch {
    return false;
  } finally {
    await context.close().catch(() => {});
  }
}

async function gotoDashboard(page) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    await page
      .goto(vendorPortal.routes.dashboard, { waitUntil: 'domcontentloaded', timeout: 30000 })
      .then(() => {
        lastError = undefined;
      })
      .catch((error) => {
        lastError = error;
      });

    await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});

    if (!lastError || page.url().includes('/authentication/signin')) {
      return;
    }

    await page.waitForTimeout(1000);
  }

  throw lastError;
}

export const test = base.extend({
  authStorageState: [
    async ({ browser }, use) => {
      if (!(await authStateWorks(browser))) {
        await writeFreshAuthState(browser).catch(() => {});
      }

      await use(fs.existsSync(authFile) ? authFile : undefined);
    },
    { scope: 'worker', timeout: 180000 },
  ],

  authenticatedPage: async ({ browser, authStorageState }, use) => {
    const contextOptions = authStorageState
      ? { baseURL, storageState: authStorageState }
      : { baseURL };
    const context = await browser.newContext(contextOptions);
    await applySessionStorage(context);
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    const basePage = new BasePage(page);

    try {
      await gotoDashboard(page);

      const loginVisible = async () =>
        page.url().includes('/authentication/signin') ||
        await loginPage.loginButton.isVisible({ timeout: 1000 }).catch(() => false);

      if (await loginVisible()) {
        await loginPage.login();
        await page.context().storageState({ path: authFile }).catch(() => {});
      } else {
        const appReady = await basePage.waitForAppReady()
          .then(() => true)
          .catch(() => false);

        if (!appReady && await loginVisible()) {
          await loginPage.login();
          await page.context().storageState({ path: authFile }).catch(() => {});
        } else if (!appReady) {
          await basePage.waitForAppReady();
        }
      }
      await use(page);
    } finally {
      await context.close().catch(() => {});
    }
  },
});

export { expect } from '@playwright/test';
