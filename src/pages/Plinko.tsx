import { GameFooter } from "@/features/plinko/components/GameFooter";
import { PlinkoGame } from "@/features/plinko/components/PlinkoGame";

export default function Plinko() {
  return (
    <section className=" w-full h-full flex flex-col">
      <PlinkoGame />
      <GameFooter />
    </section>
  );
}
