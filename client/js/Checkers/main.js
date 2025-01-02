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

      while (true) {
        if (
          !killerFlag &&
          gameArea[nextStepZ] &&
          gameArea[nextStepZ][nextStepX] &&
          gameArea[nextStepZ][nextStepX].object.type === null &&
          (object.side === move.side || object.queen)
        ) {
          let counter = 1;
          // если можем ходить
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

          while (true) {
            if (
              killLine.type != "far" &&
              object.queen &&
              gameArea[nextStepZ + move.z * counter] &&
              gameArea[nextStepZ + move.z * counter][
                nextStepX + move.x * counter
              ] &&
              gameArea[nextStepZ + move.z * counter][
                nextStepX + move.x * counter
              ].object.type === null
            ) {
              MakeSelect(
                scene,
                gameArea,
                removeCells,
                original,
                nextStepX + move.x * counter,
                nextStepZ + move.z * counter,
                "other",
                "other"
              );

              counter++;
            } else if (
              (killLine &&
                gameArea[nextStepZ + move.z + move.z * counter] &&
                gameArea[nextStepZ + move.z + move.z * counter][
                  nextStepX + move.x + move.x * counter
                ]) ||
              (gameArea[nextStepZ + move.z + move.z * counter] &&
                gameArea[nextStepZ + move.z + move.z * counter][
                  nextStepX + move.x + move.x * counter
                ] &&
                gameArea[nextStepZ + move.z * counter][
                  nextStepX + move.x * counter
                ].object.type === "checkerPiece" &&
                gameArea[nextStepZ + move.z * counter][
                  nextStepX + move.x * counter
                ].object.side != object.side &&
                gameArea[nextStepZ + move.z + move.z * counter][
                  nextStepX + move.x + move.x * counter
                ].object.type === null)
            ) {
              killLine = killLine
                ? killLine
                : {
                    type: "far",
                    original: original,
                    z: nextStepZ + move.z * counter,
                    x: nextStepX + move.x * counter,
                  };

              MakeSelect(
                scene,
                gameArea,
                removeCells,
                killLine.original || original,
                nextStepX + move.x + move.x * counter,
                nextStepZ + move.z + move.z * counter,
                "other",
                "killer"
              ).metaData.object.kill = gameArea[killLine.z][killLine.x];
              counter++;
            } else {
              break;
            }
          }
        } else if (
          gameArea[nextStepZ + move.z] &&
          gameArea[nextStepZ + move.z][nextStepX + move.x] &&
          gameArea[nextStepZ][nextStepX].object.type === "checkerPiece" &&
          gameArea[nextStepZ][nextStepX].object.side != object.side &&
          gameArea[nextStepZ + move.z][nextStepX + move.x].object.type === null
        ) {
          if (object.queen) {
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
                gameArea[nextStepZ + move.z * counter][
                  nextStepX + move.x * counter
                ] &&
                gameArea[nextStepZ + move.z][nextStepX + move.x].object.type ===
                  null
              ) {
                // если можем рубить
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
                counter++;
                console.log(killLine);
              } else {
                console.log(1);
                break;
              }
            }
          } else {
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
            break;
          }
        }
        break;
      }
    }
    //
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
