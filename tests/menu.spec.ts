import { test, expect } from '@playwright/test';

// Régression : le menu burger doit s'ouvrir réellement sur mobile.
// Bug d'origine : le panneau .mobile-nav était descendant de .site-header
// (backdrop-filter), ce qui en faisait le bloc contenant du position:fixed →
// hauteur du panneau réduite à 0. Fix : panneau sorti du header.

test('le burger ouvre puis ferme le panneau', async ({ page }) => {
  await page.goto('/fr/partenaires');

  const toggle = page.locator('.nav-toggle');
  const panel = page.locator('#mobile-nav');

  await expect(toggle).toBeVisible();
  await expect(panel).toBeHidden();

  await toggle.click();
  await expect(panel).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');

  // Le panneau doit occuper une vraie surface (régression hauteur 0).
  const box = await panel.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThan(300);

  await toggle.click();
  await expect(panel).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('la touche Échap ferme le panneau', async ({ page }) => {
  await page.goto('/fr');

  const toggle = page.locator('.nav-toggle');
  const panel = page.locator('#mobile-nav');

  await toggle.click();
  await expect(panel).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
});

// Switch de langue FR → EN → FR via le panneau burger (mobile).
test('le switch de langue bascule FR → EN → FR', async ({ page }) => {
  await page.goto('/fr');

  const toggle = page.locator('.nav-toggle');
  const panel = page.locator('#mobile-nav');

  // FR → EN
  await toggle.click();
  await expect(panel).toBeVisible();
  await panel.locator('.lang-alt').click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  // EN → FR
  await toggle.click();
  await expect(panel).toBeVisible();
  await panel.locator('.lang-alt').click();
  await expect(page).toHaveURL(/\/fr$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
});
