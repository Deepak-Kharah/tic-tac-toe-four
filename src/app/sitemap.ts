import type { MetadataRoute } from "next";
import { SITE_METADATA } from "@/common/metadata.constant";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_METADATA.openGraph.url;
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/game`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
