import { describe, expect, it } from "vitest";
import { didWin } from "../gameLogic";
import { getDefaultBoard } from "../signal";

describe("gameLogic", () => {
  describe("didWin", () => {
    it("should return null for an empty board", () => {
      const emptyBoard = getDefaultBoard();
      const result = didWin(emptyBoard);
      expect(result).toBeNull();
    });

    it("should return null for a partial/ongoing game without a winner", () => {
      const partialBoard = getDefaultBoard();
      // Place some pieces but no winning combination
      partialBoard[0][0].value = "X";
      partialBoard[0][1].value = "O";
      partialBoard[1][0].value = "O";
      partialBoard[1][1].value = "X";

      const result = didWin(partialBoard);
      expect(result).toBeNull();
    });

    it("should detect a horizontal win in row 0 and return winner + coordinates", () => {
      const board = getDefaultBoard();
      // X wins in top row
      board[0][0].value = "X";
      board[0][1].value = "X";
      board[0][2].value = "X";

      const result = didWin(board);
      expect(result).toEqual([
        "X",
        [
          [0, 0],
          [0, 1],
          [0, 2],
        ],
      ]);
    });

    it("should detect a horizontal win in row 1 and return winner + coordinates", () => {
      const board = getDefaultBoard();
      // O wins in middle row
      board[1][0].value = "O";
      board[1][1].value = "O";
      board[1][2].value = "O";

      const result = didWin(board);
      expect(result).toEqual([
        "O",
        [
          [1, 0],
          [1, 1],
          [1, 2],
        ],
      ]);
    });

    it("should detect a horizontal win in row 2 and return winner + coordinates", () => {
      const board = getDefaultBoard();
      // X wins in bottom row
      board[2][0].value = "X";
      board[2][1].value = "X";
      board[2][2].value = "X";

      const result = didWin(board);
      expect(result).toEqual([
        "X",
        [
          [2, 0],
          [2, 1],
          [2, 2],
        ],
      ]);
    });

    it("should detect a vertical win in col 0 and return winner + coordinates", () => {
      const board = getDefaultBoard();
      // O wins in left column
      board[0][0].value = "O";
      board[1][0].value = "O";
      board[2][0].value = "O";

      const result = didWin(board);
      expect(result).toEqual([
        "O",
        [
          [0, 0],
          [1, 0],
          [2, 0],
        ],
      ]);
    });

    it("should detect a vertical win in col 1 and return winner + coordinates", () => {
      const board = getDefaultBoard();
      // X wins in middle column
      board[0][1].value = "X";
      board[1][1].value = "X";
      board[2][1].value = "X";

      const result = didWin(board);
      expect(result).toEqual([
        "X",
        [
          [0, 1],
          [1, 1],
          [2, 1],
        ],
      ]);
    });

    it("should detect a vertical win in col 2 and return winner + coordinates", () => {
      const board = getDefaultBoard();
      // O wins in right column
      board[0][2].value = "O";
      board[1][2].value = "O";
      board[2][2].value = "O";

      const result = didWin(board);
      expect(result).toEqual([
        "O",
        [
          [0, 2],
          [1, 2],
          [2, 2],
        ],
      ]);
    });

    it("should detect a main diagonal win and return winner + coordinates", () => {
      const board = getDefaultBoard();
      // X wins on main diagonal (top-left to bottom-right)
      board[0][0].value = "X";
      board[1][1].value = "X";
      board[2][2].value = "X";

      const result = didWin(board);
      expect(result).toEqual([
        "X",
        [
          [0, 0],
          [1, 1],
          [2, 2],
        ],
      ]);
    });

    it("should detect an anti-diagonal win and return winner + coordinates", () => {
      const board = getDefaultBoard();
      // O wins on anti-diagonal (top-right to bottom-left)
      board[0][2].value = "O";
      board[1][1].value = "O";
      board[2][0].value = "O";

      const result = didWin(board);
      expect(result).toEqual([
        "O",
        [
          [0, 2],
          [1, 1],
          [2, 0],
        ],
      ]);
    });
  });
});
