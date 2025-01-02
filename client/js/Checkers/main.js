import { ClearRemoveCells } from "./ClearRemoveCells.js";
import { MakeSelect } from "./MakeSelect.js";
import { CellStep } from "./CellStep.js";
import { CellKill } from "./CellKill.js";

let directs = [
  { x: 1, z: -1, side: "white", queenStop: false },
  { x: -1, z: -1, side: "white", queenStop: false },
  { x: 1, z: 1, side: "black", queenStop: false },
  { x: -1, z: 1, side: "black", queenStop: false },
];

const renderStepsQueen = (
  scene,
  gameArea,
  original,
  move,
  nextStepZ,
  nextStepX,
  removeCells,
  killLine
) => {
  let counter = 1;
  while (true) {
    killLine = killLine
      ? killLine
      : {
          original: original,
          z: nextStepZ,
          x: nextStepX,
        };

    if (
      gameArea[nextStepZ + move.z * counter] &&
      gameArea[nextStepZ + move.z * counter][nextStepX + move.x * counter] &&
      gameArea[nextStepZ + move.z][nextStepX + move.x].object.type === null
    ) {
      try {
        MakeSelect(
          scene,
          gameArea,
          removeCells,
          killLine.original || original,
          nextStepX + move.x * counter,
          nextStepZ + move.z * counter,
          "other",
          "killer"
        ).metaData.object.kill = gameArea[killLine.z][killLine.x];
      } catch (error) {
        break;
      }

      counter++;
      console.log(killLine);
    } else {
      console.log(1);
      break;
    }
  }
};

export const AnalysisVariateStep = async (
  scene,
  gameArea,
  original,
  position,
  object,
  removeCells,
  killerFlag = false,
  killLine = false
) => {
  if (object.type === "checkerPiece") {
    // рисовка путей
    for (const move of directs) {
      let nextStepX = position.x + move.x;
      let nextStepZ = position.z + move.z;

      if (object.queen) {
        renderStepsQueen(
          scene,
          gameArea,
          original,
          move,
          nextStepZ,
          nextStepX,
          removeCells,
          killLine
        );
      } else {
        // логика для ходьбы и рубки
        if (
          object.side === move.side &&
          gameArea[nextStepZ] &&
          gameArea[nextStepZ][nextStepX] &&
          gameArea[nextStepZ][nextStepX].object.type === null
        ) {
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
          console.log(gameArea[nextStepZ][nextStepX]);
        } else if(){
          
        }
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
  console.log(activeCell.metaData.object.queen);

  // проверку на килл выше поставить + флаг который не позволит

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
