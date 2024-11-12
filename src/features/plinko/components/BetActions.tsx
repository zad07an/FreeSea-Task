import { Button } from "@/components/ui/Button";
import { Select, SelectOption } from "@/components/ui/Select";
import { ChangeEvent, useState } from "react";
import { LinesType } from "../types/definitions";
import { GameInput } from "./GameInput";

interface PlinkoBetActions {
  onRunBet: (betValue: number) => void;
  onChangeLines: (lines: LinesType) => void;
  lines: number;
  gamesRunning: number;
}

export function BetActions({
  onRunBet,
  onChangeLines,
  gamesRunning,
  lines,
}: PlinkoBetActions) {
  const [betValue, setBetValue] = useState(0);
  const maxLinesQnt = 16;
  const linesOptions: number[] = [];

  for (let i = 8; i <= maxLinesQnt; i++) {
    linesOptions.push(i);
  }

  function handleChangeBetValue(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const value = +e.target.value;
    setBetValue(value);
  }

  function handleChangeLines(e: ChangeEvent<HTMLSelectElement>) {
    onChangeLines(Number(e.target.value) as LinesType);
  }

  function handleHalfBet() {
    const value = betValue / 2;
    const newBetvalue = value <= 0 ? 0 : Math.floor(value);
    setBetValue(newBetvalue);
  }

  function handleDoubleBet() {
    const value = betValue * 2;

    const newBetvalue = value <= 0 ? 0 : Math.floor(value);
    setBetValue(newBetvalue);
  }

  async function handleRunBet() {
    if (gamesRunning >= 15) return;
    onRunBet(betValue);
    if (betValue <= 0) return;
  }

  return (
    <div className="relative h-full w-96 flex flex-col gap-4 bg-primary-header p-4 py-8">
      <GameInput
        handleDoubleBet={handleDoubleBet}
        handleHalfBet={handleHalfBet}
        value={betValue}
        onChange={handleChangeBetValue}
      />
      <div className=" w-full flex flex-col gap-2">
        <label htmlFor="lines">Rows</label>
        <Select
          disabled={gamesRunning > 0}
          onChange={handleChangeLines}
          defaultValue={16}
          value={lines}
          id="lines"
        >
          {linesOptions.map((line) => (
            <SelectOption key={line} value={line}>
              {line} Lines
            </SelectOption>
          ))}
        </Select>
      </div>
      <Button
        onClick={handleRunBet}
        className="py-2 px-6 bg-primary-orange font-bold"
      >
        Bet
      </Button>
    </div>
  );
}
