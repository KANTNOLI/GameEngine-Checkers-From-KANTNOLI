export const boardSetup = (loader, scene, camera, light, controls) => {
  loader.load("models/chessboard.glb", (gltf) => {
    gltf.scene.position.y = -0.0777;
    gltf.scene.position.x = 0.115;
    gltf.scene.position.z = 0.115;
    gltf.scene.scale.set(1, 0.5, 1);
    gltf.scene.traverse((node) => {
      if (node.isMesh) {
        node.userData.board = true;
        node.receiveShadow = true;
      }
    });
    controls.target.copy(gltf.scene.position);
    camera.lookAt(gltf.scene.position);
    light.lookAt(gltf.scene.position);

    scene.add(gltf.scene);
  });
  return loader;
};
