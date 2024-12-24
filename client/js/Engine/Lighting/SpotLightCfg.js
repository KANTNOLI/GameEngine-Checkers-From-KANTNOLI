import * as THREE from "three";

export const SpotLightCfg = () => {
    const light = new THREE.SpotLight(0x00ff00, 1); // Зеленый свет с интенсивностью 1
    light.position.set(100, 100, 100);
    scene.add(light);
    
    light.color.set(0xffa500); // Изменение цвета света
    light.intensity = 2; // Изменение интенсивности
    light.distance = 300; // Изменение максимального расстояния света
    light.angle = Math.PI / 4; // Изменение угла освещения
    light.penumbra = 0.1; // Изменение полутона (penumbra)
    light.decay = 2; // Изменение коэффициента затухания света
    light.castShadow = true; // Включение теней
    light.shadow.bias = 0.0001; // Пример значения для shadow.bias
    light.shadow.mapSize.width = 2048; // Установка размера карты теней
    light.shadow.mapSize.height = 2048; // Установка размера карты теней
};
