import { expect } from '@playwright/test';
import { vendorCredentials, vendorPortal } from '../data/vendorPortalData.js';

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input').first();
    this.passwordInput = page.locator('input').nth(1);
    this.loginButton = page.getByRole('button', { name: /^Login$/i });
    this.passwordVisibilityToggle = page.getByRole('link', {
      name: /^(hide|show) password$/i,
    });
    this.validationMessage = page.getByText(
      /required|invalid|incorrect|wrong|failed|try again|not found/i,
    );
  }

  async goto() {
    await this.page.goto(vendorPortal.routes.signIn, { waitUntil: 'domcontentloaded' });
    await expect(this.loginButton).toBeVisible();
  }

  async expectLoaded() {
    await expect(this.page).toHaveTitle(/TMDone-Vendor-Portal/i);
    await expect(this.page.getByText('Username')).toBeVisible();
    await expect(this.page.getByText('Password')).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async fillUsername(username) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async fillCredentials(username = vendorCredentials.username, password = vendorCredentials.password) {
    await this.fillUsername(username);
    await this.fillPassword(password);
  }

  async clearCredentials() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  async submit() {
    await this.loginButton.click();
  }

  async submitWithEnter() {
    await this.passwordInput.press('Enter');
  }

  async login(username = vendorCredentials.username, password = vendorCredentials.password) {
    await this.fillCredentials(username, password);
    await this.submitExpectingSuccess();
  }

  async submitExpectingSuccess() {
    await this.submit();
    await expect(this.page).toHaveURL(/#\/home\/dashboard/, { timeout: 30000 });
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async submitWithEnterExpectingSuccess() {
    await this.submitWithEnter();
    await expect(this.page).toHaveURL(/#\/home\/dashboard/, { timeout: 30000 });
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async submitExpectingFailure() {
    const currentUrl = this.page.url();

    await this.submit();
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});

    await expect(this.page).not.toHaveURL(/#\/home\/dashboard/);
    await expect(this.page).toHaveURL(currentUrl);
    await expect(this.usernameInput).toBeVisible();
  }

  async expectUsernameValue(value) {
    await expect(this.usernameInput).toHaveValue(value);
  }

  async expectPasswordValue(value) {
    await expect(this.passwordInput).toHaveValue(value);
  }

  async expectPasswordMasked() {
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
  }

  async expectPasswordVisible() {
    await expect(this.passwordInput).toHaveAttribute('type', 'text');
  }

  async togglePasswordVisibility() {
    await this.passwordVisibilityToggle.click();
  }

  async expectLoginButtonEnabled() {
    await expect(this.loginButton).toBeEnabled();
  }

  async expectLoginButtonFocused() {
    await expect(this.loginButton).toBeFocused();
  }

  async expectAnyValidationMessageIfShown() {
    if ((await this.validationMessage.count()) > 0) {
      await expect(this.validationMessage.first()).toBeVisible();
    }
  }
}
