import type {
  InstallPromptTiming,
  InstallPromptContext,
  InstallCapabilities,
  BeforeInstallPromptEvent,
} from "./types";

const STORAGE_KEYS = {
  TIMING: "install-prompt-timing",
  DISMISSED: "install-prompt-dismissed", // Keep for backward compatibility
} as const;

const TIMING_CONSTANTS = {
  MIN_VISIT_COUNT: 3,
  MIN_ENGAGEMENT_TIME: 30000, // 30 seconds
  SNOOZE_DURATION: 7 * 24 * 60 * 60 * 1000, // 1 week
  REPROMPT_INTERVAL: 7 * 24 * 60 * 60 * 1000, // 1 week
} as const;

export const DEFAULT_INSTALL_CAPABILITIES: InstallCapabilities = {
  canInstall: false,
  installMethod: "none",
  deviceType: "desktop",
  browserSupport: false,
};

export function detectDevice(): {
  isIOS: boolean;
  isAndroid: boolean;
  isStandalone: boolean;
} {
  if (typeof window === "undefined") {
    return { isIOS: false, isAndroid: false, isStandalone: false };
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true ||
    document.referrer.includes("android-app://");

  return { isIOS, isAndroid, isStandalone };
}

export function getInstallCapabilities(): InstallCapabilities {
  if (typeof window === "undefined") {
    return DEFAULT_INSTALL_CAPABILITIES;
  }

  const { isIOS, isAndroid, isStandalone } = detectDevice();
  const deviceType = isIOS || isAndroid ? "mobile" : "desktop";

  if (isStandalone) {
    return {
      canInstall: false,
      installMethod: "none",
      deviceType,
      browserSupport: true,
    };
  }

  const browserSupport = "serviceWorker" in navigator;
  const supportsBeforeInstall =
    "BeforeInstallPromptEvent" in window ||
    navigator.userAgent.includes("Chrome") ||
    navigator.userAgent.includes("Edge");

  let installMethod: InstallCapabilities["installMethod"] = "none";
  let canInstall = false;

  if (supportsBeforeInstall && !isIOS) {
    installMethod = "beforeinstallprompt";
    canInstall = true;
  } else if ((isIOS || isAndroid) && browserSupport) {
    installMethod = "manual";
    canInstall = true;
  }

  return { canInstall, installMethod, deviceType, browserSupport };
}

export function getInstallTiming(): InstallPromptTiming {
  const defaultTiming: InstallPromptTiming = {
    visitCount: 0,
    lastPromptTime: 0,
    lastDismissalTime: 0,
    totalEngagementTime: 0,
    hasCompletedFirstGame: false,
    dismissalType: null,
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TIMING);
    if (stored) {
      return { ...defaultTiming, ...JSON.parse(stored) };
    }

    const legacyDismissed = localStorage.getItem(STORAGE_KEYS.DISMISSED);
    if (legacyDismissed === "true") {
      return { ...defaultTiming, dismissalType: "permanent" };
    }
  } catch (error) {
    console.warn("Failed to read install prompt timing:", error);
  }

  return defaultTiming;
}

export function saveInstallTiming(
  timing: Partial<InstallPromptTiming>,
  current: InstallPromptTiming = getInstallTiming(),
): void {
  try {
    const updated = { ...current, ...timing };
    localStorage.setItem(STORAGE_KEYS.TIMING, JSON.stringify(updated));
  } catch (error) {
    console.warn("Failed to save install prompt timing:", error);
  }
}

export function incrementVisitCount(): void {
  const timing = getInstallTiming();
  saveInstallTiming({ visitCount: timing.visitCount + 1 }, timing);
}

export function addEngagementTime(timeMs: number): void {
  const timing = getInstallTiming();
  saveInstallTiming(
    { totalEngagementTime: timing.totalEngagementTime + timeMs },
    timing,
  );
}

export function markFirstGameCompleted(): void {
  saveInstallTiming({ hasCompletedFirstGame: true });
}

export function markPromptShown(): void {
  saveInstallTiming({ lastPromptTime: Date.now() });
}

export function markPromptDismissed(
  type: "temporary" | "permanent" = "temporary",
): void {
  saveInstallTiming({
    lastDismissalTime: Date.now(),
    dismissalType: type,
  });

  if (type === "permanent") {
    localStorage.setItem(STORAGE_KEYS.DISMISSED, "true");
  }
}

export function shouldShowInstallPrompt(
  context: InstallPromptContext,
): boolean {
  const capabilities = getInstallCapabilities();
  if (!capabilities.canInstall) {
    return false;
  }

  const timing = getInstallTiming();
  const now = Date.now();

  if (timing.dismissalType === "permanent") {
    return false;
  }

  if (timing.dismissalType === "temporary" && timing.lastDismissalTime > 0) {
    if (now - timing.lastDismissalTime < TIMING_CONSTANTS.SNOOZE_DURATION) {
      return false;
    }
  }

  if (timing.lastPromptTime > 0) {
    if (now - timing.lastPromptTime < TIMING_CONSTANTS.REPROMPT_INTERVAL) {
      return false;
    }
  }

  if (context.page === "game") {
    return context.gameJustCompleted === true && !timing.hasCompletedFirstGame;
  }

  if (context.page === "homepage") {
    if (timing.visitCount < TIMING_CONSTANTS.MIN_VISIT_COUNT) {
      return false;
    }
    if (timing.totalEngagementTime < TIMING_CONSTANTS.MIN_ENGAGEMENT_TIME) {
      return false;
    }
    return true;
  }

  return false;
}

export async function triggerInstall(
  installPromptEvent: BeforeInstallPromptEvent | null,
): Promise<boolean> {
  if (!installPromptEvent) {
    return false;
  }

  try {
    await installPromptEvent.prompt();
    const choiceResult = await installPromptEvent.userChoice;
    return choiceResult.outcome === "accepted";
  } catch (error) {
    console.warn("Install prompt error:", error);
    return false;
  }
}

export function getInstallInstructions(): {
  title: string;
  description: string;
} {
  const { isIOS, isAndroid } = detectDevice();

  if (isIOS) {
    return {
      title: "Add to Home Screen",
      description:
        'Tap the Share button and select "Add to Home Screen" for the best experience.',
    };
  }

  if (isAndroid) {
    return {
      title: "Install App",
      description:
        'Tap the menu button and select "Install app" or "Add to Home screen".',
    };
  }

  return {
    title: "Install App",
    description: "Install this app for quick access and offline play.",
  };
}
