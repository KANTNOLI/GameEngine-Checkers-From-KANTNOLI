import * as THREE from "three";

export const DirectionalLightCfg = () => {
const light = new THREE.DirectionalLight(0xffffff, 1); // Белый свет с интенсивностью 1
light.position.set(1, 1, 1).normalize();
scene.add(light);

light.color.set(0x00ff00); // Изменение цвета света
light.intensity = 0.8; // Изменение интенсивности
light.castShadow = true; // Включение теней
light.shadow.bias = 0.0001; // Пример значения для shadow.bias
light.shadow.mapSize.width = 1024; // Установка размера карты теней
light.shadow.mapSize.height = 1024; // Установка размера карты теней
}