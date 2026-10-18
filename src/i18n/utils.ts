import { ui, defaultLang, type Lang, type UIKey } from './ui';

/** Déduit la langue depuis le premier segment de l'URL (repli FR). */
export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  if (seg === 'fr' || seg === 'en') return seg;
  return defaultLang;
}

/** Retourne une fonction de traduction t() pour la langue donnée. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Construit un lien interne préfixé par la langue. */
export function localizedPath(lang: Lang, path = ''): string {
  const clean = path.replace(/^\/+/, '');
  return clean ? `/${lang}/${clean}` : `/${lang}/`;
}

/**
 * Carte des routes : chaque page partagée a un segment d'URL propre à sa langue
 * (ex. FR « sur-mesure » ↔ EN « tailored »). Permet de lier les paires FR/EN.
 */
export const routeSlugs = {
  home: { fr: '', en: '' },
  destinations: { fr: 'destinations', en: 'destinations' },
  tailored: { fr: 'sur-mesure', en: 'tailored' },
  thanks: { fr: 'sur-mesure/merci', en: 'tailored/thanks' },
  about: { fr: 'a-propos', en: 'about' },
  partners: { fr: 'partenaires', en: 'partners' },
} as const;

export type RouteKey = keyof typeof routeSlugs;

/** Chemin localisé d'une route partagée (ex. route('en','tailored') → /en/tailored). */
export function route(lang: Lang, key: RouteKey): string {
  const slug = routeSlugs[key][lang];
  return slug ? `/${lang}/${slug}` : `/${lang}`;
}

/**
 * Pour une URL donnée, renvoie les chemins FR et EN équivalents si la page
 * correspond à une route partagée connue ; sinon null (ex. destination,
 * page sans équivalent). Les destinations passent leurs alternates explicitement.
 */
export function alternatesFor(url: URL): { fr: string; en: string } | null {
  const path = url.pathname.replace(/\/+$/, '') || '/';
  for (const key of Object.keys(routeSlugs) as RouteKey[]) {
    if (path === route('fr', key) || path === route('en', key)) {
      return { fr: route('fr', key), en: route('en', key) };
    }
  }
  return null;
}
