import * as THREE from "three";

export const PointLightCfg = () => {
    const light = new THREE.PointLight(0xff0000, 1, 100); // Красный свет с интенс 1 и расстоянием 100
    light.position.set(50, 50, 50);
    scene.add(light);
    
    light.color.set(0x0000ff); // Изменение цвета света
    light.intensity = 1.5; // Изменение интенсивности
    light.distance = 200; // Изменение максимального расстояния света
    light.decay = 2; // Изменение коэффициента затухания света
    light.castShadow = true; // Включение теней
    light.shadow.bias = 0.0005; // Пример значения для shadow.bias
    light.shadow.mapSize.width = 512; // Установка размера карты теней
    light.shadow.mapSize.height = 512; // Установка размера карты теней
};
