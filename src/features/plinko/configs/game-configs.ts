import {
  baseWorldHeight,
  baseWorldWidth,
  PINS_GAP,
  PINS_SIZE,
} from "../constants/game";
import { LinesType } from "../types/definitions";

export function getConfig(lines: LinesType) {
  const scalingFactor = Math.max(1, lines / 16); // Scale based on 16 rows as a base

  return {
    startPins: 3,
    pinSize: PINS_SIZE[lines],
    pinGap: PINS_GAP[lines],
    ballSize: PINS_SIZE[lines] / 1.2,
    engineGravity: 1,
    world: {
      width: baseWorldWidth * scalingFactor,
      height: baseWorldHeight * scalingFactor,
    },
  };
}
