import Image from "next/image";
import TicTacToe from "./game/components/TicTacToe";
import Homepage from "../components/Homepage/Homepage.component";

export default function Home() {
  return (
    <main className="w-100vw h-[100vh] flex justify-center items-center">
      <Homepage />
    </main>
  );
}
