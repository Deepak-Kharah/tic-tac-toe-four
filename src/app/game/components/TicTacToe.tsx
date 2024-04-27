"use client";

import { effect } from "@preact/signals";
import classNames from "classnames";
import { useState } from "react";
import { didWin } from "../gameLogic";
import { board } from "../signal";
import { Row } from "./Row";
import styles from "./TicTacToe.module.css";
import { isXTurn as isXTurnSignal } from "../signal";
import { Circle, Cross } from "./Pieces";

function TicTacToe() {
  const [gameOver, setGameOver] = useState(false);
  const [isXTurn, setIsXTurn] = useState(true);

  effect(() => {
    const winner = didWin(board.value);
    if (winner) {
      if (winner && !gameOver) setGameOver(true);
    } else if (isXTurn !== isXTurnSignal.value) setIsXTurn(isXTurnSignal.value);
  });

  return (
    <>
      <section className="flex gap-2 py-5 items-center">
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
      <div
        className={classNames("flex flex-col gap-2", {
          [styles["game-over"]]: !!gameOver,
        })}
      >
        {Array.from({ length: 3 }).map((_, idx) => {
          return <Row key={idx} row={idx} />;
        })}
      </div>
    </>
  );
}

export default TicTacToe;
