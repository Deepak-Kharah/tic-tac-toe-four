import { Signal, signal } from "@preact/signals";
import { Board } from "./interface/ticTacToe.type";

export const winnerSignal = signal<"X" | "O" | null>(null);

// History of moves for disappearing mechanic
export const history = signal<{ x: number; y: number }[]>([]);

// Currently disappearing cell
export const disappearing = signal<{ x: number; y: number } | null>(null);

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

// Reset function to reset all game state
export function resetGame() {
  board.value = getDefaultBoard();
  isXTurn.value = true;
  winnerSignal.value = null;
  history.value = [];
  disappearing.value = null;
}
