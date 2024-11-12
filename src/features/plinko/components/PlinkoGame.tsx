import {
  Bodies,
  Body,
  Composite,
  Engine,
  Events,
  IEventCollision,
  Render,
  Runner,
  World,
} from "matter-js";
import { useCallback, useEffect, useState } from "react";

import { useGame } from "@/store/useGame";
import { random } from "@/utils/random";
import { BetActions } from "./components/BetActions";
import { PlinkoGameBody } from "./components/GameBody";
import { MultiplierHistory } from "./components/MultiplierHistory";
import { getConfig, PINS_GAP, PINS_SIZE } from "./config";
import { getMultiplierByLinesQnt } from "./config/multipliers";
import { LinesType, MultiplierValues } from "./types";

export function PlinkoGame() {
  const engine = Engine.create();
  const [lines, setLines] = useState<LinesType>(16);

  const inGameBallsCount = useGame((state) => state.gamesRunning);
  const incrementInGameBallsCount = useGame(
    (state) => state.incrementGamesRunning
  );
  const decrementInGameBallsCount = useGame(
    (state) => state.decrementGamesRunning
  );

  const worldWidth: number = 900;

  const worldHeight: number = 900;

  const [lastMultipliers, setLastMultipliers] = useState<number[]>([]);

  const { pins: pinsConfig, engine: engineConfig } = getConfig(lines);

  const dynamicPinSize = PINS_SIZE[lines];

  // Calculate the dynamic gap ensuring the ball can fall without interference
  const dynamicPinsGap = PINS_GAP[lines];

  // Adjust the ball size to fit within the available space and avoid sticking to pins
  const dynamicBallSize = PINS_SIZE[lines] / 1.2;

  console.log(dynamicPinSize);

  useEffect(() => {
    engine.gravity.y = engineConfig.engineGravity;
    const element = document.getElementById("plinko");
    const render = Render.create({
      element: element!,
      options: {
        background: "transparent",
        hasBounds: true,
        wireframes: false,
      },
      bounds: {
        max: {
          y: worldHeight,
          x: worldWidth,
        },
        min: {
          y: 0,
          x: 0,
        },
      },
      engine,
    });

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);
    return () => {
      World.clear(engine.world, true);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [lines]);

  const pins: Body[] = [];

  for (let l = 0; l < lines; l++) {
    const linePins = pinsConfig.startPins + l;
    const lineWidth = linePins * dynamicPinsGap;
    for (let i = 0; i < linePins; i++) {
      const pinX =
        worldWidth / 2 -
        lineWidth / 2 +
        i * dynamicPinsGap +
        dynamicPinsGap / 2;

      const pinY = worldWidth / lines + l * dynamicPinsGap + dynamicPinsGap;

      const pin = Bodies.circle(pinX, pinY, dynamicPinSize, {
        label: `pin-${i}`,
        render: {
          fillStyle: "#F5DCFF",
        },
        isStatic: true,
      });
      pins.push(pin);
    }
  }

  function addInGameBall() {
    if (inGameBallsCount > 15) return;
    incrementInGameBallsCount();
  }

  function removeInGameBall() {
    decrementInGameBallsCount();
  }

  const addBall = useCallback(
    (ballValue: number) => {
      addInGameBall();

      const minBallX = worldWidth / 2 - dynamicPinSize * 3 + dynamicPinsGap;
      const maxBallX =
        worldWidth / 2 -
        dynamicPinSize * 3 -
        dynamicPinsGap +
        dynamicPinsGap / 2;

      const ballX = random(minBallX, maxBallX);
      const ballColor = "red";
      const ball = Bodies.circle(ballX, 50, dynamicBallSize, {
        restitution: 1,
        friction: 0.6,
        label: `ball-${ballValue}`,
        id: new Date().getTime(),
        frictionAir: 0.05,
        collisionFilter: {
          group: -1,
        },
        render: {
          fillStyle: ballColor,
        },
        isStatic: false,
      });
      Composite.add(engine.world, ball);
    },
    [lines]
  );

  const floor = Bodies.rectangle(0, worldWidth + 10, worldWidth * 10, 40, {
    label: "block-1",
    render: {
      visible: false,
    },
    isStatic: true,
  });

  const multipliers = getMultiplierByLinesQnt(lines);

  const multipliersBodies: Body[] = [];

  let lastMultiplierX: number =
    worldWidth / 2 - (dynamicPinsGap / 2) * lines - dynamicPinsGap;

  multipliers.forEach((multiplier) => {
    const blockSize = 30; // height and width
    const multiplierBody = Bodies.rectangle(
      lastMultiplierX + dynamicPinsGap,
      worldWidth / lines + lines * dynamicPinsGap + dynamicPinsGap,
      blockSize,
      blockSize,
      {
        label: multiplier.label,
        isStatic: true,
        render: {
          sprite: {
            xScale: dynamicPinSize / 6,
            yScale: dynamicPinSize / 6,
            texture: multiplier.img,
          },
        },
      }
    );
    lastMultiplierX = multiplierBody.position.x;
    multipliersBodies.push(multiplierBody);
  });

  Composite.add(engine.world, [...pins, ...multipliersBodies, floor]);

  function bet(betValue: number) {
    addBall(betValue);
  }

  async function onCollideWithMultiplier(ball: Body, multiplier: Body) {
    ball.collisionFilter.group = 2;
    World.remove(engine.world, ball);
    removeInGameBall();
    const multiplierValue = +multiplier.label.split("-")[1] as MultiplierValues;

    setLastMultipliers((prev) => [multiplierValue, prev[0], prev[1], prev[2]]);
  }

  async function onBodyCollision(event: IEventCollision<Engine>) {
    const pairs = event.pairs;
    for (const pair of pairs) {
      const { bodyA, bodyB } = pair;
      if (bodyB.label.includes("ball") && bodyA.label.includes("block"))
        await onCollideWithMultiplier(bodyB, bodyA);
    }
  }

  Events.on(engine, "collisionActive", onBodyCollision);

  return (
    <div className="w-full h-full flex flex-col-reverse items-center justify-center gap-4 md:flex-row">
      <BetActions
        inGameBallsCount={inGameBallsCount}
        onChangeLines={setLines}
        onRunBet={bet}
        lines={lines}
      />
      <MultiplierHistory multiplierHistory={lastMultipliers.slice(0, 3)} />
      <div className="w-full h-full flex flex-1 items-center justify-center">
        <PlinkoGameBody />
      </div>
    </div>
  );
}
