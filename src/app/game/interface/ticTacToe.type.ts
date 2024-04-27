export type Cell = {
  value: "X" | "O" | null;
  willDisappear: boolean;
  winningCell: boolean;
};

export type Board = [
  [Cell, Cell, Cell],
  [Cell, Cell, Cell],
  [Cell, Cell, Cell]
];
