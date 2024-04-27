"use client";

import classNames from "classnames";
import { useState } from "react";
import { didWin } from "../gameLogic";
import { Board, Cell } from "../interface/ticTacToe.type";
import { winnerSignal } from "../signal";
import { Row } from "./Row";
import styles from "./TicTacToe.module.css";

function getDefaultBoard(): Board {
  return [
    [
      { value: null, willDisappear: false, winningCell: false },
      { value: null, willDisappear: false, winningCell: false },
      { value: null, willDisappear: false, winningCell: false },
    ],
    [
      { value: null, willDisappear: false, winningCell: false },
      { value: null, willDisappear: false, winningCell: false },
      { value: null, willDisappear: false, winningCell: false },
    ],
    [
      { value: null, willDisappear: false, winningCell: false },
      { value: null, willDisappear: false, winningCell: false },
      { value: null, willDisappear: false, winningCell: false },
    ],
  ];
}

function TicTacToe() {
  const [board, setBoard] = useState<Board>(getDefaultBoard);
  const [history, setHistory] = useState<{ x: number; y: number }[]>([]);
  const [disappearing, setDisappearing] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isXTurn, setIsXTurn] = useState(true);

  function handleClick(row: number, col: number) {
    if (board[row][col].value) {
      return;
    }

    const newBoard = structuredClone(board);
    const newHistory = structuredClone(history);

    // set new cells
    newBoard[row][col].value = isXTurn ? "X" : "O";
    newHistory.push({ x: row, y: col });

    const winner = didWin(newBoard);

    if (winner) {
      winnerSignal.value = winner[0];
      winner[1].forEach(([x, y]) => {
        newBoard[x][y].winningCell = true;
      });
    } else {
      // reset last cell
      if (disappearing) {
        const { x, y } = disappearing;
        newBoard[x][y].value = null;
      }

      // Set current disappearing cell
      if (newHistory.length === 6) {
        const { x, y } = newHistory[0];
        newBoard[x][y].willDisappear = true;
        setDisappearing({ x, y });
        newHistory.shift();
      }
    }

    if (disappearing) {
      const { x, y } = disappearing;
      newBoard[x][y].willDisappear = false;
    }

    setBoard(newBoard);
    setHistory(newHistory);
    setIsXTurn(!isXTurn);
  }

  return (
    <>
      <section>
        {!!winnerSignal.value && <div>{winnerSignal.value} wins!</div>}
      </section>
      <div
        className={classNames("flex flex-col gap-2", {
          [styles["game-over"]]: !!winnerSignal.value,
        })}
      >
        {board.map((row, idx) => {
          return (
            <Row key={idx} idx={idx} row={row} handleClick={handleClick} />
          );
        })}
      </div>
    </>
  );
}

export default TicTacToe;
