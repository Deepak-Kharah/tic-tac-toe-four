import { Signal, signal } from "@preact/signals";
import { Board } from "./interface/ticTacToe.type";

export const winnerSignal = signal<"X" | "O" | null>(null);

export function getDefaultBoard(): Board {
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

export const board: Signal<Board> = signal(getDefaultBoard());

export const isXTurn = signal(true);
