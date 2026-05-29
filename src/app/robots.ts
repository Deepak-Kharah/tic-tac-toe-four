import type { MetadataRoute } from "next";
import { SITE_METADATA } from "@/common/metadata.constant";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_METADATA.openGraph.url;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/offline",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
