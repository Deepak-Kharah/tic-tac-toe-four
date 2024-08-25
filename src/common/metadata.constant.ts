import type { Metadata } from "next";
import type { WebSite, WithContext } from "schema-dts";

export const SITE_METADATA = {
  title: "Tic Tac Toe Four",
  description:
    "A twist on the classic Tic Tac Toe game. A game that never draws. Play now!",
  applicationName: "Tic Tac Toe Four",
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    url: "https://ttt-four.vercel.app",
    siteName: "Tic Tac Toe Four",
    title: "Tic Tac Toe Four - A twist on the classic Tic Tac Toe game",
    images: [
      {
        url: "https://ttt-four.vercel.app/images/og-image.png",
        alt: "Tic Tac Toe Four",
      },
    ],
    description:
      "A twist on the classic Tic Tac Toe game. A game that never draws.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tic Tac Toe Four - A twist on the classic Tic Tac Toe game",
    description:
      "A twist on the classic Tic Tac Toe game. A game that never draws.",
    creator: "@deepak_kharah",
    images: [
      "https://js-design-pattern-visualized.vercel.app/images/og-image.png",
    ],
  },
  verification: {
    google: "RYFPGjrvpRLoYr1N9GC-k31biGi8xMt-Sas_uWwTWDs",
  },
  authors: [
    {
      name: "Deepak Kharah",
      url: "https://github.com/Deepak-Kharah",
    },
  ],
  icons: {
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
      {
        rel: "mask-icon",
        url: "images/safari-pinned-tab.svg",
        color: "#0f162a",
      },
    ],
    apple: "/images/apple-touch-icon.png",
    icon: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/images/favicon-dark-16x16.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/images/favicon-light-16x16.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/images/favicon-dark-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/images/favicon-light-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        sizes: "16x16",
        url: "/images/favicon-dark.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        sizes: "16x16",
        url: "/images/favicon-light.svg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        sizes: "32x32",
        url: "/images/favicon-dark.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        sizes: "32x32",
        url: "/images/favicon-light.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  other: {
    "msapplication-TileColor": "#0f162a",
    "msapplication-TileImage": "/images/mstile-144x144.png",
  },
} as const satisfies Metadata;

export const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: SITE_METADATA.openGraph.url,
  name: SITE_METADATA.title,
  description: SITE_METADATA.description,
  alternateName: ["TTT Four", "Tic Tac Toe Four"],
} as const satisfies WithContext<WebSite>;
