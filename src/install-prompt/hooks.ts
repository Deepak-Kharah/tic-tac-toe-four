"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  InstallPromptState,
  InstallPromptContext,
  BeforeInstallPromptEvent,
} from "./types";
import {
  detectDevice,
  getInstallCapabilities,
  shouldShowInstallPrompt,
  markPromptShown,
  markPromptDismissed,
  triggerInstall,
  incrementVisitCount,
  addEngagementTime,
} from "./utils";

export function useInstallPrompt(context: InstallPromptContext) {
  const [state, setState] = useState<InstallPromptState>({
    isVisible: false,
    isStandalone: false,
    isIOS: false,
    isAndroid: false,
    isDismissed: false,
    installPromptEvent: null,
  });

  const [isInstalling, setIsInstalling] = useState(false);
  const engagementStartTime = useRef<number>(Date.now());

  // Initialize state on mount
  useEffect(() => {
    const { isIOS, isAndroid, isStandalone } = detectDevice();
    const capabilities = getInstallCapabilities();

    setState((prev) => ({
      ...prev,
      isIOS,
      isAndroid,
      isStandalone,
      isDismissed: !capabilities.canInstall,
    }));

    // Track visit on homepage
    if (context.page === "homepage") {
      incrementVisitCount();
    }

    // Track engagement time
    const startTime = Date.now();
    engagementStartTime.current = startTime;

    return () => {
      const engagementTime = Date.now() - startTime;
      addEngagementTime(engagementTime);
    };
  }, [context.page]);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;

      setState((prev) => ({
        ...prev,
        installPromptEvent: installEvent,
      }));

      // Check if we should show the prompt based on timing logic
      if (shouldShowInstallPrompt(context)) {
        setState((prev) => ({ ...prev, isVisible: true }));
        markPromptShown();
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, [context]);

  // Handle iOS timing (manual install instructions)
  useEffect(() => {
    if (state.isIOS && !state.isStandalone) {
      if (shouldShowInstallPrompt(context)) {
        // Add delay for iOS to avoid overwhelming users
        const timer = setTimeout(
          () => {
            setState((prev) => ({ ...prev, isVisible: true }));
            markPromptShown();
          },
          context.page === "game" ? 1000 : 3000,
        ); // Shorter delay after game completion

        return () => clearTimeout(timer);
      }
    }
  }, [state.isIOS, state.isStandalone, context]);

  // Handle Android manual install
  useEffect(() => {
    if (state.isAndroid && !state.isStandalone && !state.installPromptEvent) {
      if (shouldShowInstallPrompt(context)) {
        setState((prev) => ({ ...prev, isVisible: true }));
        markPromptShown();
      }
    }
  }, [state.isAndroid, state.isStandalone, state.installPromptEvent, context]);

  const handleInstall = useCallback(async () => {
    setIsInstalling(true);

    try {
      const success = await triggerInstall(state.installPromptEvent);

      if (success) {
        setState((prev) => ({
          ...prev,
          isVisible: false,
          isStandalone: true,
        }));
      }
    } catch (error) {
      console.warn("Installation failed:", error);
    } finally {
      setIsInstalling(false);
    }
  }, [state.installPromptEvent]);

  const handleDismiss = useCallback(
    (type: "temporary" | "permanent" = "temporary") => {
      setState((prev) => ({
        ...prev,
        isVisible: false,
        isDismissed: true,
      }));
      markPromptDismissed(type);
    },
    [],
  );

  const showPrompt = useCallback(() => {
    if (shouldShowInstallPrompt(context)) {
      setState((prev) => ({ ...prev, isVisible: true }));
      markPromptShown();
    }
  }, [context]);

  const hidePrompt = useCallback(() => {
    setState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const capabilities = getInstallCapabilities();

  return {
    // State
    isVisible: state.isVisible && !state.isStandalone,
    isStandalone: state.isStandalone,
    isIOS: state.isIOS,
    isAndroid: state.isAndroid,
    canInstall: capabilities.canInstall && !state.isStandalone,
    installMethod: capabilities.installMethod,
    isInstalling,

    // Actions
    handleInstall,
    handleDismiss,
    showPrompt,
    hidePrompt,

    // Install event for manual triggering
    installPromptEvent: state.installPromptEvent,
  };
}

// Lightweight hook for components that just need install capabilities
export function useInstallCapabilities() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [capabilities, setCapabilities] = useState(getInstallCapabilities());

  useEffect(() => {
    const { isStandalone: standalone } = detectDevice();
    setIsStandalone(standalone);
    setCapabilities(getInstallCapabilities());
  }, []);

  return {
    canInstall: capabilities.canInstall && !isStandalone,
    isStandalone,
    installMethod: capabilities.installMethod,
    deviceType: capabilities.deviceType,
  };
}
