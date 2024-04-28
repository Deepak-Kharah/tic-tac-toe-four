import React from "react";
import TicTacToe from "./components/TicTacToe";
import { motion } from "framer-motion";

function Game() {
  return (
    <main className="flex-1">
      <TicTacToe />
    </main>
  );
}

export default Game;
