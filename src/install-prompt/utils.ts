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

// Default capabilities for SSR and initial state
export const DEFAULT_INSTALL_CAPABILITIES: InstallCapabilities = {
  canInstall: false,
  installMethod: "none",
  deviceType: "desktop",
  browserSupport: false,
};

// Device and browser detection
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
    (window.navigator as any).standalone === true ||
    document.referrer.includes("android-app://");

  return { isIOS, isAndroid, isStandalone };
}

export function getInstallCapabilities(): InstallCapabilities {
  if (typeof window === "undefined") {
    return DEFAULT_INSTALL_CAPABILITIES;
  }

  const { isIOS, isAndroid, isStandalone } = detectDevice();

  if (isStandalone) {
    return {
      canInstall: false,
      installMethod: "none",
      deviceType: isIOS || isAndroid ? "mobile" : "desktop",
      browserSupport: true,
    };
  }

  const deviceType = isIOS || isAndroid ? "mobile" : "desktop";
  const browserSupport = "serviceWorker" in navigator;

  // Check if beforeinstallprompt is supported
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

// Timing and storage management
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

    // Check for legacy dismissal
    const legacyDismissed = localStorage.getItem(STORAGE_KEYS.DISMISSED);
    if (legacyDismissed === "true") {
      return { ...defaultTiming, dismissalType: "permanent" };
    }
  } catch (error) {
    console.warn("Failed to read install prompt timing:", error);
  }

  return defaultTiming;
}

export function saveInstallTiming(timing: Partial<InstallPromptTiming>): void {
  try {
    const current = getInstallTiming();
    const updated = { ...current, ...timing };
    localStorage.setItem(STORAGE_KEYS.TIMING, JSON.stringify(updated));
  } catch (error) {
    console.warn("Failed to save install prompt timing:", error);
  }
}

export function incrementVisitCount(): void {
  const timing = getInstallTiming();
  saveInstallTiming({ visitCount: timing.visitCount + 1 });
}

export function addEngagementTime(timeMs: number): void {
  const timing = getInstallTiming();
  saveInstallTiming({
    totalEngagementTime: timing.totalEngagementTime + timeMs,
  });
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

  // Keep legacy storage for backward compatibility
  if (type === "permanent") {
    localStorage.setItem(STORAGE_KEYS.DISMISSED, "true");
  }
}

// Timing logic
export function shouldShowInstallPrompt(
  context: InstallPromptContext,
): boolean {
  const capabilities = getInstallCapabilities();
  if (!capabilities.canInstall) {
    return false;
  }

  const timing = getInstallTiming();
  const now = Date.now();

  // Never show if permanently dismissed
  if (timing.dismissalType === "permanent") {
    return false;
  }

  // Respect snooze period after temporary dismissal
  if (timing.dismissalType === "temporary" && timing.lastDismissalTime > 0) {
    const timeSinceDismissal = now - timing.lastDismissalTime;
    if (timeSinceDismissal < TIMING_CONSTANTS.SNOOZE_DURATION) {
      return false;
    }
  }

  // Respect reprompt interval
  if (timing.lastPromptTime > 0) {
    const timeSinceLastPrompt = now - timing.lastPromptTime;
    if (timeSinceLastPrompt < TIMING_CONSTANTS.REPROMPT_INTERVAL) {
      return false;
    }
  }

  // Game page specific logic
  if (context.page === "game") {
    // Only show after first game completion and only once per game completion
    return context.gameJustCompleted === true && !timing.hasCompletedFirstGame;
  }

  // Homepage specific logic
  if (context.page === "homepage") {
    // Never on first visit
    if (timing.visitCount < TIMING_CONSTANTS.MIN_VISIT_COUNT) {
      return false;
    }

    // Require minimum engagement time
    if (timing.totalEngagementTime < TIMING_CONSTANTS.MIN_ENGAGEMENT_TIME) {
      return false;
    }

    return true;
  }

  return false;
}

// PWA installation utilities
export function triggerInstall(
  installPromptEvent: BeforeInstallPromptEvent | null,
): Promise<boolean> {
  return new Promise(async (resolve) => {
    if (!installPromptEvent) {
      resolve(false);
      return;
    }

    try {
      await installPromptEvent.prompt();
      const choiceResult = await installPromptEvent.userChoice;
      resolve(choiceResult.outcome === "accepted");
    } catch (error) {
      console.warn("Install prompt error:", error);
      resolve(false);
    }
  });
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
