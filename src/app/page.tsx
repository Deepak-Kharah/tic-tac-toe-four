import Image from "next/image";
import TicTacToe from "./game/components/TicTacToe";
import Homepage from "../components/Homepage/Homepage.component";

export default function Home() {
  return (
    <main className="flex justify-center items-center flex-1">
      <Homepage />
    </main>
  );
}
