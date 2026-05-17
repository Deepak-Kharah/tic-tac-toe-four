"use client";
import { useState, useEffect } from "react";
import TicTacToe from "./components/TicTacToe";
import { InstallPrompt } from "@/install-prompt/components/InstallPrompt";
import { board, winnerSignal } from "./signal";
import { effect } from "@preact/signals";

function Game() {
  const [gameJustCompleted, setGameJustCompleted] = useState(false);

  // Listen for game completion
  useEffect(() => {
    return effect(() => {
      if (winnerSignal.value && !gameJustCompleted) {
        setGameJustCompleted(true);
        // Reset the flag after a short delay to allow the install prompt to trigger
        const timer = setTimeout(() => {
          setGameJustCompleted(false);
        }, 5000);
        return () => clearTimeout(timer);
      }

      if (!winnerSignal.value) {
        setGameJustCompleted(false);
      }
    });
  }, [gameJustCompleted]);

  return (
    <main className="flex-1" vaul-drawer-wrapper="">
      <TicTacToe />
      <InstallPrompt context={{ page: "game", gameJustCompleted }} />
    </main>
  );
}

export default Game;
