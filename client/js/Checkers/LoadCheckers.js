import { CheckersPiece } from "../Engine/Objects/CheckersPiece.js";

const LOCALSTORE_USER_ID = "OLD_USER_ID";
const LOCALSTORE_USER_ACTIVE_ID = "USER_ID";

const LOCALSTORE_SIDE_STEP = "SIDE_STEP";
const LOCALSTORE_SIDE = "SIDE";
const LOCALSTORE_ROOM_ID = "ROOM_ID";

const LOCALSTORE_COUNT_W = "COUNT_W";
const LOCALSTORE_COUNT_B = "COUNT_B";

export const LoadCheckers = (scene, gameArea) => {
  let countBlack = 0;
  let countWhite = 0;
  gameArea.map((vertLine, cordZ) => {
    vertLine.map((cell, cordX) => {
      if (cell.object.type === "checkerPiece") {
        CheckersPiece(scene, gameArea, cell.object, cell.position);
        
        cell.object.side === "white" ? countWhite++ : countBlack++;
      }
    });
  });

  localStorage.setItem(LOCALSTORE_COUNT_W, countWhite);
  localStorage.setItem(LOCALSTORE_COUNT_B, countBlack);
};
