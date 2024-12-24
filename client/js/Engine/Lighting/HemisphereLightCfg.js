import * as THREE from "three";

export const SpotLightCfg = () => {
  const light = new THREE.HemisphereLight(0x4040ff, 0x80ff80, 0.5); // Свет неба и земли с интенсивностью 0.5
  scene.add(light);

  light.skyColor.set(0xff0000); // Изменение цвета неба
  light.groundColor.set(0x00ff00); // Изменение цвета земли
  light.intensity = 0.7; // Изменение интенсивности
};
