# TMDONE Vendor Portal

Playwright end-to-end test automation suite for the TMDONE Vendor Portal.

[![Playwright Tests](https://github.com/lakmal-codezync/TMDONE-VENDOR-Portal/actions/workflows/playwright.yml/badge.svg)](https://github.com/lakmal-codezync/TMDONE-VENDOR-Portal/actions/workflows/playwright.yml)

## Test Cases

- [Vendor Portal Test Cases](https://docs.google.com/document/d/1LNpOB8PYtULynPEraY3BP1dIbjIbN8qhcU7SzwDlKJ8/edit?usp=sharing)

## Screenshots

| Login | Dashboard |
| --- | --- |
| ![Login](docs/screenshots/login.png) | ![Dashboard](docs/screenshots/dashboard.png) |

| Vendor Performance | Branch Details |
| --- | --- |
| ![Vendor Performance](docs/screenshots/vendor-performance.png) | ![Branch Details](docs/screenshots/branch-details.png) |

| Menu Management | Order Management |
| --- | --- |
| ![Menu Management](docs/screenshots/menu-management.png) | ![Order Management](docs/screenshots/order-management.png) |

| Stores Ratings | Stores Ratings Summary |
| --- | --- |
| ![Stores Ratings](docs/screenshots/stores-ratings.png) | ![Stores Ratings Summary](docs/screenshots/stores-ratings-summary.png) |

| Reports | Smart Boost Campaign |
| --- | --- |
| ![Reports](docs/screenshots/reports.png) | ![Smart Boost Campaign](docs/screenshots/smart-boost-campaign.png) |

## Covered Areas

- Login and authentication redirects
- Dashboard summaries, filters, and charts
- Vendor performance reports
- Branch details
- Menu category and item management
- Stores ratings and review summary
- Reports
- Smart Boost campaign flows
- Order management
- System navigation, protected routes, and sign out

## Quick Start

```bash
npm install
npx playwright install
npm test
```

## Useful Commands

```bash
npm test
npm run test:login
npm run test:dashboard
npm run test:reports
npm run test:smart-boost-campaign
npm run test:order-management
npm run test:system-coverage
npm run report
```

## Environment Variables

The suite can use default demo values from `tests/data/vendorPortalData.js`, or these environment variables:

```bash
VENDOR_PORTAL_BASE_URL=https://partner.demo.dr.tmd1.org
VENDOR_PORTAL_USERNAME=your_vendor_username
VENDOR_PORTAL_PASSWORD=your_vendor_password
```

For GitHub Actions, add these as repository secrets:

- `VENDOR_PORTAL_BASE_URL`
- `VENDOR_PORTAL_USERNAME`
- `VENDOR_PORTAL_PASSWORD`

## CI/CD

`.github/workflows/playwright.yml` runs the full suite automatically every day at **2:00 AM Asia/Colombo time** (8:30 PM UTC), and can also be triggered manually from the Actions tab (`workflow_dispatch`).

After the run, it emails a results summary via Gmail SMTP - one table per spec file listing each test's **Test ID**, **description**, and **status** (pass/fail/flaky/skipped), plus overall pass/fail counts. The summary is built by `.github/scripts/build-email-summary.mjs` from the JSON reporter output.

To enable the email step, set these repository secrets:

- `GMAIL_ADDRESS` - the Gmail address to send from
- `GMAIL_APP_PASSWORD` - a Google Account [App Password](https://myaccount.google.com/apppasswords) for that address (requires 2-Step Verification)

The HTML report and raw test results are also uploaded as workflow artifacts (14-day retention) regardless of whether the email sends.
