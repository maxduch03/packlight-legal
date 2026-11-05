import { test, expect } from '@playwright/test';

// Landing multi-pays (1.2) : tous les CTA stores de la page (hors header/footer
// communs au site) portent utm_campaign=multi.
for (const path of ['/en/multi', '/fr/multi']) {
  test(`${path} : CTA stores en utm_campaign=multi`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('h1')).toBeVisible();
    const links = page.locator('main a[href*="app.getpacklight.com"], #sticky-download a');
    expect(await links.count()).toBeGreaterThanOrEqual(5); // 2 hero + 2 bas + sticky
    for (const href of await links.evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href))) {
      expect(new URL(href).searchParams.get('utm_campaign')).toBe('multi');
    }
    // hreflang FR ↔ EN
    await expect(page.locator('link[hreflang="fr"]')).toHaveAttribute('href', /\/fr\/multi$/);
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', /\/en\/multi$/);
  });
}

test('/en/creators : formulaire Formspree, envoi AJAX', async ({ page }) => {
  await page.route('https://formspree.io/**', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  );
  await page.goto('/en/creators');
  await expect(page.locator('h1')).toContainText('30 %');
  await expect(page.locator('#terms')).toContainText('€20');
  const form = page.locator('form.creator-form');
  await expect(form).toHaveAttribute('action', /^https:\/\/formspree\.io\/f\//);
  await page.fill('#cr-name', 'Test');
  await page.fill('#cr-email', 'test@example.com');
  await page.fill('#cr-handle', '@test');
  await page.click('form.creator-form button[type="submit"]');
  await expect(page.locator('.form-success')).toBeVisible();
});
