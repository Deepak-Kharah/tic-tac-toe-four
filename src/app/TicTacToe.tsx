"use client";

import classNames from "classnames";
import React, { useState } from "react";
import { signal } from "@preact/signals";
import styles from "./TicTacToe.module.css";

interface Cell {
  value: "X" | "O" | null;
  willDisappear: boolean;
  winningCell: boolean;
}

type Board = [[Cell, Cell, Cell], [Cell, Cell, Cell], [Cell, Cell, Cell]];

const winnerSignal = signal<"X" | "O" | null>(null);

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

interface RowProps {
  idx: number;
  row: [Cell, Cell, Cell];
  handleClick: (row: number, col: number) => void;
}

function Row(props: RowProps) {
  const { idx, row } = props;
  return (
    <div className="flex gap-2">
      {row.map((cell, index) => {
        return (
          <Cell
            key={index}
            cell={cell}
            row={idx}
            col={index}
            handleClick={props.handleClick}
          />
        );
      })}
    </div>
  );
}

interface CellProps {
  cell: Cell;
  row: number;
  col: number;
  handleClick: (row: number, col: number) => void;
}

function Cell(props: CellProps) {
  const { cell } = props;
  return (
    <button
      className={classNames(
        styles.cell,
        "gap-3 size-20 transition flex items-center justify-center",
        { [styles["winning-cell"]]: cell.winningCell },
        { [styles["filled-cell"]]: !!cell.value },
        { [styles["will-disappear-cell"]]: cell.willDisappear }
      )}
      disabled={!!cell.value || !!winnerSignal.value}
      onClick={() => props.handleClick(props.row, props.col)}
    >
      {cell.value === "X" ? <Cross /> : cell.value === "O" ? <Circle /> : null}
    </button>
  );
}

function Cross() {
  return <div className={classNames(styles["cross"])}></div>;
}

function Circle() {
  return <div className={classNames(styles["circle"])}></div>;
}

function didWin(board: Board): null | ["X" | "O", [number, number][]] {
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0].value &&
      board[i][1].value &&
      board[i][2].value &&
      board[i][0].value === board[i][1].value &&
      board[i][1].value === board[i][2].value
    ) {
      return [
        board[i][0].value!,
        [
          [i, 0],
          [i, 1],
          [i, 2],
        ],
      ];
    }

    if (
      board[0][i].value &&
      board[1][i].value &&
      board[2][i].value &&
      board[0][i].value === board[1][i].value &&
      board[1][i].value === board[2][i].value
    ) {
      return [
        board[0][i].value!,
        [
          [0, i],
          [1, i],
          [2, i],
        ],
      ];
    }
  }

  if (
    board[0][0].value &&
    board[1][1].value &&
    board[2][2].value &&
    board[0][0].value === board[1][1].value &&
    board[1][1].value === board[2][2].value
  ) {
    return [
      board[0][0].value!,
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
    ];
  }

  if (
    board[0][2].value &&
    board[1][1].value &&
    board[2][0].value &&
    board[0][2].value === board[1][1].value &&
    board[1][1].value === board[2][0].value
  ) {
    return [
      board[0][2].value!,
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];
  }

  return null;
}

export default TicTacToe;
