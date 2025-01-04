import { CellStep } from "./CellStep.js";
import { AnalysisVariateStep } from "./main.js";

export const CellKill = (
  scene,
  gameArea,
  position,
  saveInfo,
  removeCells,
  skip = false
) => {
  let cell = CellStep(scene, gameArea, position, saveInfo);

  // удаление противника
  scene.remove(
    gameArea[saveInfo.positionKill.z][saveInfo.positionKill.x].object.link
  );
  gameArea[saveInfo.positionKill.z][saveInfo.positionKill.x] = {
    position: { x: saveInfo.x, z: saveInfo.z },
    object: {
      type: null,
    },
  };

  if (!skip) {
    AnalysisVariateStep(
      scene,
      gameArea,
      cell,
      cell.metaData.position,
      cell.metaData.object,
      removeCells,
      true
    );
  }
};
