import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { vendorCredentials, vendorPortal } from '../data/vendorPortalData.js';

const invalidCredentials = {
  username: 'invalid.vendor@example.com',
  password: 'wrong-password-123',
};

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
  });

  test('TC_LOGIN_001 @login-page login page loads with all required controls', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.expectLoaded();
    await loginPage.expectUsernameValue('');
    await loginPage.expectPasswordValue('');
    await loginPage.expectPasswordMasked();
    await loginPage.expectLoginButtonEnabled();
  });

  test('TC_LOGIN_002 @login-valid vendor user can sign in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.login();

    await dashboardPage.expectLoaded();
    await expect(page.getByText('Cafe Asiana').first()).toBeVisible();
  });

  test('TC_LOGIN_003 @login-enter vendor user can sign in by pressing Enter from password field', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.fillCredentials();
    await loginPage.submitWithEnterExpectingSuccess();

    await dashboardPage.expectLoaded();
  });

  test('TC_LOGIN_004 @login-empty prevents login when username and password are empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.clearCredentials();
    await loginPage.submitExpectingFailure();
    await loginPage.expectAnyValidationMessageIfShown();
  });

  test('TC_LOGIN_005 @login-username-required prevents login when username is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.fillPassword(vendorCredentials.password);
    await loginPage.submitExpectingFailure();
    await loginPage.expectPasswordValue(vendorCredentials.password);
    await loginPage.expectAnyValidationMessageIfShown();
  });

  test('TC_LOGIN_006 @login-password-required prevents login when password is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.fillUsername(vendorCredentials.username);
    await loginPage.submitExpectingFailure();
    await loginPage.expectUsernameValue(vendorCredentials.username);
    await loginPage.expectAnyValidationMessageIfShown();
  });

  test('TC_LOGIN_007 @login-invalid-user prevents login with invalid username', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.fillCredentials(invalidCredentials.username, vendorCredentials.password);
    await loginPage.submitExpectingFailure();
    await loginPage.expectUsernameValue(invalidCredentials.username);
    await loginPage.expectAnyValidationMessageIfShown();
  });

  test('TC_LOGIN_008 @login-invalid-password prevents login with invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.fillCredentials(vendorCredentials.username, invalidCredentials.password);
    await loginPage.submitExpectingFailure();
    await loginPage.expectUsernameValue(vendorCredentials.username);
    await loginPage.expectAnyValidationMessageIfShown();
  });

  test('TC_LOGIN_009 @login-password-toggle can show and hide password value', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.fillPassword(vendorCredentials.password);
    await loginPage.expectPasswordMasked();

    await loginPage.togglePasswordVisibility();
    await loginPage.expectPasswordVisible();
    await loginPage.expectPasswordValue(vendorCredentials.password);

    await loginPage.togglePasswordVisibility();
    await loginPage.expectPasswordMasked();
  });

  test('TC_LOGIN_010 @login-direct-dashboard redirects unauthenticated users back to sign in', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await page.goto(vendorPortal.routes.dashboard, { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(/#\/authentication\/signin/);
    await loginPage.expectLoaded();
  });
});
