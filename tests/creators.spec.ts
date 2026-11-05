import { test, expect } from '@playwright/test';

// Créatrices : un lien utm_source=creator mémorise la créatrice ; le code promo
// pré-remplit le coupon Stripe et client_reference_id porte la commission.

test('code promo saisi → prefilled_promo_code + client_reference_id', async ({ page }) => {
  await page.goto('/fr/sur-mesure');
  const cta = page.locator('a[data-pay]').first();
  await expect(cta).not.toHaveAttribute('href', /client_reference_id/);
  await page.fill('#promo-code', 'heidi');
  await expect(page.locator('#promo-msg')).toHaveText('−10 % appliqués au paiement');
  const href = await cta.getAttribute('href');
  const u = new URL(href!);
  expect(u.searchParams.get('prefilled_promo_code')).toBe('HEIDI');
  expect(u.searchParams.get('client_reference_id')).toBe('creator_heidi');
  await page.fill('#promo-code', 'NOPE');
  await expect(page.locator('#promo-msg')).toHaveText('Code inconnu');
});

test('lien créatrice → attribution mémorisée et code pré-rempli (EN)', async ({ page }) => {
  await page.goto('/en/tailored?utm_source=creator&utm_campaign=michaela');
  await expect(page.locator('#promo-code')).toHaveValue('MICHAELA');
  // Persisted (first touch): another page, no utm, a later creator ignored.
  await page.goto('/fr/sur-mesure?utm_source=creator&utm_campaign=heidi');
  await expect(page.locator('#promo-code')).toHaveValue('MICHAELA');
  const u = new URL((await page.locator('a[data-pay]').first().getAttribute('href'))!);
  expect(u.searchParams.get('client_reference_id')).toBe('creator_michaela');
  expect(u.searchParams.get('prefilled_promo_code')).toBe('MICHAELA');
});
