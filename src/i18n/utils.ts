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
