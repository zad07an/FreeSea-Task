import usd from "@/assets/usd1.svg";
import half from "@/assets/1-2.svg";
import double from "@/assets/2x.svg";
import { ChangeEvent } from "react";
import { Input } from "@/components/ui/Input";

interface Props {
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleHalfBet: () => void;
  handleDoubleBet: () => void;
}

export const GameInput = ({
  value,
  onChange,
  handleDoubleBet,
  handleHalfBet,
}: Props) => {
  return (
    <div className=" w-full flex flex-col gap-2">
      <label htmlFor="bet-input" className=" w-fit">
        Bet amount
      </label>
      <div className="w-full grid grid-cols-[2fr_1fr] shadow-md rounded-lg overflow-hidden">
        <div className=" w-full relative flex items-center">
          <Input
            type="number"
            min={0}
            max={value}
            onChange={onChange}
            value={value}
            id="bet-input"
          />
          <img
            src={usd}
            alt="usd icon"
            width={20}
            height={20}
            className=" absolute right-3"
          />
        </div>
        <div className=" w-full grid grid-cols-2">
          <button
            onClick={handleHalfBet}
            className="relative w-full h-full flex items-center justify-center border-2 border-transparent bg-primary-dark transition-colors after:absolute after:top-[calc(50%_-_8px)] after:right-0 after:h-4 after:w-0.5 after:rounded-lg after:bg-primary-dark after:content-[''] hover:bg-primary-dark/80 focus:border-purple focus:outline-none md:p-2 text-primary-icon"
          >
            <img src={half} alt="usd icon" width={12} height={12} />
          </button>
          <button
            onClick={handleDoubleBet}
            className="relative flex items-center justify-center border-2 border-transparent bg-primary-dark transition-colors after:absolute after:top-[calc(50%_-_8px)] after:right-0 after:h-4 after:w-0.5 after:rounded-lg after:bg-primary-dark after:content-[''] hover:bg-primary-dark/80 focus:border-purple focus:outline-none md:p-2 text-primary-icon"
          >
            <img src={double} alt="usd icon" width={18} height={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
