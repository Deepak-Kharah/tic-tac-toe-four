import { GoogleAnalytics } from "@next/third-parties/google";
import classNames from "classnames";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tic Tac Toe Four",
  description:
    "A twist on the classic Tic Tac Toe game. A game that never draws. Play now!",
  applicationName: "Tic Tac Toe Four",
  openGraph: {
    type: "website",
    url: "https://ttt-four.vercel.app",
    siteName: "Tic Tac Toe Four",
    title: "Tic Tac Toe Four",
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
    title: "Tic Tac Toe Four",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={classNames(raleway.className, "flex flex-col")}>
        <nav className="font-extralight text-slate-400 py-4 px-3 bg-gradient-to-b from-slate-900/40 to-transparent">
          <ul className="flex gap-5 mx-auto justify-center">
            <li>
              <Link className="transition-all hover:text-white" href="/">
                Home
              </Link>
            </li>
          </ul>
        </nav>
        {children}
        <footer className="font-extralight text-sm text-slate-400 py-4 px-3 text-center bg-gradient-to-t from-slate-900/40 to-transparent">
          Built by{" "}
          <a
            className="font-semibold text-slate-400/70 transition-all hover:text-white"
            href="https://github.com/Deepak-Kharah"
            target="_blank"
            rel="noopener noreferrer"
          >
            Deepak Kharah
          </a>
          . And it&apos;s{" "}
          <a
            className="font-semibold text-slate-400/70 transition-all hover:text-white"
            href="https://github.com/Deepak-Kharah/tic-tac-toe-four"
            target="_blank"
            rel="noopener noreferrer"
          >
            open source
          </a>
          .{" "}
        </footer>
        <div id="confetti">
          <canvas
            data-generated="true"
            style={{
              width: "100% !important",
              height: "100% !important",
              position: "fixed",
              top: "0px !important",
              left: "0px !important",
              pointerEvents: "none",
            }}
            aria-hidden="true"
            width="100vw"
            height="100vh"
          ></canvas>
        </div>
      </body>
      <GoogleAnalytics gaId="G-TSDM0Y9EXZ" />
    </html>
  );
}
