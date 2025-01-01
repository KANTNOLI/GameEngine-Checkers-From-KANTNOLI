import { CheckersPiece } from "../Engine/Objects/CheckersPiece.js";
import { CheckQueen } from "./CheckQueen.js";

export const CellStep = (scene, gameArea, position, object) => {
  // console.log(`x: ${position.x}, z: ${position.z} - step`);

  gameArea[object.original.metaData.position.z][
    object.original.metaData.position.x
  ] = {
    position: {
      x: object.original.metaData.position.x,
      z: object.original.metaData.position.z,
    },
    object: {
      type: null,
    },
  };

  // замена массива чобы ничего небыло

  gameArea[position.z][position.x] = {
    position: { x: position.x, z: position.z },
    object: {
      type: "checkerPiece",
      side: object.original.metaData.object.side,
      queen: CheckQueen(position, object.original.metaData.object.side, object.original.metaData.object.queen),
      link: null,
    },
  };

  let newCell = CheckersPiece(
    scene,
    gameArea,
    gameArea[position.z][position.x].object,
    gameArea[position.z][position.x].position
  );

  scene.add(newCell);
  scene.remove(object.original);

  //console.log(gameArea);
  return newCell;
};
