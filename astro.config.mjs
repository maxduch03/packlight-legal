import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Site statique FR mobile-first — déployé sur Vercel.
// Les pages légales (privacy/terms/legal) et app-ads.txt sont servies
// telles quelles depuis public/ ; vercel.json gère les clean URLs.
export default defineConfig({
  site: 'https://getpacklight.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      // Exclut la racine de redirection et les pages de remerciement (noindex).
      filter: (page) => {
        const { pathname } = new URL(page);
        if (pathname === '/') return false;
        if (pathname.includes('/sur-mesure/merci')) return false;
        if (pathname.includes('/tailored/thanks')) return false;
        return true;
      },
    }),
  ],
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: true,
      // On gère la racine nous-mêmes (détection navigateur + repli FR)
      // dans src/pages/index.astro, donc pas de redirection auto d'Astro.
      redirectToDefaultLocale: false,
    },
  },
});
