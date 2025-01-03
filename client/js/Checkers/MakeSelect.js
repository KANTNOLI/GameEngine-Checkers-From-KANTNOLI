import { CheckersPiece } from "../Engine/Objects/CheckersPiece.js";

export const MakeSelect = (
  scene,
  gameArea,
  removeCells,
  original,
  nextStepX,
  nextStepZ,
  side,
  type
) => {
  // console.log(`x: ${nextStepX}, z: ${nextStepZ} - select`);
  if (gameArea[nextStepZ][nextStepX].object.type === null) {
    // создаем select
    let select = CheckersPiece(
      scene,
      gameArea,
      { type: type, side: side, link: null },
      {
        x: nextStepX,
        z: nextStepZ,
      }
    );

    // ссылка на оригинал на удаление при выборе
    select.metaData.object.original = original;
    // добавляем в массив который потом отправим на ремувинг
    removeCells.push({
      type: type,
      select: select,
    });

    return select;
  } else {
    console.log("FULL");
  }
};
