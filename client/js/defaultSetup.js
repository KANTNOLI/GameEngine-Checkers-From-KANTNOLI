import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const oneCell = 0.235;
const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
const cylMateBlack = new THREE.MeshStandardMaterial({
  color: 0x303030,
});
const cylMateWhite = new THREE.MeshStandardMaterial({
  color: 0xe0e0e0,
});

const createElement = (cell, color, id, board, lineID, cellID) => {
  const cylinder = new THREE.Mesh(cylinderGeometry, color);
  cylinder.position.x = oneCell * (cell.position.x - 3);
  cylinder.position.z = oneCell * (cell.position.z - 3);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;
  cylinder.userData.object = cell.object;
  board[lineID][cellID].render = cylinder;
  cylinder.userData.position = { x: cell.position.x, z: cell.position.z };
  return { cylinder, board };
};

export const defaultSetup = (renderer, scene, camera, board) => {

  let counter = -1;
  board.map((line, lineID) => {
    line.map((cell, cellID) => {
      switch (cell.object) {
        case "white":
          counter++;
          const elWhite = createElement(
            cell,
            cylMateWhite,
            counter,
            board,
            lineID,
            cellID
          );
          board = elWhite.board;
          scene.add(elWhite.cylinder);
          break;
        case "black":
          counter++;
          const elblack = createElement(
            cell,
            cylMateBlack,
            counter,
            board,
            lineID,
            cellID
          );
          board = elblack.board;
          scene.add(elblack.cylinder);
          break;
      }
    });
  });

  return {
    board,
  };
};
