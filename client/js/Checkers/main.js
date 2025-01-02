import { ClearRemoveCells } from "./ClearRemoveCells.js";
import { RenderStepsQueen } from "./RenderStepsQueen.js";
import { MakeSelect } from "./MakeSelect.js";
import { CellStep } from "./CellStep.js";
import { CellKill } from "./CellKill.js";

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
  onlyKills = false
) => {
  if (object.type === "checkerPiece") {
    // Тут мы берем направление и далее работаем с ним
    // с помощью условий
    for (const move of directs) {
      // для простоты анализа след хода
      let nextStepX = position.x + move.x;
      let nextStepZ = position.z + move.z;

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
    CellStep(scene, gameArea, position, object);
  } else if (object.type === "killer") {
    // в случае нажатия на красную пешку
    // которой мы показываем возможность рубить
    CellKill(scene, gameArea, position, object, removeCells);
  }
  return false;
};

export const Render = (scene, gameArea, activeCell, removeCells) => {

  // После выбора пешки, очищаем прошлую разметку
  // и рисуем новую

  ClearRemoveCells(scene, removeCells);
  AnalysisVariateStep(
    scene,
    gameArea,
    activeCell,
    activeCell.metaData.position,
    activeCell.metaData.object,
    removeCells
  );

  return 1;
};
