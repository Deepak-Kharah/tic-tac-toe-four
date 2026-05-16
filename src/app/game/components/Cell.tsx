"use client";

import { effect } from "@preact/signals";
import classNames from "classnames";
import isEqual from "lodash.isequal";
import { useState } from "react";
import { didWin } from "../gameLogic";
import { board, isXTurn, winnerSignal, history, disappearing } from "../signal";
import { Circle, Cross } from "./Pieces";
import styles from "./TicTacToe.module.css";

interface CellProps {
  row: number;
  col: number;
}

function handleClick(row: number, col: number) {
  if (board.value[row][col].value) {
    return;
  }

  const newBoard = structuredClone(board.value);
  const newHistory = structuredClone(history.value);

  // set new cells
  newBoard[row][col].value = isXTurn.value ? "X" : "O";
  newHistory.push({ x: row, y: col });

  const winner = didWin(newBoard);

  if (winner) {
    winnerSignal.value = winner[0];
    winner[1].forEach(([x, y]) => {
      newBoard[x][y].winningCell = true;
    });
  } else {
    // reset last cell
    if (disappearing.value) {
      const { x, y } = disappearing.value;
      newBoard[x][y].value = null;
      newBoard[x][y].willDisappear = false;
    }

    // Set current disappearing cell
    if (newHistory.length === 6) {
      const { x, y } = newHistory[0];
      newBoard[x][y].willDisappear = true;
      disappearing.value = { x, y };
      newHistory.shift();
    }
  }

  board.value = newBoard;
  history.value = newHistory;
  isXTurn.value = !isXTurn.value;
}

export function SingleCell(props: CellProps) {
  const { row, col } = props;

  const [cell, setCell] = useState(board.value[row][col]);

  effect(() => {
    if (!isEqual(cell, board.value[row][col])) {
      setCell(board.value[row][col]);
    }
  });

  return (
    <button
      data-testid={`cell-${row}-${col}`}
      data-disappearing={cell.willDisappear || undefined}
      data-winning={cell.winningCell || undefined}
      data-value={cell.value || ""}
      className={classNames(
        styles.cell,
        "gap-3 size-20 transition flex items-center justify-center",
        { [styles["winning-cell"]]: cell.winningCell },
        { [styles["filled-cell"]]: !!cell.value },
        {
          [styles["will-disappear-cell"]]: cell.willDisappear,
        },
      )}
      disabled={!!cell.value || !!winnerSignal.value}
      onClick={() => handleClick(props.row, props.col)}
    >
      {cell.value === "X" ? <Cross /> : cell.value === "O" ? <Circle /> : null}
    </button>
  );
}
