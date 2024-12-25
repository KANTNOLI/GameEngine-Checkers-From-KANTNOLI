import { CheckersPiece } from "../Engine/Objects/CheckersPiece.js";
import { ClearRemoveCells } from "./ClearRemoveCells.js";

const directsWhite = [
  { x: 1, z: -1 },
  { x: -1, z: -1 },
];

const directsBlack = [
  { x: 1, z: 1 },
  { x: -1, z: 1 },
];

const AnalysisVariateStep = (
  scene,
  gameArea,
  original,
  position,
  object,
  removeCells
) => {
  // while внутри фор для королевы для обработки линий

  console.log(original);
  if (object.side != "other") {
    for (const move of object.side === "white" ? directsWhite : directsBlack) {
      let nextStepX = position.x + move.x;
      let nextStepZ = position.z + move.z;

      if (
        gameArea[nextStepZ][nextStepX] &&
        gameArea[nextStepZ][nextStepX].object.type === null
      ) {
        let select = CheckersPiece(
          scene,
          gameArea,
          { type: "checkerPiece", side: "other", link: null },
          {
            x: position.x + move.x,
            z: position.z + move.z,
          }
        );

        // scene.remove(gameArea[position.z][position.x].object.link);
        select.metaData.object.original = original;
        removeCells.push(select);
      }
    }
  } else if (object.side === "other") {
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
  }
};

export const Render = (scene, gameArea, activeCell, removeCells) => {
  //   console.log(activeCell.metaData);

  ClearRemoveCells(scene, removeCells);
  AnalysisVariateStep(
    scene,
    gameArea,
    activeCell,
    activeCell.metaData.position,
    activeCell.metaData.object,
    removeCells
  );

  console.log(gameArea);
  

  return 1;
};