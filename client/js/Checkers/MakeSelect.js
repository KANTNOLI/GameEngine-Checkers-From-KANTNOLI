import { CheckersPiece } from "../Engine/Objects/CheckersPiece.js";

export const MakeSelect = (
  scene,
  gameArea,
  removeCells,
  original,
  nextStepX,
  nextStepZ
) => {
  console.log(`x: ${nextStepX}, z: ${nextStepZ} - select`);

  // создаем select
  let select = CheckersPiece(
    scene,
    gameArea,
    { type: "checkerPiece", side: "other", link: null },
    {
      x: nextStepX,
      z: nextStepZ,
    }
  );

  // ссылка на оригинал на удаление при выборе
  select.metaData.object.original = original;
  // добавляем в массив который потом отправим на ремувинг
  removeCells.push(select);

  return select;
};
