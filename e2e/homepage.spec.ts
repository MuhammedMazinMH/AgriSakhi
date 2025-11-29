import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the homepage with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/AgriSakhi/);
    await expect(page.getByRole('heading', { name: /AgriSakhi/i })).toBeVisible();
  });

  test('should display hero section with CTA buttons', async ({ page }) => {
    await expect(page.getByText(/Your AI-Powered Agriculture Friend/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Detect Disease Now/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Create Free Account/i })).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    await expect(page.getByText(/Powerful Features for Modern Farmers/i)).toBeVisible();
    await expect(page.getByText(/AI Disease Detection/i)).toBeVisible();
    await expect(page.getByText(/Expert Consultation/i)).toBeVisible();
  });

  test('should display how it works section', async ({ page }) => {
    await expect(page.getByText(/How AgriSakhi Works/i)).toBeVisible();
    await expect(page.getByText(/Capture or Upload/i)).toBeVisible();
    await expect(page.getByText(/AI Analysis/i)).toBeVisible();
    await expect(page.getByText(/Get Treatment/i)).toBeVisible();
  });

  test('should navigate to detection page on CTA click', async ({ page }) => {
    await page.getByRole('link', { name: /Detect Disease Now/i }).first().click();
    await expect(page).toHaveURL(/\/detect/);
  });

  test('should display footer with links', async ({ page }) => {
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.getByText(/Product/i)).toBeVisible();
    await expect(page.getByText(/Resources/i)).toBeVisible();
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toContain('AgriSakhi');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: /AgriSakhi/i })).toBeVisible();
    await expect(page.getByText(/Your AI-Powered Agriculture Friend/i)).toBeVisible();
  });
});
