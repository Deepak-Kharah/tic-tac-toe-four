"use client";

import { effect } from "@preact/signals";
import classNames from "classnames";
import { useState } from "react";
import { didWin } from "../gameLogic";
import { board, getDefaultBoard } from "../signal";
import { Row } from "./Row";
import styles from "./TicTacToe.module.css";
import { isXTurn as isXTurnSignal } from "../signal";
import { Circle, Cross } from "./Pieces";
import { resetGameComponents } from "./Cell";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function TicTacToe() {
  const [gameOver, setGameOver] = useState(false);
  const [isXTurn, setIsXTurn] = useState(true);

  effect(() => {
    const winner = didWin(board.value);
    if (winner) {
      if (winner && !gameOver) setGameOver(true);
    } else if (isXTurn !== isXTurnSignal.value) setIsXTurn(isXTurnSignal.value);
  });

  function resetGame() {
    setGameOver(false);
    board.value = getDefaultBoard();
    isXTurnSignal.value = true;
    resetGameComponents();
  }

  return (
    <>
      <section className="flex gap-2 items-center">
        <div
          className={classNames("size-20 flex items-center justify-center", {
            [styles.active]: isXTurn,
          })}
        >
          <Cross />
        </div>
        <div className="font-extrabold text-3xl size-20 flex items-center justify-center text-slate-400 ">
          --
        </div>
        <div
          className={classNames("size-20 flex items-center justify-center", {
            [styles.active]: !isXTurn,
          })}
        >
          <Circle />
        </div>
      </section>
      <section
        className={classNames("flex flex-col gap-2", {
          [styles["game-over"]]: !!gameOver,
        })}
      >
        {Array.from({ length: 3 }).map((_, idx) => {
          return <Row key={idx} row={idx} />;
        })}
      </section>
      <section>
        {!!gameOver ? (
          <button
            className={classNames(
              "px-4 py-2 text-sm font-light rounded-lg   hover:text-white hover:bg-blue-900 transition-all bg-blue-900/70 text-slate-300 shadow-lg"
            )}
            onClick={resetGame}
          >
            New game
          </button>
        ) : (
          <Dialog>
            <DialogTrigger
              className={classNames(
                "px-4 py-2 text-sm font-light rounded-lg   hover:text-white hover:bg-blue-900  transition-all bg-gray-900/60 text-gray-500/80"
              )}
            >
              New game
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start over?</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                The game didn&apos;t finish yet. Are you sure you want to start
                a new game? All progress will be lost
              </DialogDescription>
              <DialogFooter>
                <DialogClose className="px-4 py-2 text-sm font-light rounded-lg hover:text-white hover:bg-gray-900 transition-all">
                  Cancel
                </DialogClose>
                <DialogClose
                  onClick={resetGame}
                  className="px-4 py-2 text-sm font-light rounded-lg bg-blue-900/70 text-slate-300 shadow-lg hover:bg-blue-900 transition-all"
                >
                  Start new game
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </section>
    </>
  );
}

export default TicTacToe;
