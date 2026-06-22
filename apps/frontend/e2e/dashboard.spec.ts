import { expect, test, Page } from '@playwright/test';

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`;
}

async function registerAndOpenDashboard(page: Page) {
  await page.goto('/register');
  await page.fill('#name', 'Dashboard Explorer');
  await page.fill('#email', uniqueEmail('dashboard-e2e'));
  await page.fill('#password', 'Password123!');
  await page.click('button:has-text("Create Account")');
  await page.waitForURL('**/dashboard');
}

test.describe('E2E Core User Paths', () => {
  test.beforeEach(async ({ page }) => {
    await registerAndOpenDashboard(page);
  });

  test('should load the dashboard summary and daily challenge', async ({ page }) => {
    await expect(page.getByText('Interview Prep Dashboard Active')).toBeVisible();
    await expect(page.getByText('Problems Solved')).toBeVisible();
    await expect(page.getByText('Active Streak')).toBeVisible();
    await expect(page.getByText('Daily Challenge')).toBeVisible();
  });

  test('should browse problems and filter to Two Sum', async ({ page }) => {
    await page.goto('/problems');
    await expect(page.getByRole('heading', { name: 'Coding Challenges' })).toBeVisible();

    await page.fill('input[placeholder*="Search challenges"]', 'Two Sum');
    await page.waitForTimeout(600);

    await expect(page.getByRole('link', { name: 'Two Sum' }).first()).toBeVisible();
    await page.click('button:has-text("JavaScript")');
    await expect(page.getByRole('link', { name: 'Two Sum' }).first()).toBeVisible();
  });
});
