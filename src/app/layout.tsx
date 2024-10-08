import { GoogleAnalytics } from "@next/third-parties/google";
import classNames from "classnames";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Link from "next/link";
import { SITE_METADATA } from "../common/metadata.constant";
import "./globals.css";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = SITE_METADATA;

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
