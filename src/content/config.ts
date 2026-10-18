import { defineCollection, z } from 'astro:content';

const destinations = defineCollection({
  type: 'content',
  schema: z.object({
    lang: z.enum(['fr', 'en']),
    // Slug d'URL, indépendant du nom de fichier (permet d'apparier FR/EN).
    // Renommé car "slug" est réservé par Astro.
    pageSlug: z.string(),
    title: z.string(),
    // Phrase courte d'accroche / meta description.
    description: z.string(),
    // Image d'en-tête desktop (16:9) et variante mobile (4:5), chemins dans public/.
    hero: z.string().optional(),
    heroMobile: z.string().optional(),
    // Capture d'un itinéraire généré pour cette destination.
    itineraryImage: z.string().optional(),
    // Exactement 3 conseils.
    tips: z.array(z.string()).length(3),
    // pageSlug de la page équivalente dans l'autre langue (hreflang + switch).
    translationOf: z.string().optional(),
    order: z.number().default(100),
    published: z.boolean().default(true),
  }),
});

export const collections = { destinations };
