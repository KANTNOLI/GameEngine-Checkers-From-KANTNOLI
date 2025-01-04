import { CheckersPiece } from "../Engine/Objects/CheckersPiece.js";
import { CheckQueen } from "./CheckQueen.js";

export const CellStep = (scene, gameArea, position, info) => {
  // console.log(`x: ${position.x}, z: ${position.z} - step`);

  scene.remove(
    gameArea[info.position.z][
      info.position.x
    ].object.link
  );

  gameArea[info.position.z][
    info.position.x
  ] = {
    position: {
      x: info.position.x,
      z: info.position.z,
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
      side: info.side,
      queen: CheckQueen(
        position,
        info.side,
        info.queen
      ),
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

  //console.log(gameArea);
  return newCell;
};
