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
  if (object.side != "other") {
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
          nextStepZ
        );
      }
    }
  } else if (object.side === "other") {
    // если мы тыкаем на зеленую штуку делаем ход
    CellStep(scene, gameArea, position, object);
  }
};

export const Render = (scene, gameArea, activeCell, removeCells) => {
  //   console.log(activeCell.metaData);

  // добавить в метадата булл свойство королевы
  // console.log(activeCell);

  //console.log(activeCell.metaData.object.queen);

  ClearRemoveCells(scene, removeCells);
  AnalysisVariateStep(
    scene,
    gameArea,
    activeCell,
    activeCell.metaData.position,
    activeCell.metaData.object,
    removeCells
  );

  console.log(gameArea);

  return 1;
};
