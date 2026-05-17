"use client";

import { Download, Share } from "lucide-react";
import { useInstallCapabilities } from "../hooks";
import { triggerInstall, detectDevice } from "../utils";
import { useState, useEffect } from "react";
import type { BeforeInstallPromptEvent } from "../types";

export function InstallButton() {
  const { canInstall, isStandalone } = useInstallCapabilities();
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  // Listen for install prompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;

    try {
      await triggerInstall(installEvent);
    } catch (error) {
      console.warn("Install failed:", error);
    }
  };

  // Don't show if app is already installed or can't be installed
  if (!canInstall || isStandalone) {
    return null;
  }

  const { isIOS } = detectDevice();
  const hasNativeInstall = !!installEvent;

  return (
    <button
      onClick={hasNativeInstall ? handleInstall : undefined}
      className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-slate-400 hover:text-slate-300 transition-colors"
      title={isIOS ? "Add to Home Screen" : "Install App"}
      aria-label={isIOS ? "Add to Home Screen" : "Install App"}
    >
      {isIOS ? (
        <Share className="h-3.5 w-3.5" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
      <span className="hidden sm:inline">Install</span>
    </button>
  );
}
