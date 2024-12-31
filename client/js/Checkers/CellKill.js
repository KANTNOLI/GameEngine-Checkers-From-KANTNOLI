import { CellStep } from "./CellStep.js";
import { AnalysisVariateStep } from "./main.js";


export const CellKill = (scene, gameArea, position, object, removeCells) => {
  let cell = CellStep(scene, gameArea, position, object);

  // удаление противника
  gameArea[object.kill.position.z][object.kill.position.x] = {
    position: { x: object.kill.position.x, z: object.kill.position.z },
    object: {
      type: null,
    },
  };

  scene.remove(object.kill.object.link);
  AnalysisVariateStep(
    scene, 
    gameArea,
    cell,
    cell.metaData.position,
    cell.metaData.object,
    removeCells,
    true
  );
};
