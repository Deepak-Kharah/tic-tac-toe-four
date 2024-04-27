import React from "react";
import TicTacToe from "./components/TicTacToe";

function Game() {
  return (
    <main className="w-100vw h-[100vh] flex flex-col justify-center items-center">
      <TicTacToe />
    </main>
  );
}

export default Game;
