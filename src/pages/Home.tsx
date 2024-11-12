import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <section className=" w-full h-full grid place-items-center">
      <div className=" w-full max-w-screen-sm flex flex-col items-center gap-4">
        <h1 className=" text-6xl font-bold uppercase">Plinko Game</h1>
        <Button
          className=" bg-primary-orange w-64"
          onClick={() => navigate("/plinko")}
        >
          Play
        </Button>
      </div>
    </section>
  );
}
