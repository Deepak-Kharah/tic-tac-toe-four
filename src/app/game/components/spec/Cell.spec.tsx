import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SingleCell } from "../Cell";
import { resetGame, board, isXTurn, winnerSignal } from "../../signal";

describe("Cell Component", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    resetGame();
  });

  it("should render an empty, enabled cell initially", () => {
    render(<SingleCell row={0} col={0} />);

    const cell = screen.getByRole("button");
    expect(cell).toBeInTheDocument();
    expect(cell).not.toBeDisabled();
    expect(cell).toHaveTextContent("");
  });

  it("should become disabled after being clicked", async () => {
    render(<SingleCell row={0} col={0} />);

    const cell = screen.getByRole("button");
    await user.click(cell);

    expect(cell).toBeDisabled();
  });

  it("should not respond to clicks when already filled", async () => {
    // Pre-fill the cell
    const newBoard = structuredClone(board.value);
    newBoard[0][0].value = "X";
    board.value = newBoard;

    render(<SingleCell row={0} col={0} />);

    const cell = screen.getByRole("button");
    expect(cell).toBeDisabled();

    // Try to click - shouldn't change anything
    await user.click(cell);
    expect(board.value[0][0].value).toBe("X");
  });

  it("should update when board signal changes", () => {
    render(<SingleCell row={0} col={0} />);

    // Simulate board change wrapped in act
    act(() => {
      const newBoard = structuredClone(board.value);
      newBoard[0][0].value = "O";
      newBoard[0][0].winningCell = true;
      board.value = newBoard;
    });

    const cell = screen.getByRole("button");
    expect(cell).toBeDisabled();
    expect(cell).toHaveAttribute("data-winning", "true");
  });

  it("should show willDisappear styling when cell is marked for disappearing", () => {
    act(() => {
      const newBoard = structuredClone(board.value);
      newBoard[1][1].value = "X";
      newBoard[1][1].willDisappear = true;
      board.value = newBoard;
    });

    render(<SingleCell row={1} col={1} />);

    const cell = screen.getByRole("button");
    expect(cell).toHaveAttribute("data-disappearing", "true");
  });

  it("should be disabled when there is a winner", () => {
    // Set a winner
    act(() => {
      winnerSignal.value = "X";
    });

    render(<SingleCell row={2} col={2} />);

    const cell = screen.getByRole("button");
    expect(cell).toBeDisabled();
  });

  it("should toggle between X and O turns correctly", async () => {
    render(
      <div>
        <SingleCell row={0} col={0} />
        <SingleCell row={0} col={1} />
      </div>,
    );

    const [cell1, cell2] = screen.getAllByRole("button");

    // X turn initially
    expect(isXTurn.value).toBe(true);

    await user.click(cell1);
    expect(isXTurn.value).toBe(false); // Should switch to O

    await user.click(cell2);
    expect(isXTurn.value).toBe(true); // Should switch back to X
  });
});
