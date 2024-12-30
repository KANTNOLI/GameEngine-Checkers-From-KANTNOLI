import { CheckersPiece } from "../Engine/Objects/CheckersPiece.js";
import { ClearRemoveCells } from "./ClearRemoveCells.js";
import { MakeSelect } from "./MakeSelect.js";
import { CellStep } from "./CellStep.js";

const directs = [
  { x: 1, z: -1, side: "white" },
  { x: -1, z: -1, side: "white" },
  { x: 1, z: 1, side: "black" },
  { x: -1, z: 1, side: "black" },
];

const AnalysisVariateStep = (
  scene,
  gameArea,
  original,
  position,
  object,
  removeCells
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
          "killer"
        ).metaData.object.kill = gameArea[nextStepZ][nextStepX];
      }
      //
      //
      //
    }
  } else if (object.type === "other") {
    // если мы тыкаем на зеленую штуку делаем ход
    CellStep(scene, gameArea, position, object);
  } else if (object.type === "killer") {
    // если мы тыкаем на зеленую штуку делаем ход
    CellStep(scene, gameArea, position, object);

    gameArea[object.kill.position.z][object.kill.position.x] = {
      position: { x: object.kill.position.x, z: object.kill.position.z },
      object: {
        type: null,
      },
    };

    scene.remove(object.kill.object.link);

    console.log(gameArea);
   // console.log(gameArea[object.kill.position.z][object.kill.position.x]);
  }

  return false;
};

export const Render = (scene, gameArea, activeCell, removeCells) => {
  //   console.log(activeCell.metaData);

  // добавить в метадата булл свойство королевы
  // console.log(activeCell);

  //console.log(activeCell.metaData.object.queen);

  console.log(`start `);
  console.log(activeCell);
  console.log(`end`);
  

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
