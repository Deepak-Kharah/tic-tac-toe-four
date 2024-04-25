import Image from "next/image";
import TicTacToe from "./TicTacToe";

export default function Home() {
  return (
    <main className="w-100vw h-[100vh] flex justify-center items-center">
      <TicTacToe />
    </main>
  );
}
