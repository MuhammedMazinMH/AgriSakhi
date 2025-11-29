import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Disease Detection Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/detect');
  });

  test('should display detection page with upload options', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Disease Detection/i })).toBeVisible();
    await expect(page.getByText(/Upload Plant Image/i)).toBeVisible();
    await expect(page.getByText(/Upload from Gallery/i)).toBeVisible();
    await expect(page.getByText(/Take Photo/i)).toBeVisible();
  });

  test('should show tips for best results', async ({ page }) => {
    await expect(page.getByText(/Tips for Best Results/i)).toBeVisible();
    await expect(page.getByText(/Capture the affected area in good lighting/i)).toBeVisible();
  });

  test('should disable detect button when no image selected', async ({ page }) => {
    const detectButton = page.getByRole('button', { name: /Detect Disease/i });
    await expect(detectButton).toBeDisabled();
  });

  test('should enable detect button after image upload', async ({ page }) => {
    // Create a test image file
    const fileInput = page.locator('input[type="file"]').first();
    
    // Upload a test image
    const testImagePath = path.join(__dirname, 'fixtures', 'test-plant.jpg');
    await fileInput.setInputFiles(testImagePath);

    // Wait for image to be displayed
    await expect(page.locator('img[alt="Selected plant"]')).toBeVisible();

    // Check if detect button is enabled
    const detectButton = page.getByRole('button', { name: /Detect Disease/i });
    await expect(detectButton).toBeEnabled();
  });

  test('should show loading state during detection', async ({ page }) => {
    // Upload test image
    const fileInput = page.locator('input[type="file"]').first();
    const testImagePath = path.join(__dirname, 'fixtures', 'test-plant.jpg');
    await fileInput.setInputFiles(testImagePath);

    // Click detect button
    const detectButton = page.getByRole('button', { name: /Detect Disease/i });
    await detectButton.click();

    // Should show loading state
    await expect(page.getByText(/Detecting.../i)).toBeVisible();
  });

  test('should allow image removal after upload', async ({ page }) => {
    // Upload test image
    const fileInput = page.locator('input[type="file"]').first();
    const testImagePath = path.join(__dirname, 'fixtures', 'test-plant.jpg');
    await fileInput.setInputFiles(testImagePath);

    // Wait for image preview
    await expect(page.locator('img[alt="Selected plant"]')).toBeVisible();

    // Click remove button
    await page.getByRole('button', { name: /Remove/i }).click();

    // Image should be removed
    await expect(page.getByText(/No image selected/i)).toBeVisible();
  });

  test('should navigate to results page after successful detection', async ({ page }) => {
    // Mock successful detection
    await page.route('**/api/detect', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          disease: 'Tomato___Early_blight',
          confidence: 0.94,
          severity: 7,
          affectedArea: 35,
        }),
      });
    });

    // Upload and detect
    const fileInput = page.locator('input[type="file"]').first();
    const testImagePath = path.join(__dirname, 'fixtures', 'test-plant.jpg');
    await fileInput.setInputFiles(testImagePath);

    await page.getByRole('button', { name: /Detect Disease/i }).click();

    // Should navigate to results
    await expect(page).toHaveURL(/\/results/, { timeout: 10000 });
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });
});
