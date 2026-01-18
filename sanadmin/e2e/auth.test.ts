import { test, expect } from '@playwright/test';

test('login and logout flow', async ({ page }) => {
  // 1. Go to login page
  await page.goto('/login');
  await expect(page).toHaveURL('/login');

  // 2. Fill in credentials (assuming seed script has run and created 'admin' / 'password123')
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', 'password123');

  // 3. Submit form
  await page.click('button[type="submit"]');

  // 4. Verify redirect to dashboard
  await expect(page).toHaveURL('/dashboard');

  // 5. Verify cookie is set (optional, but good)
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find(c => c.name === 'session');
  expect(sessionCookie).toBeDefined();

  // 6. Test logout
  // Since we implemented the logout button in the sidebar, we can click it.
  // The sidebar has a 'Sign Out' button.

  // Wait for the button to be visible
  await page.waitForSelector('button:has-text("Sign Out")');
  await page.click('button:has-text("Sign Out")');

  // 7. Verify redirect to login
  await expect(page).toHaveURL('/login');

  // 8. Verify protected routes redirect to login
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/login');
});

test('protected routes redirect to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
});
