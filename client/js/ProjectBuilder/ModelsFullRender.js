import { ModelsLoader } from "../Engine/OtherScripts/ModelsLoader.js";

export const ModelsFullRender = (scene, camera, mainLight, playerControlls) => {
  ModelsLoader(
    scene,
    "models/chessboard.glb",
    { x: 0.115, y: -0.11, z: 0.115 },
    null,
    { width: 1, height: 0.8, length: 1 },
    [camera, mainLight],
    playerControlls,
    null
  );
  ModelsLoader(
    scene,
    "models/table_lamp.glb",
    { x: 2, y: -0.2, z: 1.7 },
    null,
    { width: 0.08, height: 0.08, length: 0.08 },
    null,
    null,
    {
      x: 0,
      y: 140,
      z: 0,
    }
  );
  ModelsLoader(
    scene,
    "models/room.glb",
    { x: 0.5, y: -3.45, z: 0.2 },
    null,
    { width: 0.04, height: 0.04, length: 0.04 },
    null,
    null,
    null,
    1
  );
};
