import { Signal, signal } from "@preact/signals";
import { Board } from "./interface/ticTacToe.type";

export const winnerSignal = signal<"X" | "O" | null>(null);

export const board: Signal<Board> = signal([
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
]);

export const isXTurn = signal(true);
