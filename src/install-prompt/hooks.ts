"use client";

import { useState, useEffect, useCallback } from "react";
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
  DEFAULT_INSTALL_CAPABILITIES,
} from "./utils";

export function useInstallPrompt(context: InstallPromptContext) {
  const { page, gameJustCompleted } = context;
  const [state, setState] = useState<InstallPromptState>({
    isVisible: false,
    isStandalone: false,
    isIOS: false,
    isAndroid: false,
    installPromptEvent: null,
    capabilities: DEFAULT_INSTALL_CAPABILITIES,
  });

  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const { isIOS, isAndroid, isStandalone } = detectDevice();
    const capabilities = getInstallCapabilities();

    setState((prev) => ({
      ...prev,
      isIOS,
      isAndroid,
      isStandalone,
      capabilities,
    }));

    if (page === "homepage") {
      incrementVisitCount();
    }

    const startTime = Date.now();
    return () => {
      addEngagementTime(Date.now() - startTime);
    };
  }, [page]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;

      setState((prev) => ({
        ...prev,
        installPromptEvent: installEvent,
      }));

      if (shouldShowInstallPrompt({ page, gameJustCompleted })) {
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
  }, [page, gameJustCompleted]);

  useEffect(() => {
    if (!state.isIOS || state.isStandalone) return;
    if (!shouldShowInstallPrompt({ page, gameJustCompleted })) return;

    const timer = setTimeout(
      () => {
        setState((prev) => ({ ...prev, isVisible: true }));
        markPromptShown();
      },
      page === "game" ? 1000 : 3000,
    );

    return () => clearTimeout(timer);
  }, [state.isIOS, state.isStandalone, page, gameJustCompleted]);

  useEffect(() => {
    if (!state.isAndroid || state.isStandalone || state.installPromptEvent) {
      return;
    }
    if (!shouldShowInstallPrompt({ page, gameJustCompleted })) return;

    setState((prev) => ({ ...prev, isVisible: true }));
    markPromptShown();
  }, [
    state.isAndroid,
    state.isStandalone,
    state.installPromptEvent,
    page,
    gameJustCompleted,
  ]);

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
      setState((prev) => ({ ...prev, isVisible: false }));
      markPromptDismissed(type);
    },
    [],
  );

  const showPrompt = useCallback(() => {
    if (shouldShowInstallPrompt({ page, gameJustCompleted })) {
      setState((prev) => ({ ...prev, isVisible: true }));
      markPromptShown();
    }
  }, [page, gameJustCompleted]);

  const hidePrompt = useCallback(() => {
    setState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return {
    isVisible: state.isVisible && !state.isStandalone,
    isStandalone: state.isStandalone,
    isIOS: state.isIOS,
    isAndroid: state.isAndroid,
    canInstall: state.capabilities.canInstall && !state.isStandalone,
    installMethod: state.capabilities.installMethod,
    isInstalling,

    handleInstall,
    handleDismiss,
    showPrompt,
    hidePrompt,

    installPromptEvent: state.installPromptEvent,
  };
}

export function useInstallCapabilities() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [capabilities, setCapabilities] = useState(
    DEFAULT_INSTALL_CAPABILITIES,
  );

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
