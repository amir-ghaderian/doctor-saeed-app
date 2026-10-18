import type { MetadataRoute } from "next";

const BASE_URL = "https://tackl.ir";

const staticPages = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/games", changeFrequency: "weekly", priority: 0.9 },
  { path: "/games/attention", changeFrequency: "monthly", priority: 0.7 },
  { path: "/games/football", changeFrequency: "monthly", priority: 0.7 },
  { path: "/games/gallery", changeFrequency: "monthly", priority: 0.6 },
  { path: "/games/management", changeFrequency: "monthly", priority: 0.7 },
  { path: "/games/mental-health", changeFrequency: "monthly", priority: 0.8 },
  { path: "/games/personal-development", changeFrequency: "monthly", priority: 0.8 },
  { path: "/games/sports", changeFrequency: "monthly", priority: 0.7 },
  { path: "/games/thinking", changeFrequency: "weekly", priority: 0.9 },
  { path: "/games/thinking/memory", changeFrequency: "weekly", priority: 0.8 },
  { path: "/games/thinking/table", changeFrequency: "weekly", priority: 0.8 },
  { path: "/games/thinking/visual", changeFrequency: "weekly", priority: 0.8 },
] as const;

const personalDevelopmentSlugs = [
  "mez-ra-bichin",
  "barname-rizi-roozane",
  "ghanoon-80-20",
  "natayej-va-avaqeb",
  "abcde",
  "natayej-kelidi",
  "ghanoon-zoroorat",
  "amadegi",
  "moqaddamat-kar",
  "estehdad-haye-khas",
  "mahdoodiat-asli",
  "ghadam-be-ghadam",
  "feshar-bar-khod",
  "niro-va-tavan",
  "angizeh",
  "tanbali-khalagh",
  "sakht-tarin-kar",
  "taghsim-kar",
  "zaman-bi-vaghfe",
  "hes-foriyat",
  "tamarkoz-yek-kar",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const personalDevelopmentEntries: MetadataRoute.Sitemap =
    personalDevelopmentSlugs.map((slug) => ({
      url: `${BASE_URL}/games/personal-development/${slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticEntries, ...personalDevelopmentEntries];
}
