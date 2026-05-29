"use client";
import { useState, useEffect } from "react";
import TicTacToe from "./components/TicTacToe";
import { InstallPrompt } from "@/install-prompt/components/InstallPrompt";
import { winnerSignal } from "./signal";
import { effect } from "@preact/signals";

function Game() {
  const [gameJustCompleted, setGameJustCompleted] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const dispose = effect(() => {
      if (winnerSignal.value) {
        setGameJustCompleted(true);
        // Re-arm the prompt window after 5s so a later win can trigger it again.
        timer = setTimeout(() => setGameJustCompleted(false), 5000);
      } else {
        setGameJustCompleted(false);
      }
    });
    return () => {
      dispose();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <main className="flex-1" vaul-drawer-wrapper="">
      <TicTacToe />
      <InstallPrompt context={{ page: "game", gameJustCompleted }} />
    </main>
  );
}

export default Game;
