export const CameraLimitSquare = (
  camera,
  position = {
    height: 10,
    length: 10,
  }
) => {
  camera.position.x = Math.max(
    -position.length,
    Math.min(position.length, camera.position.x)
  );
  camera.position.y = Math.max(
    -position.height,
    Math.min(position.height, camera.position.y)
  );
  camera.position.z = Math.max(
    -position.length,
    Math.min(position.length, camera.position.z)
  );
  
  return camera;
};
