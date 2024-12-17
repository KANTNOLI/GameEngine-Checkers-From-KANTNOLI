import * as THREE from "three";

export const DefaultCameraSettings = (position = { x: 0, y: 1.5, z: 1.5 }) => {
 //создание переменной ради 1 использования тупо

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10);
  camera.position.x = position.x;
  camera.position.y = position.y;
  camera.position.z = position.z;

  return camera;
};
