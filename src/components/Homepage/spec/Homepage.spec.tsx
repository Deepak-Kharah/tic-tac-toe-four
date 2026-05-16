import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Homepage from "../Homepage.component";

describe("Homepage", () => {
  it("should render the title correctly", () => {
    render(<Homepage />);

    // Check that the title parts exist in the document
    expect(document.body.textContent).toContain("Tic Tac Toe");
    expect(document.body.textContent).toContain("Four");
  });

  it("should render the description paragraphs", () => {
    render(<Homepage />);

    expect(
      screen.getByText(/It's your regular Tic Tac Toe, but with a/),
    ).toBeInTheDocument();
    expect(screen.getByText(/twist/)).toBeInTheDocument();

    expect(screen.getByText(/You can place at most/)).toBeInTheDocument();
    expect(screen.getByText(/four of your pieces/)).toBeInTheDocument();

    expect(screen.getByText(/Then, the last piece/)).toBeInTheDocument();
    expect(screen.getByText(/disappears/)).toBeInTheDocument();

    expect(screen.getByText(/It means this game/)).toBeInTheDocument();
    expect(screen.getByText(/never draws/)).toBeInTheDocument();
  });

  it('should render "Play game" link that points to /game', () => {
    render(<Homepage />);

    const playGameLink = screen.getByTestId("play-game-link");
    expect(playGameLink).toBeInTheDocument();
    expect(playGameLink).toHaveAttribute("href", "/game");
  });
});
