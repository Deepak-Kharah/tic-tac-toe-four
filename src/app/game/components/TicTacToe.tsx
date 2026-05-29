"use client";

import { launchFirework, resetConfetti } from "@/lib/confetti";
import { effect } from "@preact/signals";
import { cn } from "@/lib/utils";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  isXTurn as isXTurnSignal,
  resetGame as resetGameSignals,
  winnerSignal,
} from "../signal";
import { markFirstGameCompleted } from "@/install-prompt/utils";
import NewGameDialog from "./NewGameDialog";
import { Circle, Cross } from "./Pieces";
import { Row } from "./Row";
import styles from "./TicTacToe.module.css";

const gameAnimationVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0.2, y: 20 },
};

function TicTacToe() {
  const [gameOver, setGameOver] = useState(false);
  const hasCelebratedRef = useRef(false);

  useEffect(() => {
    return effect(() => {
      const winner = winnerSignal.value;
      if (winner && !hasCelebratedRef.current) {
        // Set ref before any awaits so a second signal tick can't re-enter.
        hasCelebratedRef.current = true;
        setGameOver(true);
        launchFirework().catch(console.error);
        markFirstGameCompleted();
      }
    });
  }, []);

  function resetGame() {
    setGameOver(false);
    hasCelebratedRef.current = false;
    resetConfetti();
    resetGameSignals();
  }

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit={"exit"}
        transition={{ staggerChildren: 0.1 }}
        className="flex flex-col justify-center items-center gap-5 h-full"
      >
        <motion.section
          layout
          variants={gameAnimationVariants}
          className="flex gap-2 items-center"
        >
          <div
            data-testid="active-player-x"
            className={cn("size-20 flex items-center justify-center", {
              [styles.active]: isXTurnSignal.value,
            })}
          >
            <Cross />
          </div>
          <div className="font-extrabold text-3xl size-20 flex items-center justify-center text-slate-400 ">
            --
          </div>
          <div
            data-testid="active-player-o"
            className={cn("size-20 flex items-center justify-center", {
              [styles.active]: !isXTurnSignal.value,
            })}
          >
            <Circle />
          </div>
        </motion.section>
        <motion.section
          variants={gameAnimationVariants}
          className={cn("flex flex-col gap-2", {
            [styles["game-over"]]: !!gameOver,
          })}
        >
          {Array.from({ length: 3 }).map((_, idx) => {
            return <Row key={idx} row={idx} />;
          })}
        </motion.section>
        <motion.section variants={gameAnimationVariants}>
          {!!gameOver ? (
            <button
              className="px-4 py-2 text-sm font-light rounded-lg hover:text-white hover:bg-blue-900 transition-all bg-blue-900/70 text-slate-300 shadow-lg"
              onClick={resetGame}
            >
              New game
            </button>
          ) : (
            <NewGameDialog
              title="Start over?"
              description="The game didn't finish yet. Are you sure you want to start a new game? All progress will be lost"
              triggerText="New game"
              onClick={resetGame}
              onClickText="Start new game"
            />
          )}
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}

export default TicTacToe;
