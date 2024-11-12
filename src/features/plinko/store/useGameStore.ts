import { create } from "zustand";

interface GameStoreProps {
  gamesRunning: number;
  setGamesRunning: (gamesRunning: number) => void;
  onIncrementGamesRunning: () => void;
  onDecrementGamesRunning: () => void;
}

export const useGameStore = create<GameStoreProps>((set, get) => ({
  gamesRunning: 0,
  setGamesRunning: (gamesRunning: number) => {
    set({ gamesRunning });
  },
  onIncrementGamesRunning: () => {
    const gamesRunning = get().gamesRunning;
    const calc = gamesRunning + 1;

    set({ gamesRunning: calc < 0 ? 1 : calc });
  },
  onDecrementGamesRunning: () => {
    const gamesRunning = get().gamesRunning;
    const calc = gamesRunning - 1;

    set({ gamesRunning: calc < 0 ? 0 : calc });
  },
}));
