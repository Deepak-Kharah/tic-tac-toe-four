"use client";

import { X, Download, Share } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInstallPrompt } from "../hooks";
import { getInstallInstructions } from "../utils";
import type { InstallPromptContext } from "../types";

interface InstallPromptProps {
  context: InstallPromptContext;
}

export function InstallPrompt({ context }: InstallPromptProps) {
  const {
    isVisible,
    isIOS,
    isAndroid,
    canInstall,
    installMethod,
    isInstalling,
    handleInstall,
    handleDismiss,
    installPromptEvent,
  } = useInstallPrompt(context);

  const { title, description } = getInstallInstructions();

  // Don't render if can't install or not visible
  if (!canInstall || !isVisible) {
    return null;
  }

  const showInstallButton =
    installMethod === "beforeinstallprompt" && installPromptEvent;
  const showManualInstructions =
    installMethod === "manual" || isIOS || isAndroid;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          duration: 0.3,
        }}
        className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
      >
        <motion.div
          className="w-full max-w-sm rounded-lg border border-slate-200/20 bg-slate-900/95 p-4 shadow-lg backdrop-blur-sm"
          layout
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              {isIOS ? (
                <Share className="h-5 w-5 text-blue-400" />
              ) : (
                <Download className="h-5 w-5 text-blue-400" />
              )}
              <h3 className="text-sm font-medium text-white truncate">
                {title}
              </h3>
            </div>
            <button
              onClick={() => handleDismiss("temporary")}
              className="flex-shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
              aria-label="Dismiss install prompt"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 mb-3">{description}</p>

          {showInstallButton && (
            <motion.button
              onClick={handleInstall}
              disabled={isInstalling}
              className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.98 }}
            >
              {isInstalling ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  Installing...
                </div>
              ) : (
                "Install App"
              )}
            </motion.button>
          )}

          {showManualInstructions && !showInstallButton && (
            <div className="flex gap-2">
              <button
                onClick={() => handleDismiss("temporary")}
                className="flex-1 rounded-md bg-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                Maybe Later
              </button>
              <button
                onClick={() => handleDismiss("permanent")}
                className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Got It
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
