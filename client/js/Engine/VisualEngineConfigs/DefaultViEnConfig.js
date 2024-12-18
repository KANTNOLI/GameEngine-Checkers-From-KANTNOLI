import * as THREE from "three";

export const DefaultViEnConfig = () => {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    precision: "lowp",
    powerPreference: "high-performance",
    depth: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  //BasicShadowMap low
  //PCFShadowMap norm
  //PCFSoftShadowMap super
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  return renderer;
};
