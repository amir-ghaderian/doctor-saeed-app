import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.tackl.ir",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://www.tackl.ir/games",
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}