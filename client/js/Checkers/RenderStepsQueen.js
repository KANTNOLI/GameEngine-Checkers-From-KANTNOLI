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
  // данные пешки, которую будем убирать (условно)
  let saveParams = {
    original: null,
    x: null,
    z: null,
  };
  // для пропуска обычных ходов
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
      // если пусто, можно ходить
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
      // если можно рубить, делаем сплит по рубке
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
        // тут мы рубим, в прошлой мы давали разрешение
        // такой прикольный ход для пропуска шашки
        // которую будем рубить не иксуя код в 2 раза
        // как было при 2 попытке, ну или 3
        MakeSelect(
          scene,
          gameArea,
          removeCells,
          saveParams.original,
          nextStepX + move.x * counter,
          nextStepZ + move.z * counter,
          "other",
          "killer"
        ).metaData.object.kill = gameArea[saveParams.z][saveParams.x];

        counter++;
      } else {
        break;
      }
    } else {
      break;
    }
  }
};
