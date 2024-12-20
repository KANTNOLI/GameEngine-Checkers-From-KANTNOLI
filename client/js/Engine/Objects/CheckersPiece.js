import * as THREE from "three";

export const CheckersPiece = (
  scene,
  gameArea,
  object = { type: "checkerPiece", side: "other", link: null },
  position = { x: 0, z: 0 }
) => {
  // для удобство разбил сразу на 2
  const STEP = 0.235; // констант значение, используется только в данной ситуации для данной доски, т.к. так же как и значеня позиций самой доскиF
  const pieceGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
  let pieceMaterial = null;

  switch (object.side) {
    case "black":
      pieceMaterial = new THREE.MeshStandardMaterial({
        color: 0x303030,
      });
      break;
    case "white":
      pieceMaterial = new THREE.MeshStandardMaterial({
        color: 0xe0e0e0,
      });
      break;
    default:
      pieceMaterial = new THREE.MeshStandardMaterial({
        color: 0x800080,
      });
      break;
  }

  const piece = new THREE.Mesh(pieceGeometry, pieceMaterial);
  piece.castShadow = true; //тени
  piece.receiveShadow = true; // тени
  piece.position.x = STEP * (position.x - 3); // считаем позицию
  piece.position.z = STEP * (position.z - 3); // считаем позицию
  piece.metaData = {
    object,
    position,
  }; // для удобства, чтоюы потом не искать и не кушать произв

  gameArea[position.z][position.x].link = piece; // сохраняем ссылку, для удобной работы
  scene.add(piece);

  return gameArea;
};
