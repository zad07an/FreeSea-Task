import { random } from "@/utils/random";
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
import { getConfig } from "../configs/game-configs";
import { getMultiplierByLinesQnt } from "../constants/multipliers";
import { useGameStore } from "../store/useGameStore";
import { LinesType, MultiplierValues } from "../types/definitions";
import { BetActions } from "./BetActions";
import { PlinkoGameBody } from "./GameBody";
import { MultiplierHistory } from "./MultiplierHistory";

export function PlinkoGame() {
  const engine = Engine.create();
  const [lines, setLines] = useState<LinesType>(16);

  const { gamesRunning, onIncrementGamesRunning, onDecrementGamesRunning } =
    useGameStore();

  const [lastMultipliers, setLastMultipliers] = useState<number[]>([]);

  const { pinSize, pinGap, ballSize, engineGravity, startPins, world } =
    getConfig(lines);

  const worldWidth = world.width;
  const worldHeight = world.height;

  useEffect(() => {
    engine.gravity.y = engineGravity;
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
    const linePins = startPins + l;
    const lineWidth = linePins * pinGap;
    for (let i = 0; i < linePins; i++) {
      const pinX = worldWidth / 2 - lineWidth / 2 + i * pinGap + pinGap / 2;

      const pinY = worldWidth / lines + l * pinGap + pinGap;

      const pin = Bodies.circle(pinX, pinY, pinSize, {
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
    if (gamesRunning > 15) return;
    onIncrementGamesRunning();
  }

  function removeInGameBall() {
    onDecrementGamesRunning();
  }

  const addBall = useCallback(
    (ballValue: number) => {
      addInGameBall();

      const minBallX = worldWidth / 2 - pinSize * 3 + pinGap;
      const maxBallX = worldWidth / 2 - pinSize * 3 - pinGap + pinGap / 2;

      const ballX = random(minBallX, maxBallX);
      const ballColor = "red";
      const ball = Bodies.circle(ballX, Math.ceil(pinGap * 1.5), ballSize, {
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

  let lastMultiplierX: number = worldWidth / 2 - (pinGap / 2) * lines - pinGap;

  multipliers.forEach((multiplier) => {
    const blockSize = 30; // height and width
    const multiplierBody = Bodies.rectangle(
      lastMultiplierX + pinGap,
      worldWidth / lines + lines * pinGap + pinGap,
      blockSize,
      blockSize,
      {
        label: multiplier.label,
        isStatic: true,
        render: {
          sprite: {
            xScale: pinSize / 6,
            yScale: pinSize / 6,
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
        gamesRunning={gamesRunning}
        onChangeLines={setLines}
        onRunBet={bet}
        lines={lines}
      />
      <MultiplierHistory multiplierHistory={lastMultipliers.slice(0, 3)} />
      <div className="w-full h-full grid place-items-center">
        <PlinkoGameBody />
      </div>
    </div>
  );
}
