import { test, expect } from '../fixtures/vendorPortalFixture.js';
import { vendorPortal } from '../data/vendorPortalData.js';
import { LoginPage } from '../pages/LoginPage.js';

const baseURL = process.env.VENDOR_PORTAL_BASE_URL || 'https://partner.demo.dr.tmd1.org';

const routeUrl = (route) => `${baseURL}${route}`;
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const routeHash = (route) => route.replace(/^\//, '').split('?')[0];

function sidebarLink(page, item) {
  const sidebar = page.locator('#leftsidebar');
  const linkByName = sidebar.getByRole('link', { name: new RegExp(escapeRegExp(item.name), 'i') });
  const linkByHref = sidebar.locator(`a[href*="${routeHash(item.route)}"]`);

  return linkByName.or(linkByHref).first();
}

async function dismissAudioPermissionIfVisible(page) {
  const dialog = page.getByRole('dialog', { name: /Audio Permission/i });

  for (let attempt = 1; attempt <= 3; attempt++) {
    if (!(await dialog.isVisible({ timeout: 1500 }).catch(() => false))) {
      return;
    }

    await page.getByRole('button', { name: /^Deny$/i }).click({ force: true }).catch(async () => {
      await page.keyboard.press('Escape').catch(() => {});
    });
    await expect(dialog).toBeHidden({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(300);
  }
}

async function ensureAuthenticatedShell(page) {
  if (page.url().includes('/#/authentication/signin')) {
    const loginPage = new LoginPage(page);

    await loginPage.login();
  }

  await expect(page.getByRole('link', { name: /Vendor Portal/i })).toBeVisible();
  await expect(page.locator('#leftsidebar')).toBeVisible();
}

const sidebarItems = [
  {
    name: 'Dashboard',
    route: vendorPortal.routes.dashboard,
    urlPattern: /#\/home\/dashboard/,
    visibleHeading: /^Dashboard$/,
  },
  {
    name: 'Vendor Performance',
    route: vendorPortal.routes.vendorPerformance,
    urlPattern: /#\/home\/vendor\/performance/,
    visibleHeading: /^Vendor Performance$/,
  },
  {
    name: 'Branch(s) Details',
    route: vendorPortal.routes.branchDetails,
    urlPattern: /#\/home\/stores/,
    visibleHeading: /^Manage Stores$/,
  },
  {
    name: 'Menu Management',
    route: vendorPortal.routes.menuManagement,
    urlPattern: /#\/home\/menu/,
    visibleHeading: /^Menu Categories$/,
  },
  {
    name: 'Order Management',
    route: vendorPortal.routes.ordersManagement,
    urlPattern: /#\/home\/orders/,
    visibleHeading: /^Orders$/,
  },
  {
    name: 'Stores Ratings',
    route: vendorPortal.routes.storeRatings,
    urlPattern: /#\/home\/storeRatings/,
    visibleHeading: /^Stores Ratings$/,
  },
  {
    name: 'Reports',
    route: vendorPortal.routes.reports,
    urlPattern: /#\/home\/reports/,
    visibleHeading: /^Reports$/,
  },
  {
    name: 'Smart Boost Campaign',
    route: vendorPortal.routes.smartBoostCampaign,
    urlPattern: /#\/home\/smart-boost-campaign/,
    visibleHeading: /^Smart Boost Campaigns$/,
  },
];

test.describe('System Coverage', () => {
  test.describe.configure({ timeout: 120000 });

  let context;
  let page;

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext({ baseURL });
    page = await context.newPage();
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login();
    await page.goto(routeUrl(vendorPortal.routes.dashboard), { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
    await ensureAuthenticatedShell(page);
    await dismissAudioPermissionIfVisible(page);
  });

  test.afterEach(async () => {
    await context?.close();
  });

  test('TC_SYSTEM_001 @system-shell global header sidebar and theme controls are visible', async () => {
    await expect(page.getByRole('link', { name: /Vendor Portal/i })).toBeVisible();
    await expect(page.locator('#leftsidebar').getByText(vendorPortal.vendorName).first()).toBeVisible();
    await expect(page.locator('#leftsidebar').getByText('Sign Out')).toBeVisible();
    await expect(page.getByText('menu', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('fullscreen', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('SIDEBAR MENU COLORS')).toBeVisible();
    await expect(page.getByText('THEME COLORS')).toBeVisible();
    await expect(page.getByText('SKINS')).toBeVisible();

    for (const item of sidebarItems) {
      await expect(sidebarLink(page, item)).toBeVisible();
    }
  });

  for (const item of sidebarItems) {
    test(`TC_SYSTEM_NAV_${item.name.toUpperCase().replace(/[^A-Z0-9]+/g, '_')} @system-navigation ${item.name} opens from sidebar`, async () => {
      const link = sidebarLink(page, item);

      await expect(link).toBeVisible();
      await link.click({ timeout: 5000 }).catch(async () => {
        await link.evaluate((element) => element.click());
      });
      await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
      await dismissAudioPermissionIfVisible(page);

      await expect(page).toHaveURL(item.urlPattern);
      await dismissAudioPermissionIfVisible(page);
      await expect(page.getByRole('heading', { name: item.visibleHeading }).first()).toBeVisible();
    });
  }

  test('TC_SYSTEM_010 @system-protected-routes unauthenticated protected routes redirect to sign in', async ({ browser }) => {
    const anonymousContext = await browser.newContext({ baseURL });
    const anonymousPage = await anonymousContext.newPage();

    for (const item of sidebarItems) {
      await anonymousPage.goto(routeUrl(item.route), { waitUntil: 'domcontentloaded', timeout: 60000 });
      await expect(anonymousPage).toHaveURL(/#\/authentication\/signin/);
      await expect(anonymousPage.getByRole('button', { name: /^Login$/i })).toBeVisible();
    }

    await anonymousContext.close();
  });

  test('TC_SYSTEM_011 @system-signout sign out returns user to login page', async () => {
    const signOut = page.locator('#leftsidebar').getByText('Sign Out');

    await expect(signOut).toBeVisible();
    await signOut.click({ timeout: 5000 }).catch(async () => {
      await signOut.evaluate((element) => element.click());
    });
    await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});

    await expect(page).toHaveURL(/#\/authentication\/signin/);
    await expect(page.getByRole('button', { name: /^Login$/i })).toBeVisible();
  });
});
