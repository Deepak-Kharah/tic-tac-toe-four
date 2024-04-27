import { Board } from "./interface/ticTacToe.type";

export function didWin(board: Board): null | ["X" | "O", [number, number][]] {
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
