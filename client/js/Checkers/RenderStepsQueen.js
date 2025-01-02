import { MakeSelect } from "./MakeSelect.js";

export const RenderStepsQueen = (
  scene,
  gameArea,
  original,
  move,
  nextStepZ,
  nextStepX,
  removeCells,
  onlyKills
) => {
  let saveParams = {
    original: null,
    x: null,
    z: null,
  };
  let missDefaultStep = false;
  let counter = 0;

  while (true) {
    if (
      !missDefaultStep &&
      gameArea[nextStepZ + move.z * counter] &&
      gameArea[nextStepZ + move.z * counter][nextStepX + move.x * counter] &&
      gameArea[nextStepZ + move.z * counter][nextStepX + move.x * counter]
        .object.type === null
    ) {
      if (!onlyKills) {
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
      }

      counter++;
    } else if (
      !missDefaultStep &&
      gameArea[nextStepZ + move.z * counter] &&
      gameArea[nextStepZ + move.z * counter][nextStepX + move.x * counter] &&
      gameArea[nextStepZ + move.z * counter][nextStepX + move.x * counter]
        .object.type === "checkerPiece"
    ) {
      saveParams = {
        original: original,
        x: nextStepX + move.x * counter,
        z: nextStepZ + move.z * counter,
      };
      missDefaultStep = true;
      counter++;
    } else if (
      missDefaultStep &&
      gameArea[nextStepZ + move.z * counter] &&
      gameArea[nextStepZ + move.z * counter][nextStepX + move.x * counter]
    ) {
      if (
        gameArea[nextStepZ + move.z * counter][nextStepX + move.x * counter]
          .object.type === null
      ) {
        let temp = MakeSelect(
          scene,
          gameArea,
          removeCells,
          saveParams.original,
          nextStepX + move.x * counter,
          nextStepZ + move.z * counter,
          "other",
          "killer"
        );
        temp.metaData.object.kill = gameArea[saveParams.z][saveParams.x];

        counter++;
      } else {
        break;
      }
    } else {
      break;
    }
  }
};
