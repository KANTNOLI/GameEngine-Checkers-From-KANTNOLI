import * as THREE from "three";
import { CheckersPiece } from "../Objects/CheckersPiece.js";

export const LoadCheckers = (scene, gameArea) => {
  gameArea.map((vertLine, cordZ) => {
    vertLine.map((cell, cordX) => {
      cell.object.type === "checkerPiece"
        ? CheckersPiece(scene, gameArea, cell.object, cell.position)
        : null;
    });
  });
};
