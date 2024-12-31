import { ClearRemoveCells } from "./ClearRemoveCells.js";
import { MakeSelect } from "./MakeSelect.js";
import { CellStep } from "./CellStep.js";
import { CellKill } from "./CellKill.js";

const directs = [
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
  killerFlag = false
) => {
  // while внутри фор для королевы для обработки линий
  // в будущ флаг для киллера
  if (object.type === "checkerPiece") {
    // рисовка путей
    for (const move of directs) {
      let nextStepX = position.x + move.x;
      let nextStepZ = position.z + move.z;

      // теперь мы добавляем ход если клетка пуста и движение следует правилам (Направления)
      if (
        !killerFlag &&
        gameArea[nextStepZ] &&
        gameArea[nextStepZ][nextStepX] &&
        gameArea[nextStepZ][nextStepX].object.type === null &&
        object.side === move.side
      ) {
        // функция которая создает зеленый ход
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
        gameArea[nextStepZ + move.z] &&
        gameArea[nextStepZ + move.z][nextStepX + move.x] &&
        gameArea[nextStepZ][nextStepX].object.type === "checkerPiece" &&
        gameArea[nextStepZ][nextStepX].object.side != object.side &&
        gameArea[nextStepZ + move.z][nextStepX + move.x].object.type === null
      ) {
        // console.log(gameArea[nextStepZ][nextStepX]);
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
  } else if (object.type === "other") {
    // если мы тыкаем на зеленую штуку делаем ход
    CellStep(scene, gameArea, position, object);
  } else if (object.type === "killer") {
    // если мы тыкаем на красную штуку делаем ход
    // когда будем подклбчать сокеты получать ответ есть ли возможность ударить или нет (bool)
    CellKill(scene, gameArea, position, object, removeCells);
  }

  return false;
};

export const Render = (scene, gameArea, activeCell, removeCells) => {
  // проверку на килл выше поставить + флаг который не позволит 
  // 

  ClearRemoveCells(scene, removeCells);
  AnalysisVariateStep(
    scene,
    gameArea,
    activeCell,
    activeCell.metaData.position,
    activeCell.metaData.object,
    removeCells
  );

  //console.log(gameArea);

  return 1;
};
