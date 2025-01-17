import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

import { ClearRemoveCells } from "./ClearRemoveCells.js";
import { RenderStepsQueen } from "./RenderStepsQueen.js";
import { MakeSelect } from "./MakeSelect.js";
import { CellStep } from "./CellStep.js";
import { CellKill } from "./CellKill.js";
import { StepSend } from "../Sockets/StepSend.js";

const LOCALSTORE_SIDE_STEP = "SIDE_STEP";
const LOCALSTORE_SIDE = "SIDE";

const LOCALSTORE_COUNT_W = "COUNT_W";
const LOCALSTORE_COUNT_B = "COUNT_B";

let directs = [
  { x: 1, z: -1, side: "white" },
  { x: -1, z: -1, side: "white" },
  { x: 1, z: 1, side: "black" },
  { x: -1, z: 1, side: "black" },
];

export const AnalysisVariateStep = async (
  scene,
  gameArea,
  original,
  position,
  object,
  removeCells,
  onlyKills = false,
  playerSideStep,
  playerSide,
  socket
) => {
  if (object.type === "checkerPiece" && playerSide === object.side) {
    // Тут мы берем направление и далее работаем с ним
    // с помощью условий
    for (const move of directs) {
      // для простоты анализа след хода
      let nextStepX = position.x + move.x;
      let nextStepZ = position.z + move.z;

      console.log(`move analize`);
      if (object.queen) {
        // перенаправляемся в функцию для королев
        // в случае если мы играем за королеву
        RenderStepsQueen(
          scene,
          gameArea,
          original,
          move,
          nextStepZ,
          nextStepX,
          removeCells,
          onlyKills
        );
      } else {
        // в другом случае у нас обычная шашка
        // делаем анализ относительно направления
        if (
          !onlyKills &&
          object.side === move.side &&
          gameArea[nextStepZ] &&
          gameArea[nextStepZ][nextStepX] &&
          gameArea[nextStepZ][nextStepX].object.type === null
        ) {
          console.log(`step`);
          // если след клетка пуска, то показываем
          // что можно сюда пойти
          MakeSelect(
            scene,
            gameArea,
            removeCells,
            original,
            nextStepX,
            nextStepZ,
            "other",
            "other"
          );
        } else if (
          gameArea[nextStepZ] &&
          gameArea[nextStepZ][nextStepX] &&
          gameArea[nextStepZ + move.z] &&
          gameArea[nextStepZ + move.z][nextStepX + move.x] &&
          gameArea[nextStepZ][nextStepX].object.type === "checkerPiece" &&
          gameArea[nextStepZ][nextStepX].object.side != object.side &&
          gameArea[nextStepZ + move.z][nextStepX + move.x].object.type === null
        ) {
          // Если клетка не пустая, а на ней другая шашка
          // то смотрим, после нее свободно? если да
          // то показываем, что можно срубитт добавляя
          // доп данные
          MakeSelect(
            scene,
            gameArea,
            removeCells,
            original,
            nextStepX + move.x,
            nextStepZ + move.z,
            "other",
            "killer"
          ).metaData.object.kill = gameArea[nextStepZ][nextStepX];
        }
      }
    }
  } else if (object.type === "other") {
    // в случае нажатия на зеленую пешку
    // которой мы показываем возможность ходить

    let saveInfo = {
      type: "other",
      side: object.original.metaData.object.side,
      activePosition: position,
      position: {
        x: object.original.metaData.position.x,
        z: object.original.metaData.position.z,
      },
      queen: object.original.metaData.object.queen,
    };
    StepSend(saveInfo, socket);
    CellStep(scene, gameArea, position, saveInfo);
  } else if (object.type === "killer") {
    // в случае нажатия на красную пешку
    // которой мы показываем возможность рубить
    let saveInfo = {
      type: "kill",
      side: object.original.metaData.object.side,
      activePosition: position,
      positionKill: {
        x: object.kill.position.x,
        z: object.kill.position.z,
      },
      position: {
        x: object.original.metaData.position.x,
        z: object.original.metaData.position.z,
      },
      queen: object.original.metaData.object.queen,
    };

    StepSend(saveInfo, socket);

    saveInfo.side === "white"
      ? localStorage.setItem(
          LOCALSTORE_COUNT_B,
          +localStorage.getItem(LOCALSTORE_COUNT_B) - 1
        )
      : localStorage.setItem(
          LOCALSTORE_COUNT_W,
          +localStorage.getItem(LOCALSTORE_COUNT_W) - 1
        );

    CellKill(scene, gameArea, position, saveInfo, removeCells, true);
  }
  return false;
};

export const Render = (scene, gameArea, activeCell, removeCells, socket) => {
  // После выбора пешки, очищаем прошлую разметку
  // и рисуем новую
  let playerSideStep = localStorage.getItem(LOCALSTORE_SIDE_STEP);
  let playerSide = localStorage.getItem(LOCALSTORE_SIDE);

  ClearRemoveCells(scene, removeCells);

  if (playerSideStep == playerSide) {
    AnalysisVariateStep(
      scene,
      gameArea,
      activeCell,
      activeCell.metaData.position,
      activeCell.metaData.object,
      removeCells,
      false,
      playerSideStep,
      playerSide,
      socket
    );
  }

  return 1;
};
