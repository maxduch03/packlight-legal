// Chaînes d'interface par langue. Le CONTENU des pages reste dans les pages ;
// ici uniquement le "chrome" (navigation, pied de page, boutons, CTA).

export const languages = {
  fr: 'Français',
  en: 'English',
} as const;

export const defaultLang = 'fr';

export const ui = {
  fr: {
    'nav.destinations': 'Destinations',
    'nav.affinage': 'Affinage',
    'nav.about': 'À propos',
    'nav.partners': 'Partenaires',
    'nav.download': 'Télécharger',

    'footer.explore': 'Explorer',
    'footer.legal': 'Légal',
    'footer.privacy': 'Confidentialité',
    'footer.terms': 'Conditions',
    'footer.legalNotice': 'Mentions légales',
    'footer.contact': 'Contact',
    'footer.tagline': "Partir devrait être aussi simple que d'en avoir envie.",
    'footer.rights': 'Tous droits réservés.',

    'store.appstore': 'App Store',
    'store.googleplay': 'Google Play',

    'cta.generate': 'Génère le tien',
    'comingsoon.title': 'Bientôt en anglais',
    'comingsoon.body': "Cette page n'est pas encore disponible en anglais.",
    'comingsoon.toFr': 'Voir la version française →',
  },
  en: {
    'nav.destinations': 'Destinations',
    'nav.affinage': 'Fine-tuning',
    'nav.about': 'About',
    'nav.partners': 'Partners',
    'nav.download': 'Download',

    'footer.explore': 'Explore',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.legalNotice': 'Legal notice',
    'footer.contact': 'Contact',
    'footer.tagline': 'Travelling should be as easy as wanting to.',
    'footer.rights': 'All rights reserved.',

    'store.appstore': 'App Store',
    'store.googleplay': 'Google Play',

    'cta.generate': 'Create yours',
    'comingsoon.title': 'Coming soon in English',
    'comingsoon.body': 'This page is not available in English yet.',
    'comingsoon.toFr': 'See the French version →',
  },
} as const;

export type Lang = keyof typeof ui;
export type UIKey = keyof (typeof ui)['fr'];
