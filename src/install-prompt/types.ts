export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface InstallPromptState {
  isVisible: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  installPromptEvent: BeforeInstallPromptEvent | null;
  capabilities: InstallCapabilities;
}

export interface InstallPromptTiming {
  visitCount: number;
  lastPromptTime: number;
  lastDismissalTime: number;
  totalEngagementTime: number;
  hasCompletedFirstGame: boolean;
  dismissalType: "temporary" | "permanent" | null;
}

export interface InstallPromptContext {
  page: "homepage" | "game" | "other";
  gameJustCompleted?: boolean;
}

export interface InstallCapabilities {
  canInstall: boolean;
  installMethod: "beforeinstallprompt" | "manual" | "none";
  deviceType: "desktop" | "mobile" | "tablet";
  browserSupport: boolean;
}
