import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export const boardSetup = (scene, camera, lighting, controls) => {
  const modelsLoader = new GLTFLoader();

  modelsLoader.load("models/chessboard.glb", (model) => {
    // для удобства клеток
    model.scene.position.y = -0.0777;
    model.scene.position.x = 0.115;
    model.scene.position.z = 0.115;
    model.scene.scale.set(1, 0.5, 1); // ширина высота длина от дефолт значений
    model.scene.traverse((node) => {
      if (node.isMesh) {
        node.userData.board = true;
        node.receiveShadow = true;
      }
    });

    // Точка относит которйо будем крутиться (модельки доски)
    controls.target.copy(model.scene.position);

    camera.lookAt(model.scene.position);
    lighting.light.lookAt(model.scene.position);
    lighting.backLight.lookAt(model.scene.position);

    scene.add(model.scene);
  });
  return modelsLoader;
};
