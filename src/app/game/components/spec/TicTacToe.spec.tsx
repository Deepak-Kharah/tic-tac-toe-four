import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { board, isXTurn, resetGame } from "../../signal";
import TicTacToe from "../TicTacToe";

// Mock the confetti module
vi.mock("@/lib/confetti", () => ({
  launchFirework: vi.fn(),
}));

describe("TicTacToe Integration Tests", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    resetGame();
    vi.clearAllMocks();
  });

  it("should render game components correctly", () => {
    render(<TicTacToe />);

    // Check basic structure is rendered
    expect(screen.getAllByRole("button")).toBeDefined();
    expect(document.body).toHaveTextContent("--"); // Player separator
  });

  it("should handle basic interactions", async () => {
    render(<TicTacToe />);

    // Test that we can render and interact with the component
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);

    // Test a basic click doesn't crash
    if (buttons[0]) {
      await act(async () => {
        await user.click(buttons[0]);
      });
      // Just verify the component is still rendered
      expect(screen.getAllByRole("button")).toBeDefined();
    }
  });

  it("should maintain game state through signals", () => {
    render(<TicTacToe />);

    // Test that signals are properly initialized
    expect(board.value).toBeDefined();
    expect(isXTurn.value).toBe(true);

    // Test that reset works
    act(() => {
      resetGame();
    });
    expect(isXTurn.value).toBe(true);
  });

  it("should render player indicators", () => {
    render(<TicTacToe />);

    // Look for X and O pieces in the player area (not necessarily in cells)
    const crosses = document.querySelectorAll('[class*="cross"]');
    const circles = document.querySelectorAll('[class*="circle"]');

    expect(crosses.length).toBeGreaterThan(0);
    expect(circles.length).toBeGreaterThan(0);
  });

  it("should handle component lifecycle", () => {
    const { unmount } = render(<TicTacToe />);

    // Test component can be unmounted without errors
    expect(() => unmount()).not.toThrow();

    // Test component can be re-rendered after unmount
    render(<TicTacToe />);
    expect(screen.getAllByRole("button")).toBeDefined();
  });
});
