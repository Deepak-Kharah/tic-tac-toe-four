import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline · Tic Tac Toe Four",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-light text-white mb-3">
          You&apos;re offline
        </h1>
        <p className="text-slate-400 mb-6 font-extralight">
          No internet, no problem. The game runs entirely in your browser.
        </p>
        <Link
          href="/game"
          className="inline-block px-5 py-2 rounded border border-slate-600 text-slate-100 hover:bg-slate-700 transition"
        >
          Play
        </Link>
      </div>
    </main>
  );
}
