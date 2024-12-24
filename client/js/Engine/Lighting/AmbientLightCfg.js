import * as THREE from "three";

export const AmbientLightCfg = () => {
  const light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);

  light.color.set(0xff0000); // Изменение цвета света
  light.intensity = 0.7; // Изменение интенсивности
};
